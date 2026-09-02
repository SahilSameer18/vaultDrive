import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { formatBytes } from "../../utils/formatters";
import {
  createQueueItems,
  processUploadBatch,
  MAX_BATCH_FILES,
  MAX_FILE_SIZE_BYTES,
} from "../../utils/uploadQueue";

export default function UploadModal({ isOpen, onClose, folderId = null }) {
  const [queue, setQueue] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const fileInputRef = useRef(null);
  const queueControllerRef = useRef(null);

  if (!isOpen) return null;

  const handleFilesSelected = (filesList) => {
    if (!filesList || filesList.length === 0) return;

    const filesArray = Array.from(filesList);
    if (queue.length + filesArray.length > MAX_BATCH_FILES) {
      setError(`You can upload a maximum of ${MAX_BATCH_FILES} files per batch.`);
      return;
    }

    // Check individual file sizes (100MB limit)
    for (const f of filesArray) {
      if (f.size > MAX_FILE_SIZE_BYTES) {
        setError(`"${f.name}" exceeds the 100MB single-file limit.`);
        return;
      }
    }

    setError("");
    const newItems = createQueueItems(filesArray);
    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (uploading) return;
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleItemDragStart = (e, index) => {
    if (uploading) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || uploading) return;

    setQueue((prev) => {
      const next = [...prev];
      const item = next.splice(draggedIndex, 1)[0];
      next.splice(index, 0, item);
      return next;
    });
    setDraggedIndex(index);
  };

  const handleItemDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleRemoveOrCancelItem = (id) => {
    if (uploading && queueControllerRef.current) {
      queueControllerRef.current.cancelItem(id);
    } else {
      setQueue((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleStartUpload = () => {
    if (queue.length === 0 || uploading) return;

    setError("");
    setUploading(true);

    const controller = processUploadBatch(queue, folderId, {
      onUpdateItem: (updatedItem) => {
        setQueue((prev) =>
          prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
      },
      onBatchComplete: (summary) => {
        setUploading(false);
        window.dispatchEvent(new CustomEvent("vault:files-changed"));
        window.dispatchEvent(new CustomEvent("vault:file-uploaded"));

        if (summary.completed > 0 && summary.failed === 0 && summary.cancelled === 0) {
          // If all succeeded, auto-close after 800ms
          setTimeout(() => {
            handleClose();
          }, 800);
        }
      },
    });

    queueControllerRef.current = controller;
  };

  const handleStopAllUploads = () => {
    if (queueControllerRef.current) {
      queueControllerRef.current.cancelAll();
    }
    setUploading(false);
  };

  const handleClose = () => {
    if (uploading && queueControllerRef.current) {
      queueControllerRef.current.cancelAll();
    }
    setQueue([]);
    setUploading(false);
    setError("");
    onClose();
  };

  const totalBytes = queue.reduce((acc, curr) => acc + curr.size, 0);
  const completedCount = queue.filter((i) => i.status === "COMPLETED").length;
  const isFinished = queue.length > 0 && queue.every((i) => i.status === "COMPLETED" || i.status === "FAILED" || i.status === "CANCELLED");

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-vault-border bg-vault-panel p-6 shadow-2xl z-10 fade-in select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-vault-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-vault-surface border border-vault-accent/40 flex items-center justify-center text-vault-accent shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-vault-text">
                {uploading ? "Uploading Batch..." : "Upload Files to Vault"}
              </h3>
              <p className="text-[10px] font-mono text-vault-muted">
                {uploading
                  ? `Processing 2 parallel streams (${completedCount}/${queue.length} completed)`
                  : `Select up to ${MAX_BATCH_FILES} files · 100MB per file`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-vault-muted hover:text-vault-text text-sm p-1.5 rounded-lg hover:bg-vault-surface transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-vault-danger/10 border border-vault-danger/30 text-vault-danger text-xs font-mono">
            [ERROR] {error}
          </div>
        )}

        {/* Dropzone (When not uploading and under max batch limit) */}
        {!uploading && queue.length < MAX_BATCH_FILES && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-vault-border hover:border-vault-accent/60 bg-vault-surface/40 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors mb-4 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />

            <div className="w-10 h-10 rounded-xl bg-vault-panel border border-vault-accent/30 flex items-center justify-center text-vault-accent mb-2 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p className="text-xs font-medium text-vault-text">
              {queue.length > 0 ? "Click or drop more files to add to batch" : "Drag and drop files here or click to browse"}
            </p>
            <p className="text-[10px] font-mono text-vault-muted mt-1">
              Select multiple files (up to {MAX_BATCH_FILES - queue.length} more)
            </p>
          </div>
        )}

        {/* Selected Batch File List with Live Status, Reorder & Cancel */}
        {queue.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-4">
            {queue.map((item, index) => (
              <div
                key={item.id}
                draggable={!uploading}
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDragEnd={handleItemDragEnd}
                className={`p-3 rounded-xl border bg-vault-surface/60 space-y-2 transition-all ${
                  draggedIndex === index
                    ? "border-vault-accent bg-vault-accent/10 opacity-70 scale-[0.99]"
                    : "border-vault-border hover:border-vault-border/80"
                } ${!uploading ? "cursor-grab active:cursor-grabbing" : ""}`}
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Subtle Drag Grip Icon (When not uploading) */}
                    {!uploading && queue.length > 1 && (
                      <span className="text-vault-muted/60 hover:text-vault-accent text-xs select-none cursor-grab font-mono" title="Drag to reorder">
                        ⋮⋮
                      </span>
                    )}

                    <span className="font-mono text-vault-accent font-bold text-[10px] shrink-0">
                      {item.status === "COMPLETED"
                        ? "✅"
                        : item.status === "UPLOADING"
                        ? "⏳"
                        : item.status === "FAILED"
                        ? "⚠️"
                        : item.status === "CANCELLED"
                        ? "🚫"
                        : "⏸️"}
                    </span>
                    <span className={`font-medium truncate ${item.status === "CANCELLED" ? "line-through text-vault-muted" : "text-vault-text"}`}>
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[10px] font-mono text-vault-muted">
                      {formatBytes(item.size)}
                    </span>

                    {/* Status Badges */}
                    {item.status === "COMPLETED" && (
                      <span className="text-[9px] font-mono font-semibold text-emerald-400 uppercase">Done</span>
                    )}

                    {item.status === "UPLOADING" && (
                      <span className="text-[9px] font-mono font-semibold text-vault-accent">{item.progress}%</span>
                    )}

                    {item.status === "FAILED" && (
                      <span className="text-[9px] font-mono font-semibold text-vault-danger">Failed</span>
                    )}

                    {item.status === "CANCELLED" && (
                      <span className="text-[9px] font-mono font-semibold text-vault-muted uppercase">Cancelled</span>
                    )}

                    {/* Cancel/Remove Button for pending or active items */}
                    {(item.status === "WAITING" || item.status === "UPLOADING") && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOrCancelItem(item.id)}
                        className="text-vault-muted hover:text-vault-danger text-xs p-1 rounded hover:bg-vault-danger/10 transition-colors cursor-pointer"
                        title={uploading ? "Cancel this upload" : "Remove from batch"}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Progress Bar for Uploading & Completed */}
                {(item.status === "UPLOADING" || item.status === "COMPLETED") && (
                  <div className="h-1.5 w-full rounded-full bg-vault-panel border border-vault-border overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 rounded-full ${
                        item.status === "COMPLETED"
                          ? "bg-emerald-400"
                          : "bg-gradient-to-r from-vault-accent to-amber-400"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Summary & Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-vault-border">
          <div className="text-[11px] font-mono text-vault-muted">
            {queue.length > 0 && (
              <span>
                Total: <strong className="text-vault-text">{formatBytes(totalBytes)}</strong> ({queue.length} {queue.length === 1 ? "file" : "files"})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {uploading ? (
              <button
                type="button"
                onClick={handleStopAllUploads}
                className="px-4 py-2 rounded-xl border border-vault-danger/40 bg-vault-danger/10 text-xs font-medium text-vault-danger hover:bg-vault-danger/20 transition-colors cursor-pointer"
              >
                Stop Upload
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-vault-border text-xs font-medium text-vault-muted hover:text-vault-text transition-colors cursor-pointer"
              >
                {isFinished ? "Close" : "Cancel"}
              </button>
            )}

            {!isFinished && !uploading && (
              <button
                type="button"
                onClick={handleStartUpload}
                disabled={queue.length === 0 || uploading}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-vault-bg bg-gradient-to-r from-vault-accent to-vault-accent-hover hover:brightness-110 disabled:opacity-50 transition-all shadow-md cursor-pointer"
              >
                Upload {queue.length > 0 ? `(${queue.length})` : ""}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
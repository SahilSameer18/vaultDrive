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
      setError(`Maximum batch limit is ${MAX_BATCH_FILES} files.`);
      return;
    }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] p-6 shadow-2xl z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-accent)]/40 flex items-center justify-center text-[var(--theme-accent)] shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--theme-text)]">
                {uploading ? "Ingesting Payload Batch..." : "Upload Assets to Vault"}
              </h3>
              <p className="text-[10px] font-mono text-[var(--theme-text-muted)] tracking-wider">
                {uploading
                  ? `2 PARALLEL STREAMS (${completedCount}/${queue.length} COMPLETED)`
                  : `UP TO ${MAX_BATCH_FILES} ASSETS · 100MB LIMIT PER FILE`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-7 h-7 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:border-[var(--theme-accent)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold">✕</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            [ERROR] {error}
          </div>
        )}

        {/* Dropzone Aperture */}
        {!uploading && queue.length < MAX_BATCH_FILES && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[var(--theme-border)] hover:border-[var(--theme-accent)] bg-[var(--theme-surface)]/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all mb-4 group shadow-inner"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />

            <div className="w-11 h-11 rounded-xl bg-[var(--theme-panel)] border border-[var(--theme-accent)]/30 flex items-center justify-center text-[var(--theme-accent)] mb-2.5 group-hover:scale-105 group-hover:border-[var(--theme-accent)] transition-all shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p className="text-xs font-semibold text-[var(--theme-text)] group-hover:text-[var(--theme-accent)] transition-colors">
              {queue.length > 0 ? "Click or drop additional files to append" : "Drag & drop files or click to browse filesystem"}
            </p>
            <p className="text-[10px] font-mono text-[var(--theme-text-muted)] mt-1">
              Select multiple assets ({MAX_BATCH_FILES - queue.length} slots available)
            </p>
          </div>
        )}

        {/* Batch Queue with Live Progress */}
        {queue.length > 0 && (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-4 scrollbar-thin">
            {queue.map((item, index) => (
              <div
                key={item.id}
                draggable={!uploading}
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDragEnd={handleItemDragEnd}
                className={`p-3 rounded-xl border bg-[var(--theme-surface)]/70 space-y-2 transition-all ${
                  draggedIndex === index
                    ? "border-[var(--theme-accent)] bg-[var(--theme-accent)]/10 opacity-70 scale-[0.99]"
                    : "border-[var(--theme-border)] hover:border-[var(--theme-border)]/80"
                } ${!uploading ? "cursor-grab active:cursor-grabbing" : ""}`}
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {!uploading && queue.length > 1 && (
                      <span className="text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)] text-xs select-none cursor-grab font-mono" title="Drag to reorder">
                        ⋮⋮
                      </span>
                    )}

                    <span className="font-mono text-xs shrink-0">
                      {item.status === "COMPLETED"
                        ? "🟢"
                        : item.status === "UPLOADING"
                        ? "⚡"
                        : item.status === "FAILED"
                        ? "⚠️"
                        : item.status === "CANCELLED"
                        ? "🚫"
                        : "⏳"}
                    </span>
                    <span className={`font-medium truncate ${item.status === "CANCELLED" ? "line-through text-[var(--theme-text-muted)]" : "text-[var(--theme-text)]"}`}>
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[10px] font-mono text-[var(--theme-text-muted)]">
                      {formatBytes(item.size)}
                    </span>

                    {/* Status Badges */}
                    {item.status === "COMPLETED" && (
                      <span className="text-[9px] font-mono font-semibold text-emerald-400 uppercase">Encrypted</span>
                    )}

                    {item.status === "UPLOADING" && (
                      <span className="text-[9px] font-mono font-semibold text-[var(--theme-accent)]">{item.progress}%</span>
                    )}

                    {item.status === "FAILED" && (
                      <span className="text-[9px] font-mono font-semibold text-rose-400">Failed</span>
                    )}

                    {item.status === "CANCELLED" && (
                      <span className="text-[9px] font-mono font-semibold text-[var(--theme-text-muted)] uppercase">Aborted</span>
                    )}

                    {(item.status === "WAITING" || item.status === "UPLOADING") && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOrCancelItem(item.id)}
                        className="text-[var(--theme-text-muted)] hover:text-rose-400 text-xs p-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title={uploading ? "Cancel stream" : "Remove from queue"}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Progress Bar with Champagne Gradient */}
                {(item.status === "UPLOADING" || item.status === "COMPLETED") && (
                  <div className="h-1.5 w-full rounded-full bg-[var(--theme-panel)] border border-[var(--theme-border)] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 rounded-full ${
                        item.status === "COMPLETED"
                          ? "bg-emerald-400"
                          : "bg-gradient-to-r from-[var(--theme-accent)] to-[#e6af2e]"
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
        <div className="flex items-center justify-between pt-3 border-t border-[var(--theme-border)]">
          <div className="text-[11px] font-mono text-[var(--theme-text-muted)]">
            {queue.length > 0 && (
              <span>
                Total Payload: <strong className="text-[var(--theme-text)]">{formatBytes(totalBytes)}</strong> ({queue.length} {queue.length === 1 ? "item" : "items"})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {uploading ? (
              <button
                type="button"
                onClick={handleStopAllUploads}
                className="px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs font-mono font-medium text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                Abort Stream
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-[var(--theme-border)] text-xs font-mono text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors cursor-pointer"
              >
                {isFinished ? "Dismiss" : "Cancel"}
              </button>
            )}

            {!isFinished && !uploading && (
              <button
                type="button"
                onClick={handleStartUpload}
                disabled={queue.length === 0 || uploading}
                className="px-5 py-2 rounded-xl text-xs font-mono font-semibold text-[#0d0f12] bg-[var(--theme-accent)] hover:brightness-110 disabled:opacity-50 transition-all shadow-md cursor-pointer"
              >
                Ingest {queue.length > 0 ? `(${queue.length})` : ""}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
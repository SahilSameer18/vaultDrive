import { filesApi } from "../api/files.api";

export const CONCURRENCY_LIMIT = 2;
export const MAX_BATCH_FILES = 10;
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export function generateQueueId() {
  return `up_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function createQueueItems(fileList) {
  const filesArray = Array.from(fileList || []).slice(0, MAX_BATCH_FILES);
  return filesArray.map((file) => ({
    id: generateQueueId(),
    file,
    name: file.name,
    size: file.size,
    status: "WAITING", // WAITING | UPLOADING | COMPLETED | FAILED | CANCELLED
    progress: 0,
    error: null,
    result: null,
    controller: new AbortController(),
  }));
}

/**
 * Processes a batch of files with a controlled concurrency pool of 2 workers
 * @param {Array} items - List of queue items
 * @param {string|null} folderId - Target folder ID
 * @param {Object} callbacks - { onUpdateItem, onBatchComplete }
 * @returns {Object} { cancelAll, cancelItem }
 */
export function processUploadBatch(items, folderId, { onUpdateItem, onBatchComplete }) {
  let isCancelled = false;
  let activeCount = 0;
  let currentIndex = 0;
  const queue = [...items];

  const results = {
    total: queue.length,
    completed: 0,
    failed: 0,
    cancelled: 0,
  };

  function checkDone() {
    if (activeCount === 0 && currentIndex >= queue.length) {
      if (onBatchComplete) {
        onBatchComplete(results);
      }
    }
  }

  function launchNext() {
    if (isCancelled || currentIndex >= queue.length) {
      checkDone();
      return;
    }

    while (activeCount < CONCURRENCY_LIMIT && currentIndex < queue.length) {
      const item = queue[currentIndex];
      currentIndex++;

      if (!item || item.status !== "WAITING") continue;

      activeCount++;
      item.status = "UPLOADING";
      item.progress = 0;
      onUpdateItem && onUpdateItem({ ...item });

      (async (uploadItem) => {
        try {
          const res = await filesApi.uploadDirectToCloudinary(
            uploadItem.file,
            folderId,
            (prog) => {
              if (!isCancelled && uploadItem.status === "UPLOADING") {
                uploadItem.progress = prog.percent || 0;
                onUpdateItem && onUpdateItem({ ...uploadItem });
              }
            },
            uploadItem.controller.signal
          );

          if (!isCancelled && uploadItem.status === "UPLOADING") {
            uploadItem.status = "COMPLETED";
            uploadItem.progress = 100;
            uploadItem.result = res.data?.data;
            results.completed++;
            onUpdateItem && onUpdateItem({ ...uploadItem });
          }
        } catch (err) {
          if (uploadItem.status !== "CANCELLED") {
            uploadItem.status = "FAILED";
            uploadItem.error = err.response?.data?.message || err.message || "Upload failed";
            results.failed++;
            onUpdateItem && onUpdateItem({ ...uploadItem });
          }
        } finally {
          activeCount--;
          if (!isCancelled) {
            launchNext();
          } else {
            checkDone();
          }
        }
      })(item);
    }
  }

  // Start initial parallel batch
  launchNext();

  // Return cancel handlers
  return {
    cancelAll: () => {
      isCancelled = true;
      queue.forEach((item) => {
        if (item.status === "WAITING") {
          item.status = "CANCELLED";
          results.cancelled++;
          onUpdateItem && onUpdateItem({ ...item });
        } else if (item.status === "UPLOADING") {
          item.controller.abort();
          item.status = "CANCELLED";
          results.cancelled++;
          onUpdateItem && onUpdateItem({ ...item });
        }
      });
      checkDone();
    },

    cancelItem: (itemId) => {
      const item = queue.find((i) => i.id === itemId);
      if (!item) return;

      if (item.status === "WAITING") {
        item.status = "CANCELLED";
        results.cancelled++;
        onUpdateItem && onUpdateItem({ ...item });
      } else if (item.status === "UPLOADING") {
        item.controller.abort();
        item.status = "CANCELLED";
        results.cancelled++;
        onUpdateItem && onUpdateItem({ ...item });
        // The finally block in the async runner will automatically call launchNext()
      }
    },
  };
}

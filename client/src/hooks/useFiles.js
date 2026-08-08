import { useState, useCallback } from "react";
import { filesApi } from "../api/files.api";

export function useFiles(folderId = null) {
  const [files, setFiles]     = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Fetch files inside current folder
  const fetchFiles = useCallback(async (targetFolderId = folderId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await filesApi.list(targetFolderId);
      setFiles(res.data.data.files || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  // Upload file with progress
  const uploadFile = async (file, currentFolderId = folderId, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    if (currentFolderId) formData.append("folderId", currentFolderId);

    const res = await filesApi.upload(formData, (evt) => {
      if (onProgress && evt.total) {
        const percent = Math.round((evt.loaded * 100) / evt.total);
        onProgress(percent);
      }
    });

    const newFile = res.data.data.file;
    setFiles((prev) => [newFile, ...prev]);
    return newFile;
  };

  // Toggle privacy status using filesApi.update (PATCH /files/:id)
  const togglePrivacy = async (fileId, isPublic) => {
    const res = await filesApi.update(fileId, { isPublic });
    const updated = res.data.data.file;
    setFiles((prev) => prev.map((f) => (f.id === fileId ? updated : f)));
    return updated;
  };

  // Delete file
  const deleteFile = async (fileId) => {
    await filesApi.delete(fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Filtered files by search query
  const filteredFiles = files.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  );

  return {
    files: filteredFiles,
    allFiles: files,
    search,
    setSearch,
    loading,
    error,
    fetchFiles,
    uploadFile,
    togglePrivacy,
    deleteFile,
  };
}

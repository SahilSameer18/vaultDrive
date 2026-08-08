import { useState, useCallback } from "react";
import { filesApi } from "../api/files.api";
import { useSearch } from "../context/SearchContext";

export function useFiles(folderId = null) {
  const [files, setFiles]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const { searchQuery }       = useSearch();

  // Fetch files inside current folder (defaults to 'root' for root-level files)
  const fetchFiles = useCallback(async (targetFolderId = folderId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await filesApi.list(targetFolderId || "root");
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

  // Toggle privacy status via share-link generate/revoke endpoints so isPublic and shareToken stay 100% in sync!
  const togglePrivacy = async (fileId, currentIsPublic) => {
    if (!currentIsPublic) {
      // Make Public: generate share link (backend sets isPublic=true & creates shareToken)
      const res = await filesApi.generateShareLink(fileId);
      const { shareToken } = res.data.data;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, isPublic: true, shareToken } : f
        )
      );
      return { id: fileId, isPublic: true, shareToken };
    } else {
      // Make Private: revoke share link (backend sets isPublic=false & clears shareToken)
      await filesApi.revokeShareLink(fileId);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, isPublic: false, shareToken: null } : f
        )
      );
      return { id: fileId, isPublic: false, shareToken: null };
    }
  };

  // Delete file
  const deleteFile = async (fileId) => {
    await filesApi.delete(fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Update single file in state (e.g. after ShareModal update)
  const updateFileInState = (updatedFile) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === updatedFile.id ? { ...f, ...updatedFile } : f))
    );
  };

  // Filtered files by global search query
  const filteredFiles = files.filter((f) =>
    f.name?.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return {
    files: filteredFiles,
    allFiles: files,
    loading,
    error,
    fetchFiles,
    uploadFile,
    togglePrivacy,
    deleteFile,
    updateFileInState,
  };
}

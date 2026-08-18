import { useState, useCallback, useEffect } from "react";
import { filesApi } from "../api/files.api";
import { useSearch } from "../context/SearchContext";

export function useFiles(folderId = null) {
  const [files, setFiles]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [sortBy, setSortBy]       = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage]           = useState(1);
  const [limit, setLimit]         = useState(20);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 1,
  });
  const { searchQuery, debouncedSearchQuery } = useSearch();

  // Fetch files inside current folder with server-side search, sorting, and pagination
  const fetchFiles = useCallback(async (targetFolderId = folderId) => {
    setLoading(true);
    setError(null);
    try {
      // If debouncedSearchQuery is present, query whole vault (null folderId)
      const param = debouncedSearchQuery ? null : (targetFolderId || "root");
      const queryParams = {
        search: debouncedSearchQuery?.trim() || undefined,
        sortBy,
        sortOrder,
        page,
        limit,
      };
      const res = await filesApi.list(param, queryParams);
      setFiles(res.data.data.files || []);
      if (res.data.data.pagination) {
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [folderId, debouncedSearchQuery, sortBy, sortOrder, page, limit]);

  // Reset page to 1 whenever folderId or debouncedSearchQuery changes
  useEffect(() => {
    setPage(1);
  }, [folderId, debouncedSearchQuery]);

  // Re-fetch whenever dependencies change
  useEffect(() => {
    fetchFiles(folderId);
  }, [debouncedSearchQuery, sortBy, sortOrder, page, limit, fetchFiles, folderId]);



  // Upload file directly to Cloudinary with signature & progress
  const uploadFile = async (file, currentFolderId = folderId, onProgress) => {
    const res = await filesApi.uploadDirectToCloudinary(
      file,
      currentFolderId,
      (evt) => {
        if (onProgress && evt.percent !== undefined) {
          onProgress(evt.percent);
        }
      }
    );

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

  // Rename file
  const renameFile = async (fileId, newName) => {
    const res = await filesApi.update(fileId, { name: newName });
    const updatedFile = res.data.data.file;
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, ...updatedFile } : f))
    );
    return updatedFile;
  };

  // Update single file in state (e.g. after ShareModal update)
  const updateFileInState = (updatedFile) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === updatedFile.id ? { ...f, ...updatedFile } : f))
    );
  };

  return {
    files,
    loading,
    error,
    sortBy,
    sortOrder,
    page,
    limit,
    pagination,
    setSortBy,
    setSortOrder,
    setPage,
    setLimit,
    fetchFiles,
    uploadFile,
    togglePrivacy,
    deleteFile,
    renameFile,
    updateFileInState,
  };
}
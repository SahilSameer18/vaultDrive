import { useState, useCallback, useEffect } from "react";
import { foldersApi } from "../api/folders.api";
import { useSearch } from "../context/SearchContext";

export function useFolders(currentFolderId = null) {
  const [folders, setFolders]         = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const { searchQuery, debouncedSearchQuery } = useSearch();

  // Fetch subfolders and ancestor breadcrumbs for current directory
  const fetchFolders = useCallback(async (targetFolderId = currentFolderId) => {
    setLoading(true);
    setError(null);
    try {
      if (debouncedSearchQuery) {
        // Fetch ALL user folders for global search across directories
        const res = await foldersApi.list(null);
        setFolders(res.data.data.folders || []);
      } else if (targetFolderId) {
        // Fetch subfolder details + breadcrumb path
        const res = await foldersApi.getById(targetFolderId);
        setFolders(res.data.data.folder?.children || []);
        setBreadcrumbs(res.data.data.folder?.breadcrumbs || []);
      } else {
        // Fetch root-level folders via list("root")
        const res = await foldersApi.list("root");
        setFolders(res.data.data.folders || []);
        setBreadcrumbs([{ id: null, name: "Home" }]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load folders");
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, debouncedSearchQuery]);

  // Re-fetch whenever debouncedSearchQuery changes
  useEffect(() => {
    fetchFolders(currentFolderId);
  }, [debouncedSearchQuery, fetchFolders, currentFolderId]);


  // Create new subfolder
  const createFolder = async (name, parentId = currentFolderId) => {
    const res = await foldersApi.create({ name, parentId });
    const newFolder = res.data.data.folder;
    setFolders((prev) => [newFolder, ...prev]);
    return newFolder;
  };

  // Rename folder
  const renameFolder = async (folderId, name) => {
    const res = await foldersApi.update(folderId, { name });
    const updated = res.data.data.folder;
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name: updated.name } : f))
    );
    return updated;
  };

  // Delete folder
  const deleteFolder = async (folderId) => {
    await foldersApi.delete(folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
  };

  // Filtered subfolders by global search query
  const filteredFolders = folders.filter((f) =>
    f.name?.toLowerCase().includes((searchQuery || "").toLowerCase().trim())
  );

  return {
    folders: filteredFolders,
    allFolders: folders,
    breadcrumbs,
    loading,
    error,
    fetchFolders,
    createFolder,
    renameFolder,
    deleteFolder,
  };
}

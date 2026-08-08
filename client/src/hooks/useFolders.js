import { useState, useCallback } from "react";
import { foldersApi } from "../api/folders.api";

export function useFolders(initialFolderId = null) {
  const [currentFolderId, setCurrentFolderId] = useState(initialFolderId);
  const [folders, setFolders]                 = useState([]);
  const [breadcrumbs, setBreadcrumbs]         = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);

  // Fetch folders for current parent folder & breadcrumb chain
  const fetchFolders = useCallback(async (targetParentId = currentFolderId) => {
    setLoading(true);
    setError(null);
    try {
      if (targetParentId) {
        // Fetch detailed folder info including children and breadcrumbs
        const res = await foldersApi.getById(targetParentId);
        const folder = res.data.data.folder;
        setFolders(folder.children || []);
        setBreadcrumbs(folder.breadcrumbs || []);
      } else {
        // Fetch root-level folders
        const res = await foldersApi.list("root");
        setFolders(res.data.data.folders || []);
        setBreadcrumbs([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load folders");
    } finally {
      setLoading(false);
    }
  }, [currentFolderId]);

  // Create folder (sends { name, parentId })
  const createFolder = async (name, parentId = currentFolderId) => {
    const res = await foldersApi.create({ name, parentId: parentId || null });
    const newFolder = res.data.data.folder;
    setFolders((prev) => [newFolder, ...prev]);
    return newFolder;
  };

  // Rename folder (uses PATCH)
  const renameFolder = async (folderId, newName) => {
    const res = await foldersApi.update(folderId, { name: newName });
    const updated = res.data.data.folder;
    setFolders((prev) => prev.map((f) => (f.id === folderId ? updated : f)));
    return updated;
  };

  // Delete folder
  const deleteFolder = async (folderId) => {
    await foldersApi.delete(folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
  };

  return {
    currentFolderId,
    setCurrentFolderId,
    folders,
    breadcrumbs,
    setBreadcrumbs,
    loading,
    error,
    fetchFolders,
    createFolder,
    renameFolder,
    deleteFolder,
  };
}

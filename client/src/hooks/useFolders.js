import { useState, useCallback } from "react";
import { foldersApi } from "../api/folders.api";
import { useSearch } from "../context/SearchContext";

export function useFolders(currentFolderId = null) {
  const [folders, setFolders]         = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const { searchQuery }               = useSearch();

  // Fetch subfolders and ancestor breadcrumbs for current directory
  const fetchFolders = useCallback(async (targetFolderId = currentFolderId) => {
    setLoading(true);
    setError(null);
    try {
      if (targetFolderId) {
        // Fetch subfolder details + breadcrumb path
        const res = await foldersApi.getById(targetFolderId);
        setFolders(res.data.data.subfolders || []);
        setBreadcrumbs(res.data.data.breadcrumbs || []);
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
  }, [currentFolderId]);

  // Create new subfolder
  const createFolder = async (name, parentId = currentFolderId) => {
    const res = await foldersApi.create({ name, parentId });
    const newFolder = res.data.data.folder;
    setFolders((prev) => [newFolder, ...prev]);
    return newFolder;
  };

  // Filtered subfolders by global search query
  const filteredFolders = folders.filter((f) =>
    f.name?.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return {
    folders: filteredFolders,
    allFolders: folders,
    breadcrumbs,
    loading,
    error,
    fetchFolders,
    createFolder,
  };
}

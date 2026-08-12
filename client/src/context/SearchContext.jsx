import { createContext, useContext, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);


  return (
    <SearchContext.Provider
      value={{ searchQuery, setSearchQuery, debouncedSearchQuery }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>");
  return ctx;
}




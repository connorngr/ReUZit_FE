import React, { createContext, useContext, useState } from 'react';

interface SearchContextProps {
  query: string;
  setQuery: (query: string) => void;
  categoryId: number | null;
  setCategoryId: (id: number | null) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | null>(null);

  return (
    <SearchContext.Provider value={{ query, setQuery, categoryId, setCategoryId }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

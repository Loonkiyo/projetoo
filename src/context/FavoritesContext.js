import { createContext, useContext } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ value, children }) {
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

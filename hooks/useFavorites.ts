import { useState, useEffect } from 'react';

interface FavoriteLocation {
  id: string;
  name: string;
  address: string;
  coords: [number, number];
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorite_locations');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const addFavorite = (location: Omit<FavoriteLocation, 'id'>) => {
    const newFav = { ...location, id: Date.now().toString() };
    const updated = [...favorites, newFav];
    setFavorites(updated);
    localStorage.setItem('favorite_locations', JSON.stringify(updated));
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorite_locations', JSON.stringify(updated));
  };

  return { favorites, addFavorite, removeFavorite };
};

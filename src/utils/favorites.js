const FAVORITES_KEY = "favoriteRepositories";

const getFavorites = () => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveFavorites = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

const isFavorite = (repoId) => {
  const favorites = getFavorites();
  return favorites.some((repo) => repo.id === repoId);
};

const toggleFavorite = (repository) => {
  const favorites = getFavorites();
  const exists = favorites.some((repo) => repo.id === repository.id);

  if (exists) {
    const updatedFavorites = favorites.filter(
      (repo) => repo.id !== repository.id,
    );
    saveFavorites(updatedFavorites);
    return false;
  }

  const updatedFavorites = [...favorites, repository];
  saveFavorites(updatedFavorites);
  return true;
};

export { getFavorites, saveFavorites, isFavorite, toggleFavorite };

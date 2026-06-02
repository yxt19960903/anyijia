import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  login: (userInfo) => set({ user: userInfo }),
  logout: () => set({ user: null }),

  history: JSON.parse(localStorage.getItem('ai_history') || '[]'),
  addHistory: (record) =>
    set((state) => {
      const newHistory = [record, ...state.history].slice(0, 100);
      localStorage.setItem('ai_history', JSON.stringify(newHistory));
      return { history: newHistory };
    }),

  favorites: JSON.parse(localStorage.getItem('ai_favorites') || '[]'),
  toggleFavorite: (toolId) =>
    set((state) => {
      const favs = state.favorites.includes(toolId)
        ? state.favorites.filter((id) => id !== toolId)
        : [...state.favorites, toolId];
      localStorage.setItem('ai_favorites', JSON.stringify(favs));
      return { favorites: favs };
    }),
}));

export default useAppStore;

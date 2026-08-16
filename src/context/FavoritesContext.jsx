import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const FAVORITES_KEY = 'dh:favorites'
const RECENT_KEY = 'dh:recent'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []
    } catch {
      return []
    }
  })
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent))
  }, [recent])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }, [])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  const trackRecent = useCallback((id) => {
    setRecent((prev) => [id, ...prev.filter((p) => p !== id)].slice(0, 12))
  }, [])

  const value = useMemo(
    () => ({
      favorites,
      recent,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      trackRecent,
    }),
    [favorites, recent, toggleFavorite, isFavorite, clearFavorites, trackRecent],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

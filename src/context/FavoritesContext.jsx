import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useAuth } from './AuthContext'

const FAVORITES_KEY = 'dh:favorites'
const RECENT_KEY = 'dh:recent'

const FavoritesContext = createContext(null)

/*
 * ============================================================
 * FAVORITES STORAGE
 *
 * {
 *   "user-sandhya": ["p101", "p103"],
 *   "user-prasad": ["p102"],
 *   "user-raghava": []
 * }
 * ============================================================
 */

function readFavorites() {
  try {
    const raw = localStorage.getItem(
      FAVORITES_KEY,
    )

    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw)

    /*
     * Old version stored:
     *
     * ["p101", "p102"]
     *
     * Don't allow that global list to be shared
     * between users.
     */
    if (Array.isArray(parsed)) {
      return {}
    }

    if (
      parsed &&
      typeof parsed === 'object'
    ) {
      return parsed
    }

    return {}
  } catch {
    return {}
  }
}

/*
 * ============================================================
 * RECENT STORAGE
 *
 * New structure:
 *
 * {
 *   "user-sandhya": ["p101", "p103", "p102"],
 *   "user-prasad": ["p104", "p102"],
 *   "user-raghava": []
 * }
 *
 * Each user has their own recently viewed list.
 * ============================================================
 */

function readRecent() {
  try {
    const raw = localStorage.getItem(
      RECENT_KEY,
    )

    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw)

    /*
     * Old version stored:
     *
     * ["p101", "p102"]
     *
     * Do not share that global history
     * between users.
     */
    if (Array.isArray(parsed)) {
      return {}
    }

    if (
      parsed &&
      typeof parsed === 'object'
    ) {
      return parsed
    }

    return {}
  } catch {
    return {}
  }
}

export function FavoritesProvider({
  children,
}) {
  /*
   * AuthProvider is above FavoritesProvider
   * in App.jsx, so useAuth() is available here.
   */
  const {
    user,
    isAuthenticated,
  } = useAuth()

  const [favoritesByUser, setFavoritesByUser] =
    useState(() => readFavorites())

  const [recentByUser, setRecentByUser] =
    useState(() => readRecent())

  /*
   * ==========================================================
   * CURRENT USER ID
   * ==========================================================
   */
  const userId = user?.id || null

  /*
   * ==========================================================
   * CURRENT USER FAVORITES
   *
   * Logged out → []
   * Logged in  → that user's favorites only
   * ==========================================================
   */
  const favorites =
    isAuthenticated && userId
      ? favoritesByUser[userId] || []
      : []

  /*
   * ==========================================================
   * CURRENT USER RECENT
   *
   * Logged out → []
   * New user   → []
   * Logged in  → that user's recent history only
   * ==========================================================
   */
  const recent =
    isAuthenticated && userId
      ? recentByUser[userId] || []
      : []

  /*
   * ==========================================================
   * SAVE FAVORITES
   * ==========================================================
   */
  useEffect(() => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favoritesByUser),
    )
  }, [favoritesByUser])

  /*
   * ==========================================================
   * SAVE RECENT
   * ==========================================================
   */
  useEffect(() => {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(recentByUser),
    )
  }, [recentByUser])

  /*
   * ==========================================================
   * TOGGLE FAVORITE
   * ==========================================================
   */
  const toggleFavorite = useCallback(
    (id) => {
      /*
       * No logged-in user:
       * do nothing.
       *
       * PropertyCard already sends
       * the user to /login.
       */
      if (!isAuthenticated || !userId) {
        return
      }

      setFavoritesByUser((previous) => {
        const current =
          previous[userId] || []

        const next = current.includes(id)
          ? current.filter(
              (propertyId) =>
                propertyId !== id,
            )
          : [...current, id]

        return {
          ...previous,
          [userId]: next,
        }
      })
    },
    [isAuthenticated, userId],
  )

  /*
   * ==========================================================
   * IS FAVORITE
   * ==========================================================
   */
  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites],
  )

  /*
   * ==========================================================
   * CLEAR CURRENT USER FAVORITES
   * ==========================================================
   */
  const clearFavorites = useCallback(() => {
    if (!userId) {
      return
    }

    setFavoritesByUser((previous) => ({
      ...previous,
      [userId]: [],
    }))
  }, [userId])

  /*
   * ==========================================================
   * RECENTLY VIEWED
   *
   * Store history separately for each user.
   * Keep only the latest 12 entries internally.
   *
   * Home displays only the latest 3.
   * ==========================================================
   */
  const trackRecent = useCallback(
    (id) => {
      /*
       * Don't store a shared/global history
       * for logged-out visitors.
       */
      if (!isAuthenticated || !userId) {
        return
      }

      setRecentByUser((previous) => {
        const current =
          previous[userId] || []

        const next = [
          id,
          ...current.filter(
            (propertyId) =>
              propertyId !== id,
          ),
        ].slice(0, 12)

        return {
          ...previous,
          [userId]: next,
        }
      })
    },
    [isAuthenticated, userId],
  )

  /*
   * ==========================================================
   * CONTEXT VALUE
   * ==========================================================
   */
  const value = useMemo(
    () => ({
      favorites,
      recent,

      toggleFavorite,
      isFavorite,
      clearFavorites,
      trackRecent,
    }),
    [
      favorites,
      recent,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      trackRecent,
    ],
  )

  return (
    <FavoritesContext.Provider
      value={value}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx =
    useContext(FavoritesContext)

  if (!ctx) {
    throw new Error(
      'useFavorites must be used within FavoritesProvider',
    )
  }

  return ctx
}
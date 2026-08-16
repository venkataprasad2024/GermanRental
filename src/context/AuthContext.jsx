import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'dh:auth'
const USERS_KEY = 'dh:users'

const SEED_USERS = [
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'admin@deutschhome.de',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=5',
    city: 'Berlin',
    createdAt: '2025-01-10',
  },
  {
    id: 'landlord-1',
    name: 'Lars Becker',
    email: 'landlord@deutschhome.de',
    password: 'landlord123',
    role: 'landlord',
    avatar: 'https://i.pravatar.cc/150?img=12',
    city: 'Berlin',
    createdAt: '2025-02-02',
  },
  {
    id: 'tenant-1',
    name: 'Priya Sharma',
    email: 'tenant@deutschhome.de',
    password: 'tenant123',
    role: 'tenant',
    avatar: 'https://i.pravatar.cc/150?img=32',
    city: 'Munich',
    createdAt: '2025-03-15',
  },
]

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return SEED_USERS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_USERS
    return parsed
  } catch {
    return SEED_USERS
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(() => readUsers())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  const persistUser = useCallback((u) => {
    setUser(u)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const register = useCallback(
    ({ name, email, password, role = 'tenant', city = '' }) => {
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (existing) {
        return { ok: false, error: 'An account with this email already exists.' }
      }
      const newUser = {
        id: `u-${Date.now()}`,
        name,
        email,
        password,
        role,
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
        city,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      const next = [...users, newUser]
      setUsers(next)
      writeUsers(next)
      persistUser({ ...newUser, password: undefined })
      return { ok: true, user: newUser }
    },
    [users, persistUser],
  )

  const login = useCallback(
    ({ email, password }) => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )
      if (!found) return { ok: false, error: 'Invalid email or password.' }
      persistUser({ ...found, password: undefined })
      return { ok: true, user: found }
    },
    [users, persistUser],
  )

  const logout = useCallback(() => persistUser(null), [persistUser])

  const requestReset = useCallback(({ email }) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!found) return { ok: false, error: 'No account found with this email.' }
    return { ok: true }
  }, [users])

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isLandlord: user?.role === 'landlord',
      isTenant: user?.role === 'tenant',
      users,
      register,
      login,
      logout,
      requestReset,
    }),
    [user, ready, users, register, login, logout, requestReset],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'dh:auth'
const USERS_KEY = 'dh:users'

const SEED_USERS = [
  /*
   * ORIGINAL DEMO ACCOUNTS
   */
  {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@GermanMitra.de',
  password: 'admin123',
  role: 'admin',
  avatar: 'https://i.pravatar.cc/150?img=5',
  city: 'Berlin',
  createdAt: '2025-01-10',
},

{
  id: 'landlord-1',
  name: 'Lars Becker',
  email: 'landlord@GermanMitra.de',
  password: 'landlord123',
  role: 'landlord',
  avatar: 'https://i.pravatar.cc/150?img=12',
  city: 'Berlin',
  createdAt: '2025-02-02',
},
 
{
  id: 'tenant-1',
  name: 'Priya Sharma',
  email: 'tenant@GermanMitra.de',
  password: 'tenant123',
  role: 'tenant',
  avatar: 'https://i.pravatar.cc/150?img=32',
  city: 'Munich',
  createdAt: '2025-03-15',
},

  /*
   * YOUR NEW DEMO ACCOUNTS
   */
  {
    id: 'user-sandhya',
    name: 'Sandhya',
    email: 'sandhya@germanmitra.com',
    password: 'sandhya@5566',
    role: 'tenant',
    avatar:
      'https://i.pravatar.cc/150?img=47',
    city: 'Berlin',
    createdAt: '2026-08-01',
  },

  {
    id: 'user-prasad',
    name: 'Prasad',
    email: 'prasad@germanmitra.com',
    password: 'prasad@5566',
    role: 'landlord',
    avatar:
      'https://i.pravatar.cc/150?img=12',
    city: 'Munich',
    createdAt: '2026-08-01',
  },

  {
    id: 'user-raghava',
    name: 'Raghava',
    email: 'raghava@germanmitra.com',
    password: 'raghava@5566',
    role: 'tenant',
    avatar:
      'https://i.pravatar.cc/150?img=11',
    city: 'Frankfurt',
    createdAt: '2026-08-01',
  },
]

function readUsers() {
  try {
    const raw =
      localStorage.getItem(USERS_KEY)

    if (!raw) {
      return SEED_USERS
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return SEED_USERS
    }

    /*
     * Keep existing registered/stored users
     * and automatically add missing seed accounts.
     */
    const existingEmails = new Set(
      parsed.map((item) =>
        item.email
          .toLowerCase()
          .trim(),
      ),
    )

    const missingSeedUsers =
      SEED_USERS.filter(
        (seed) =>
          !existingEmails.has(
            seed.email
              .toLowerCase()
              .trim(),
          ),
      )

    const mergedUsers = [
      ...parsed,
      ...missingSeedUsers,
    ]

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(mergedUsers),
    )

    return mergedUsers
  } catch {
    return SEED_USERS
  }
}

function writeUsers(users) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users),
  )
}

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null)

  const [users, setUsers] =
    useState(() => readUsers())

  const [ready, setReady] =
    useState(false)

  useEffect(() => {
    try {
      const raw =
        localStorage.getItem(
          STORAGE_KEY,
        )

      if (raw) {
        setUser(JSON.parse(raw))
      }
    } catch {
      // Ignore invalid session.
    }

    setReady(true)
  }, [])

  const persistUser =
    useCallback(
      (nextUser) => {
        setUser(nextUser)

        if (nextUser) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(nextUser),
          )
        } else {
          localStorage.removeItem(
            STORAGE_KEY,
          )
        }
      },
      [],
    )

  const register =
    useCallback(
      ({
        name,
        email,
        password,
        role = 'tenant',
        city = '',
      }) => {
        const normalizedEmail =
          email
            .trim()
            .toLowerCase()

        const existing =
          users.find(
            (currentUser) =>
              currentUser.email
                .toLowerCase()
                .trim() ===
              normalizedEmail,
          )

        if (existing) {
          return {
            ok: false,
            error:
              'An account with this email already exists.',
          }
        }

        const newUser = {
          id: `u-${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          password,
          role,
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(
            normalizedEmail,
          )}`,
          city,
          createdAt:
            new Date()
              .toISOString()
              .slice(0, 10),
        }

        const nextUsers = [
          ...users,
          newUser,
        ]

        setUsers(nextUsers)
        writeUsers(nextUsers)

        persistUser({
          ...newUser,
          password: undefined,
        })

        return {
          ok: true,
          user: newUser,
        }
      },
      [users, persistUser],
    )

  const login = useCallback(
    ({ email, password }) => {
      const normalizedEmail =
        email
          .trim()
          .toLowerCase()

      const found = users.find(
        (currentUser) =>
          currentUser.email
            .toLowerCase()
            .trim() ===
            normalizedEmail &&
          currentUser.password ===
            password,
      )

      if (!found) {
        return {
          ok: false,
          error:
            'Invalid email or password.',
        }
      }

      persistUser({
        ...found,
        password: undefined,
      })

      return {
        ok: true,
        user: found,
      }
    },
    [users, persistUser],
  )

  /*
   * =========================================================
   * GOOGLE LOGIN
   *
   * Prototype/demo implementation.
   * =========================================================
   */
  const loginWithGoogleProfile =
    useCallback(
      ({
        googleId,
        name,
        email,
        avatar = '',
        role = 'tenant',
        city = '',
      }) => {
        const normalizedEmail =
          email
            .trim()
            .toLowerCase()

        const existingByEmail =
          users.find(
            (currentUser) =>
              currentUser.email
                .toLowerCase()
                .trim() ===
              normalizedEmail,
          )

        if (existingByEmail) {
          persistUser({
            ...existingByEmail,
            password: undefined,
            googleId:
              existingByEmail.googleId ||
              googleId,
          })

          return {
            ok: true,
            user: existingByEmail,
          }
        }

        const newUser = {
          id: `google-${googleId || Date.now()}`,
          googleId,
          name,
          email: normalizedEmail,
          password: undefined,
          role,
          avatar,
          city,
          provider: 'google',
          createdAt:
            new Date().toISOString(),
        }

        const nextUsers = [
          ...users,
          newUser,
        ]

        setUsers(nextUsers)
        writeUsers(nextUsers)

        persistUser(newUser)

        return {
          ok: true,
          user: newUser,
        }
      },
      [users, persistUser],
    )

  const logout =
    useCallback(() => {
      persistUser(null)
    }, [persistUser])

  const requestReset =
    useCallback(
      ({ email }) => {
        const normalizedEmail =
          email
            .trim()
            .toLowerCase()

        const found =
          users.find(
            (currentUser) =>
              currentUser.email
                .toLowerCase()
                .trim() ===
              normalizedEmail,
          )

        if (!found) {
          return {
            ok: false,
            error:
              'No account found with this email.',
          }
        }

        return {
          ok: true,
        }
      },
      [users],
    )

  const value = useMemo(
    () => ({
      user,
      ready,

      isAuthenticated:
        Boolean(user),

      isAdmin:
        user?.role === 'admin',

      isLandlord:
        user?.role === 'landlord',

      isTenant:
        user?.role === 'tenant',

      users,

      register,
      login,
      loginWithGoogleProfile,
      logout,
      requestReset,
    }),
    [
      user,
      ready,
      users,
      register,
      login,
      loginWithGoogleProfile,
      logout,
      requestReset,
    ],
  )

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx =
    useContext(AuthContext)

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    )
  }

  return ctx
}
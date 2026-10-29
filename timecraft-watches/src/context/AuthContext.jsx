import { createContext, useContext, useEffect, useState } from 'react'
import { sampleUsers } from '../data/sampleUsers'
import {
  STORAGE_KEYS,
  createUniqueId,
  loadOrSeed,
  readStorage,
  removeStorage,
  writeStorage,
} from '../utils/storage'

const AuthContext = createContext(null)

// NOTE: This is demo authentication only. Passwords are saved as plain text in localStorage
// and anyone can read or edit them with the browser tools. Real apps need a secure backend.
export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadOrSeed(STORAGE_KEYS.users, sampleUsers))
  // The "session" is just the id of the logged-in user
  const [sessionUserId, setSessionUserId] = useState(() => readStorage(STORAGE_KEYS.session, null))

  useEffect(() => {
    writeStorage(STORAGE_KEYS.users, users)
  }, [users])

  useEffect(() => {
    if (sessionUserId) writeStorage(STORAGE_KEYS.session, sessionUserId)
    else removeStorage(STORAGE_KEYS.session)
  }, [sessionUserId])

  // Find the logged-in user and hide the password before sharing it with the rest of the app
  const savedUser = users.find((user) => user.id === sessionUserId)
  let currentUser = null
  if (savedUser) {
    const { password, ...userWithoutPassword } = savedUser
    currentUser = userWithoutPassword
  }

  const isAdmin = currentUser?.role === 'admin'
  const customerCount = users.filter((user) => user.role === 'customer').length

  // Create a new customer account. Returns { ok, error }.
  function signup({ fullName, email, password }) {
    const normalizedEmail = email.trim().toLowerCase()

    // Block duplicate email addresses
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists. Try logging in instead.' }
    }

    const newUser = {
      id: createUniqueId('u', (candidate) => users.some((u) => u.id === candidate)),
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role: 'customer', // New sign-ups are always customers, never admins
      createdAt: new Date().toISOString(),
    }
    setUsers((current) => [...current, newUser])
    return { ok: true }
  }

  // Check email + password. Returns { ok, user } or { ok: false, error }.
  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const matchingUser = users.find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
    )

    if (!matchingUser) {
      return { ok: false, error: 'Incorrect email or password. Please try again.' }
    }

    setSessionUserId(matchingUser.id)
    return { ok: true, user: matchingUser }
  }

  function logout() {
    setSessionUserId(null)
  }

  const value = { currentUser, isAdmin, customerCount, signup, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}

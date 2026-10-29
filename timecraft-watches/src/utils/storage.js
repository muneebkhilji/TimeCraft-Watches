// Small helpers for working with localStorage safely.
// localStorage is NOT a secure database. It is only used here to keep demo data between refreshes.

export const STORAGE_KEYS = {
  products: 'timecraft_products',
  users: 'timecraft_users',
  cart: 'timecraft_cart',
  orders: 'timecraft_orders',
  session: 'timecraft_session',
}

// Turn a saved string back into data. If the text is broken, return the fallback instead of crashing.
export function safeParse(text, fallback) {
  try {
    const value = JSON.parse(text)
    return value === null || value === undefined ? fallback : value
  } catch {
    return fallback
  }
}

export function readStorage(key, fallback) {
  try {
    const text = localStorage.getItem(key)
    return text === null ? fallback : safeParse(text, fallback)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Could not save to localStorage:', error)
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Could not remove from localStorage:', error)
  }
}

// Seed sample data ONLY when the key is missing (first visit or after a reset).
// If the saved data exists but is broken (not a list), fall back to the sample data.
export function loadOrSeed(key, seedData) {
  let text = null
  try {
    text = localStorage.getItem(key)
  } catch {
    return seedData
  }

  if (text === null) {
    writeStorage(key, seedData)
    return seedData
  }

  const saved = safeParse(text, null)
  return Array.isArray(saved) ? saved : seedData
}

// Make a unique id such as "o-lq3k9z-4f2a". The "exists" callback lets callers guarantee no duplicates.
export function createUniqueId(prefix, exists) {
  let id = ''
  do {
    const time = Date.now().toString(36)
    const random = Math.random().toString(36).slice(2, 6)
    id = `${prefix}-${time}-${random}`
  } while (exists(id))
  return id
}

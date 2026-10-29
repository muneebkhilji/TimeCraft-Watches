import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Clock, LogIn, LogOut, Menu, Search, ShoppingBag, UserPlus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const linkClass = ({ isActive }) =>
  `rounded px-1 py-1 text-sm font-medium transition-colors hover:text-gold-dark ${
    isActive ? 'text-gold-dark underline underline-offset-8 decoration-gold' : 'text-neutral-800'
  }`

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSearch(event) {
    event.preventDefault()
    const query = searchText.trim()
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
    setMenuOpen(false)
  }

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="container-page flex items-center gap-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Clock className="h-6 w-6 text-gold" aria-hidden="true" />
          <span className="font-display text-2xl font-bold tracking-tight">TimeCraft</span>
        </Link>

        {/* Desktop links */}
        <nav aria-label="Main" className="ml-6 hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          <NavLink to="/orders" className={linkClass}>Orders</NavLink>
          {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </nav>

        {/* Desktop search */}
        <form onSubmit={handleSearch} role="search" className="ml-auto hidden max-w-xs flex-1 md:block">
          <label htmlFor="site-search" className="sr-only">Search watches</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
            <input
              id="site-search"
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search name or brand"
              className="input pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link to="/cart" className="relative rounded p-2 hover:bg-neutral-100" aria-label={`Cart, ${itemCount} items`} onClick={closeMenu}>
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-black">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Desktop account area */}
          <div className="hidden items-center gap-2 md:flex">
            {currentUser ? (
              <>
                <span className="max-w-[9rem] truncate text-sm text-neutral-600">Hi, {currentUser.fullName.split(' ')[0]}</span>
                <button type="button" onClick={handleLogout} className="btn-outline px-3 py-1.5">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline px-3 py-1.5">
                  <LogIn className="h-4 w-4" aria-hidden="true" /> Log in
                </Link>
                <Link to="/signup" className="btn-primary px-3 py-1.5">Sign up</Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded p-2 hover:bg-neutral-100 md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <div className="container-page space-y-4 py-4">
            <form onSubmit={handleSearch} role="search">
              <label htmlFor="mobile-search" className="sr-only">Search watches</label>
              <input id="mobile-search" type="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search name or brand" className="input" />
            </form>
            <nav aria-label="Mobile" className="flex flex-col gap-3">
              <NavLink to="/" end className={linkClass} onClick={closeMenu}>Home</NavLink>
              <NavLink to="/products" className={linkClass} onClick={closeMenu}>Products</NavLink>
              <NavLink to="/orders" className={linkClass} onClick={closeMenu}>Orders</NavLink>
              {isAdmin && <NavLink to="/admin" className={linkClass} onClick={closeMenu}>Admin</NavLink>}
            </nav>
            <div className="flex gap-2 border-t border-neutral-200 pt-4">
              {currentUser ? (
                <button type="button" onClick={handleLogout} className="btn-outline w-full">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Log out ({currentUser.fullName.split(' ')[0]})
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-outline flex-1" onClick={closeMenu}>
                    <LogIn className="h-4 w-4" aria-hidden="true" /> Log in
                  </Link>
                  <Link to="/signup" className="btn-primary flex-1" onClick={closeMenu}>
                    <UserPlus className="h-4 w-4" aria-hidden="true" /> Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

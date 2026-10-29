import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Clock, LayoutDashboard, LogOut, Package, Receipt, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-gold text-black' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
  }`

// Separate layout with a sidebar for all admin pages
export default function AdminLayout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 md:flex-row">
      <aside className="bg-black p-4 md:w-64 md:shrink-0">
        <div className="flex items-center gap-2 px-2 pb-4 text-white">
          <Clock className="h-5 w-5 text-gold" aria-hidden="true" />
          <span className="font-display text-xl font-bold">TimeCraft Admin</span>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col">
          <NavLink to="/admin" end className={linkClass}><LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Overview</NavLink>
          <NavLink to="/admin/products" className={linkClass}><Package className="h-4 w-4" aria-hidden="true" /> Products</NavLink>
          <NavLink to="/admin/orders" className={linkClass}><Receipt className="h-4 w-4" aria-hidden="true" /> Orders</NavLink>
          <NavLink to="/" className={linkClass}><Store className="h-4 w-4" aria-hidden="true" /> View store</NavLink>
        </nav>
        <div className="mt-4 border-t border-neutral-800 pt-4 md:mt-8">
          <p className="truncate px-2 text-sm text-neutral-400">{currentUser?.email}</p>
          <button type="button" onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  )
}

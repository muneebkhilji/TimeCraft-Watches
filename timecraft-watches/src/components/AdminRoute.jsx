import { Link, Navigate, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Admin pages. Guests go to login; customers see an "access denied" message.
// NOTE: This only hides the pages in the browser. Because there is no backend, it is NOT real
// security. A real store must check permissions on the server.
export default function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please log in with an admin account.' }} />
  }

  if (!isAdmin) {
    return (
      <div className="container-page py-24 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-red-700" aria-hidden="true" />
        <h1 className="mt-4 text-4xl font-semibold">Access denied</h1>
        <p className="mx-auto mt-2 max-w-md text-neutral-600">
          The admin area is only available to store administrators. Your account is a customer account.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to the store
        </Link>
      </div>
    )
  }

  return children
}

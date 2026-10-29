import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pages that need a logged-in user. Guests are sent to the login page and
// returned here afterwards.
export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please log in to continue.' }} />
  }
  return children
}

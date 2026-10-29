import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateLogin } from '../utils/validation'
import FormField from '../components/FormField'
import Message from '../components/Message'

export default function Login() {
  const { currentUser, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loginError, setLoginError] = useState('')

  // The page the user wanted before being sent to login (if any)
  const from = location.state?.from
  const notice = location.state?.message

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setLoginError('')

    // 1. Check the fields first and stop if anything is wrong
    const validationErrors = validateLogin(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    // 2. Check the credentials
    const result = login(values)
    if (!result.ok) {
      setLoginError(result.error)
      return
    }

    // 3. Redirect: admins go to the dashboard, customers go back where they were (or home)
    if (result.user.role === 'admin') {
      navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true })
    } else {
      navigate(from && !from.startsWith('/admin') ? from : '/', { replace: true })
    }
  }

  if (currentUser) {
    return (
      <div className="container-page max-w-md py-16">
        <h1 className="text-5xl font-semibold">You are logged in</h1>
        <p className="mt-3 text-neutral-600">Signed in as {currentUser.email}.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/" className="btn-primary">Go to the store</Link>
          <button type="button" onClick={logout} className="btn-outline">Log out</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page max-w-md py-16">
      <h1 className="text-5xl font-semibold">Log in</h1>
      <p className="mt-2 text-neutral-600">
        New here? <Link to="/signup" className="font-semibold text-gold-dark underline">Create an account</Link>
      </p>

      <div className="mt-6 space-y-4">
        {notice && <Message type="info">{notice}</Message>}
        {loginError && <Message type="error">{loginError}</Message>}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        <FormField id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
        <FormField id="password" label="Password" type="password" autoComplete="current-password" value={values.password} onChange={handleChange} error={errors.password} />
        <button type="submit" className="btn-primary w-full py-3">Log in</button>
      </form>

      <p className="mt-6 text-xs text-neutral-500">
        Demo project: accounts are saved in your browser only. See the README for demo logins.
      </p>
    </div>
  )
}

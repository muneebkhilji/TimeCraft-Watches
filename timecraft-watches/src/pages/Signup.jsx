import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validateSignup } from '../utils/validation'
import FormField from '../components/FormField'
import Message from '../components/Message'

const emptyForm = { fullName: '', email: '', password: '', confirmPassword: '' }

export default function Signup() {
  const { signup } = useAuth()
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setSuccess(false)

    // Stop here if validation fails
    const validationErrors = validateSignup(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    // Create the account (this also blocks duplicate emails)
    const result = signup(values)
    if (!result.ok) {
      setFormError(result.error)
      return
    }

    setSuccess(true)
    setValues(emptyForm)
  }

  return (
    <div className="container-page max-w-md py-16">
      <h1 className="text-5xl font-semibold">Create an account</h1>
      <p className="mt-2 text-neutral-600">
        Already registered? <Link to="/login" className="font-semibold text-gold-dark underline">Log in</Link>
      </p>

      <div className="mt-6 space-y-4">
        {success && (
          <Message type="success">
            Account created successfully. <Link to="/login" className="font-semibold underline">Log in now</Link>
          </Message>
        )}
        {formError && <Message type="error">{formError}</Message>}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        <FormField id="fullName" label="Full name" autoComplete="name" value={values.fullName} onChange={handleChange} error={errors.fullName} />
        <FormField id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
        <FormField id="password" label="Password (at least 8 characters)" type="password" autoComplete="new-password" value={values.password} onChange={handleChange} error={errors.password} />
        <FormField id="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <button type="submit" className="btn-primary w-full py-3">Sign up</button>
      </form>

      <p className="mt-6 text-xs text-neutral-500">
        Demo project: your account is saved in this browser only and is not secure.
      </p>
    </div>
  )
}

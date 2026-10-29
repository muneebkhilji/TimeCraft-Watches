import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display text-8xl font-semibold text-gold">404</p>
      <h1 className="mt-2 text-4xl font-semibold">This page has run out of time</h1>
      <p className="mx-auto mt-3 max-w-md text-neutral-600">We could not find the page you were looking for. It may have moved, or the link may be wrong.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/products" className="btn-outline">Browse watches</Link>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

// Friendly message for empty carts, orders and search results
export default function EmptyState({ title, message, actionLabel, actionTo, onAction }) {
  return (
    <div className="rounded border border-dashed border-neutral-300 px-6 py-14 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </div>
  )
}

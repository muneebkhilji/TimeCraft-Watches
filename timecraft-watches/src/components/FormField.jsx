// A label + input + error message, wired together for accessibility.
export default function FormField({ id, label, error, as = 'input', children, ...inputProps }) {
  const errorId = `${id}-error`
  const sharedProps = {
    id,
    name: id,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? errorId : undefined,
    className: `input ${error ? 'input-error' : ''}`,
    ...inputProps,
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {as === 'select' && <select {...sharedProps}>{children}</select>}
      {as === 'textarea' && <textarea rows={4} {...sharedProps} />}
      {as === 'input' && <input {...sharedProps} />}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

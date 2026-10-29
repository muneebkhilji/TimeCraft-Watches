import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

// A small banner for success, error and info messages
const STYLES = {
  success: { box: 'border-green-300 bg-green-50 text-green-900', Icon: CheckCircle2 },
  error: { box: 'border-red-300 bg-red-50 text-red-900', Icon: AlertCircle },
  info: { box: 'border-neutral-300 bg-neutral-50 text-neutral-800', Icon: Info },
}

export default function Message({ type = 'info', children }) {
  if (!children) return null
  const { box, Icon } = STYLES[type]
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2 rounded border px-4 py-3 text-sm ${box}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

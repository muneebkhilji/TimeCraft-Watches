import { STATUS_STYLES } from '../utils/orderStatus'

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending
  return <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${style}`}>{status}</span>
}

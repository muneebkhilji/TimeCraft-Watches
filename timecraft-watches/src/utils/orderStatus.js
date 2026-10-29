// Order statuses and the changes the admin is allowed to make.
export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

// From each status, which statuses can an order move to next?
// Delivered and Cancelled are final, so a cancelled order can never be "un-cancelled"
// (this also guarantees stock is only restored once).
const ALLOWED_NEXT_STATUSES = {
  Pending: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
}

export function getAllowedNextStatuses(currentStatus) {
  return ALLOWED_NEXT_STATUSES[currentStatus] || []
}

export const STATUS_STYLES = {
  Pending: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  Processing: 'bg-amber-50 text-amber-800 border-amber-300',
  Shipped: 'bg-sky-50 text-sky-800 border-sky-300',
  Delivered: 'bg-green-50 text-green-800 border-green-300',
  Cancelled: 'bg-red-50 text-red-800 border-red-300',
}

import { useState } from 'react'
import { useOrders } from '../../context/OrderContext'
import { formatDate, formatPrice } from '../../utils/format'
import { getAllowedNextStatuses } from '../../utils/orderStatus'
import OrderItemsList from '../../components/OrderItemsList'
import StatusBadge from '../../components/StatusBadge'
import Message from '../../components/Message'
import EmptyState from '../../components/EmptyState'

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders()
  const [message, setMessage] = useState(null) // { type, text }

  function handleStatusChange(order, newStatus) {
    if (newStatus === order.status) return

    // Cancelling is a big change (stock goes back to the shop), so confirm first
    if (newStatus === 'Cancelled' && !window.confirm(`Cancel order ${order.id}? The items will be returned to stock. This cannot be undone.`)) {
      return
    }

    const result = updateOrderStatus(order.id, newStatus)
    setMessage(result.ok ? { type: 'success', text: result.message } : { type: 'error', text: result.error })
  }

  return (
    <div>
      <h1 className="text-5xl font-semibold">Orders</h1>

      {message && (
        <div className="mt-4">
          <Message type={message.type}>{message.text}</Message>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No orders yet" message="Orders placed by customers will appear here." />
        </div>
      ) : (
        <ul className="mt-6 space-y-5">
          {orders.map((order) => {
            const nextStatuses = getAllowedNextStatuses(order.status)
            return (
              <li key={order.id} className="rounded border border-neutral-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{order.id}</p>
                    <p className="text-sm text-neutral-600">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    {nextStatuses.length > 0 ? (
                      <div>
                        <label htmlFor={`status-${order.id}`} className="sr-only">Change status for order {order.id}</label>
                        <select
                          id={`status-${order.id}`}
                          className="input w-auto py-1.5"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                        >
                          <option value={order.status}>{order.status} (current)</option>
                          {nextStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-500">Final status</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid gap-1 text-sm text-neutral-700 sm:grid-cols-2">
                  <p><span className="font-medium">Customer:</span> {order.customer.fullName}</p>
                  <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                  <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
                  <p><span className="font-medium">Ship to:</span> {order.customer.address}, {order.customer.city} {order.customer.postalCode}</p>
                </div>

                <OrderItemsList items={order.items} />
                <p className="border-t border-neutral-200 pt-3 text-right text-base font-semibold">Total {formatPrice(order.total)}</p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

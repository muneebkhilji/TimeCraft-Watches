import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'
import { formatDate, formatPrice } from '../utils/format'
import OrderItemsList from '../components/OrderItemsList'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

export default function MyOrders() {
  const { currentUser } = useAuth()
  const { orders } = useOrders()

  // Customers only ever see their own orders
  const myOrders = orders.filter((order) => order.userId === currentUser.id)

  return (
    <div className="container-page max-w-4xl py-10">
      <h1 className="text-5xl font-semibold">My orders</h1>

      {myOrders.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No orders yet" message="When you place an order, you can follow its status here." actionLabel="Browse watches" actionTo="/products" />
        </div>
      ) : (
        <ul className="mt-8 space-y-6">
          {myOrders.map((order) => (
            <li key={order.id} className="rounded border border-neutral-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{order.id}</p>
                  <p className="text-sm text-neutral-600">{formatDate(order.createdAt)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <OrderItemsList items={order.items} />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-3 text-sm">
                <p className="text-neutral-600">Ship to: {order.customer.address}, {order.customer.city}</p>
                <p className="text-base font-semibold">Total {formatPrice(order.total)}</p>
              </div>
              <Link to={`/order-confirmation/${order.id}`} className="mt-3 inline-block text-sm font-semibold text-gold-dark underline">
                View order details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

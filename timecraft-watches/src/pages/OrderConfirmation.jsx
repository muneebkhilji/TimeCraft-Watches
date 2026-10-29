import { Link, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'
import { formatDate, formatPrice } from '../utils/format'
import OrderItemsList from '../components/OrderItemsList'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const { currentUser, isAdmin } = useAuth()
  const { getOrderById } = useOrders()
  const order = getOrderById(orderId)

  // Customers can only open their own orders
  if (!order || (order.userId !== currentUser.id && !isAdmin)) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Order not found" message="We could not find this order in your account." actionLabel="View my orders" actionTo="/orders" />
      </div>
    )
  }

  return (
    <div className="container-page max-w-3xl py-12">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-700" aria-hidden="true" />
        <h1 className="mt-3 text-5xl font-semibold">Thank you for your order</h1>
        <p className="mt-2 text-neutral-600">Your demo order has been saved. No payment was collected.</p>
      </div>

      <div className="mt-8 rounded border border-neutral-200 p-6">
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div><dt className="text-neutral-500">Order ID</dt><dd className="font-semibold">{order.id}</dd></div>
          <div><dt className="text-neutral-500">Order date</dt><dd className="font-semibold">{formatDate(order.createdAt)}</dd></div>
          <div><dt className="text-neutral-500">Status</dt><dd className="mt-0.5"><StatusBadge status={order.status} /></dd></div>
        </dl>

        <h2 className="mt-8 text-2xl font-semibold">Items</h2>
        <OrderItemsList items={order.items} />

        <dl className="mt-4 space-y-1 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}</dd></div>
          <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>

        <h2 className="mt-8 text-2xl font-semibold">Shipping address</h2>
        <address className="mt-2 text-sm not-italic leading-relaxed text-neutral-700">
          {order.customer.fullName}<br />
          {order.customer.address}<br />
          {order.customer.city}, {order.customer.postalCode}<br />
          {order.customer.phone}
        </address>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/orders" className="btn-primary">View my orders</Link>
        <Link to="/products" className="btn-outline">Continue shopping</Link>
      </div>
    </div>
  )
}

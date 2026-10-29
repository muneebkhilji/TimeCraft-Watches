import { Link } from 'react-router-dom'
import { Package, Receipt, Users, Wallet } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { useOrders } from '../../context/OrderContext'
import { formatPrice } from '../../utils/format'
import { STORAGE_KEYS, removeStorage } from '../../utils/storage'

export default function AdminDashboard() {
  const { customerCount } = useAuth()
  const { products } = useProducts()
  const { orders, totalSales } = useOrders()

  const stats = [
    { label: 'Total products', value: products.length, Icon: Package },
    { label: 'Total orders', value: orders.length, Icon: Receipt },
    { label: 'Total customers', value: customerCount, Icon: Users },
    { label: 'Total sales (excluding cancelled)', value: formatPrice(totalSales), Icon: Wallet },
  ]

  // Delete the demo data from localStorage and reload so it is seeded again
  function handleReset() {
    if (!window.confirm('Reset ALL demo data (products, users, orders, cart and login)? This cannot be undone.')) return
    Object.values(STORAGE_KEYS).forEach(removeStorage)
    window.location.href = '/'
  }

  return (
    <div>
      <h1 className="text-5xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="rounded border border-neutral-200 bg-white p-5">
            <Icon className="h-5 w-5 text-gold-dark" aria-hidden="true" />
            <p className="mt-3 text-3xl font-semibold">{value}</p>
            <p className="text-sm text-neutral-600">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin/products" className="btn-primary">Manage products</Link>
        <Link to="/admin/orders" className="btn-outline">Manage orders</Link>
      </div>

      <section className="mt-12 rounded border border-neutral-200 bg-white p-5">
        <h2 className="text-2xl font-semibold">Demo tools</h2>
        <p className="mt-1 text-sm text-neutral-600">Start again with the original sample products and demo accounts.</p>
        <button type="button" onClick={handleReset} className="btn-danger mt-3">Reset demo data</button>
      </section>
    </div>
  )
}

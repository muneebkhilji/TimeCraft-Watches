import { createContext, useContext, useEffect, useState } from 'react'
import { useProducts } from './ProductContext'
import { useCart } from './CartContext'
import { STORAGE_KEYS, createUniqueId, loadOrSeed, writeStorage } from '../utils/storage'
import { getAllowedNextStatuses } from '../utils/orderStatus'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const { products, adjustStock } = useProducts()
  const { cartItems, subtotal, shippingFee, total, clearCart } = useCart()
  const [orders, setOrders] = useState(() => loadOrSeed(STORAGE_KEYS.orders, []))

  useEffect(() => {
    writeStorage(STORAGE_KEYS.orders, orders)
  }, [orders])

  // Create an order from the current cart. Returns { ok, order } or { ok: false, error }.
  function placeOrder(customer, userId) {
    if (cartItems.length === 0) {
      return { ok: false, error: 'Your cart is empty.' }
    }

    // 1. Check stock again using the latest product data
    for (const item of cartItems) {
      const latestProduct = products.find((p) => p.id === item.product.id)
      if (!latestProduct || latestProduct.stock < item.quantity) {
        const available = latestProduct ? latestProduct.stock : 0
        return {
          ok: false,
          error: `Not enough stock for ${item.product.name}. Only ${available} left. Please update your cart.`,
        }
      }
    }

    // 2. Build the order. Items are COPIED (name, price, image) so the order stays correct
    //    even if the product is edited or deleted later.
    const order = {
      id: createUniqueId('TC', (candidate) => orders.some((o) => o.id === candidate.toUpperCase())).toUpperCase(),
      userId,
      customer,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
      })),
      subtotal,
      shippingFee,
      total,
      status: 'Pending',
      stockRestored: false, // becomes true if the order is cancelled and stock is given back
      createdAt: new Date().toISOString(),
    }

    // 3. Save the order, reduce stock, and only then clear the cart
    setOrders((current) => [order, ...current])
    adjustStock(order.items.map((item) => ({ productId: item.productId, delta: -item.quantity })))
    clearCart()

    return { ok: true, order }
  }

  function getOrderById(orderId) {
    return orders.find((order) => order.id === orderId) || null
  }

  // Admin: change an order's status. Returns { ok, message } or { ok: false, error }.
  function updateOrderStatus(orderId, newStatus) {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return { ok: false, error: 'Order not found.' }

    // Only allow sensible changes (for example, a delivered order cannot be cancelled)
    if (!getAllowedNextStatuses(order.status).includes(newStatus)) {
      return { ok: false, error: `An order that is ${order.status} cannot be changed to ${newStatus}.` }
    }

    // Cancelling gives the stock back, but only once (stockRestored guards against doing it twice).
    // Products that were deleted since the order was placed are skipped.
    let stockRestored = order.stockRestored
    if (newStatus === 'Cancelled' && !order.stockRestored) {
      const changes = order.items
        .filter((item) => products.some((p) => p.id === item.productId))
        .map((item) => ({ productId: item.productId, delta: item.quantity }))
      adjustStock(changes)
      stockRestored = true
    }

    setOrders((current) =>
      current.map((o) => (o.id === orderId ? { ...o, status: newStatus, stockRestored } : o))
    )
    return { ok: true, message: `Order ${orderId} is now ${newStatus}.` }
  }

  // Total sales ignores cancelled orders
  const totalSales = orders
    .filter((order) => order.status !== 'Cancelled')
    .reduce((sum, order) => sum + order.total, 0)

  const value = { orders, placeOrder, getOrderById, updateOrderStatus, totalSales }
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrders must be used inside OrderProvider')
  return context
}

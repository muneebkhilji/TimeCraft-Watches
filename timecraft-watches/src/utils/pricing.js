import { roundMoney } from './format'

// Shipping rules: a flat fee, free for large orders.
export const SHIPPING_FEE = 25
export const FREE_SHIPPING_THRESHOLD = 1000

export function calculateShipping(subtotal) {
  if (subtotal <= 0) return 0
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

// Works for cart items ({ product, quantity }) and order items ({ price, quantity })
export function calculateSubtotal(items) {
  const total = items.reduce((sum, item) => {
    const price = item.product ? item.product.price : item.price
    return sum + price * item.quantity
  }, 0)
  return roundMoney(total)
}

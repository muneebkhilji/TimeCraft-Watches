import { createContext, useContext, useEffect, useState } from 'react'
import { useProducts } from './ProductContext'
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage'
import { calculateShipping, calculateSubtotal } from '../utils/pricing'
import { roundMoney } from '../utils/format'

const CartContext = createContext(null)

// Only the product id and quantity are saved. Name, price, image and stock are always
// looked up from the product list, so the cart never shows out-of-date product details.
function loadSavedCart() {
  const saved = readStorage(STORAGE_KEYS.cart, [])
  if (!Array.isArray(saved)) return []
  return saved.filter(
    (item) => item && typeof item.productId === 'string' && Number.isInteger(item.quantity) && item.quantity > 0
  )
}

export function CartProvider({ children }) {
  const { products } = useProducts()
  const [items, setItems] = useState(loadSavedCart)

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, items)
  }, [items])

  // Keep the cart consistent with the products: remove deleted or sold-out products
  // and lower quantities that are higher than the current stock.
  useEffect(() => {
    setItems((current) => {
      const cleaned = current
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product) return null
          const quantity = Math.min(item.quantity, product.stock)
          return quantity > 0 ? { productId: item.productId, quantity } : null
        })
        .filter(Boolean)

      const changed =
        cleaned.length !== current.length || cleaned.some((item, index) => item.quantity !== current[index].quantity)
      return changed ? cleaned : current
    })
  }, [products])

  // Join cart items with their products so pages can show names, images and prices
  const cartItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { product, quantity: item.quantity } : null
    })
    .filter(Boolean)

  // Cart calculations
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = calculateSubtotal(cartItems)
  const shippingFee = calculateShipping(subtotal)
  const total = roundMoney(subtotal + shippingFee)

  // Add a product. Returns { ok, message } so the page can show feedback.
  function addToCart(productId, quantity = 1) {
    const product = products.find((p) => p.id === productId)
    if (!product) return { ok: false, message: 'This product could not be found.' }
    if (product.stock <= 0) return { ok: false, message: 'Sorry, this watch is out of stock.' }

    const existing = items.find((item) => item.productId === productId)
    const newQuantity = (existing ? existing.quantity : 0) + quantity

    // Never allow more than the available stock
    if (newQuantity > product.stock) {
      const inCart = existing ? existing.quantity : 0
      return {
        ok: false,
        message: `Only ${product.stock} in stock. You already have ${inCart} in your cart.`,
      }
    }

    if (existing) {
      setItems((current) =>
        current.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
      )
    } else {
      setItems((current) => [...current, { productId, quantity: newQuantity }])
    }
    return { ok: true, message: `${product.name} was added to your cart.` }
  }

  function increaseQuantity(productId) {
    return addToCart(productId, 1)
  }

  // Quantity never goes below 1. Use removeFromCart to delete an item.
  function decreaseQuantity(productId) {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    )
  }

  function removeFromCart(productId) {
    setItems((current) => current.filter((item) => item.productId !== productId))
  }

  function clearCart() {
    setItems([])
  }

  const value = {
    cartItems,
    itemCount,
    subtotal,
    shippingFee,
    total,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}

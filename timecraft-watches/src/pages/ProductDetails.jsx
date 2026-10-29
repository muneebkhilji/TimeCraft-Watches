import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
import SafeImage from '../components/SafeImage'
import ProductCard from '../components/ProductCard'
import Message from '../components/Message'
import EmptyState from '../components/EmptyState'

export default function ProductDetails() {
  const { productId } = useParams()
  const { products, getProductById } = useProducts()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState(null) // { type, text }

  const product = getProductById(productId)

  // Missing or invalid product id
  if (!product) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Watch not found"
          message="This watch may have been removed, or the link is incorrect."
          actionLabel="Browse all watches"
          actionTo="/products"
        />
      </div>
    )
  }

  const soldOut = product.stock <= 0
  // Never let the selector go above stock (stock may have changed since the page loaded)
  const selectedQuantity = Math.min(quantity, Math.max(product.stock, 1))

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  function handleAddToCart() {
    const result = addToCart(product.id, selectedQuantity)
    setFeedback({ type: result.ok ? 'success' : 'error', text: result.message })
    if (result.ok) setQuantity(1)
  }

  let stockText = `In stock (${product.stock} available)`
  if (soldOut) stockText = 'Out of stock'
  else if (product.stock <= 3) stockText = `Only ${product.stock} left`

  return (
    <div className="container-page py-10">
      <Link to="/products" className="text-sm font-medium text-neutral-600 hover:text-black hover:underline">
        Continue shopping
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded bg-neutral-100">
          <SafeImage src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div>
          <p className="text-sm text-neutral-500">
            {product.brand} - {product.category}
          </p>
          <h1 className="mt-1 text-5xl font-semibold leading-tight">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold text-gold-dark">{formatPrice(product.price)}</p>
          <p className="mt-4 max-w-prose leading-relaxed text-neutral-700">{product.description}</p>
          <p className={`mt-4 text-sm font-semibold ${soldOut ? 'text-red-700' : 'text-green-800'}`}>{stockText}</p>

          {soldOut ? (
            <div className="mt-6">
              <Message type="error">This watch is currently unavailable. Please check back later or browse similar watches below.</Message>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div>
                <span id="quantity-label" className="mb-1 block text-sm font-medium">Quantity</span>
                <div className="inline-flex items-center rounded border border-neutral-300" role="group" aria-labelledby="quantity-label">
                  <button type="button" className="p-3 hover:bg-neutral-100 disabled:opacity-40" aria-label="Decrease quantity" disabled={selectedQuantity <= 1} onClick={() => setQuantity(selectedQuantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold" aria-live="polite">{selectedQuantity}</span>
                  <button type="button" className="p-3 hover:bg-neutral-100 disabled:opacity-40" aria-label="Increase quantity" disabled={selectedQuantity >= product.stock} onClick={() => setQuantity(selectedQuantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button type="button" onClick={handleAddToCart} className="btn-primary px-6 py-3">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Add to cart
              </button>
            </div>
          )}

          {feedback && (
            <div className="mt-4">
              <Message type={feedback.type}>
                {feedback.text}{' '}
                {feedback.type === 'success' && (
                  <Link to="/cart" className="font-semibold underline">View cart</Link>
                )}
              </Message>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-semibold">More {product.category.toLowerCase()} watches</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

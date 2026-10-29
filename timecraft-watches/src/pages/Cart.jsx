import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
import { FREE_SHIPPING_THRESHOLD } from '../utils/pricing'
import SafeImage from '../components/SafeImage'
import EmptyState from '../components/EmptyState'
import Message from '../components/Message'

export default function Cart() {
  const { cartItems, subtotal, shippingFee, total, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  if (cartItems.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Your cart is empty"
          message="Add a watch to your cart and it will show up here."
          actionLabel="Browse watches"
          actionTo="/products"
        />
      </div>
    )
  }

  function handleIncrease(productId) {
    const result = increaseQuantity(productId)
    setErrorMessage(result.ok ? '' : result.message)
  }

  function handleClearCart() {
    if (window.confirm('Remove all items from your cart?')) clearCart()
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-5xl font-semibold">Your cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          {errorMessage && (
            <div className="mb-4">
              <Message type="error">{errorMessage}</Message>
            </div>
          )}
          <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
            {cartItems.map(({ product, quantity }) => (
              <li key={product.id} className="flex flex-wrap items-center gap-4 py-5">
                <SafeImage src={product.image} alt={product.name} className="h-24 w-24 shrink-0 rounded bg-neutral-100 object-cover" />
                <div className="min-w-0 flex-1 basis-48">
                  <Link to={`/products/${product.id}`} className="text-xl font-semibold hover:underline">
                    {product.name}
                  </Link>
                  <p className="text-sm text-neutral-500">{product.brand}</p>
                  <p className="mt-1 text-sm">{formatPrice(product.price)} each</p>
                </div>
                <div className="inline-flex items-center rounded border border-neutral-300" role="group" aria-label={`Quantity for ${product.name}`}>
                  <button type="button" className="p-2 hover:bg-neutral-100 disabled:opacity-40" aria-label={`Decrease quantity of ${product.name}`} disabled={quantity <= 1} onClick={() => decreaseQuantity(product.id)}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-semibold">{quantity}</span>
                  <button type="button" className="p-2 hover:bg-neutral-100 disabled:opacity-40" aria-label={`Increase quantity of ${product.name}`} disabled={quantity >= product.stock} onClick={() => handleIncrease(product.id)}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="w-28 text-right font-semibold">{formatPrice(product.price * quantity)}</p>
                <button type="button" onClick={() => removeFromCart(product.id)} className="rounded p-2 text-neutral-500 hover:bg-red-50 hover:text-red-700" aria-label={`Remove ${product.name} from cart`}>
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={handleClearCart} className="btn-outline mt-4 px-3 py-1.5">
            Clear cart
          </button>
        </div>

        <aside className="h-fit rounded border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-2xl font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</dd></div>
            <div className="flex justify-between border-t border-neutral-300 pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          {shippingFee > 0 && (
            <p className="mt-3 text-xs text-neutral-600">
              Spend {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
            </p>
          )}
          <button type="button" onClick={() => navigate('/checkout')} className="btn-primary mt-6 w-full py-3">
            Proceed to checkout
          </button>
          <Link to="/products" className="mt-3 block text-center text-sm text-neutral-600 hover:text-black hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}

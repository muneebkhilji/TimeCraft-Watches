import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { validateCheckout } from '../utils/validation'
import { formatPrice } from '../utils/format'
import FormField from '../components/FormField'
import Message from '../components/Message'
import EmptyState from '../components/EmptyState'
import SafeImage from '../components/SafeImage'

export default function Checkout() {
  const { currentUser } = useAuth()
  const { cartItems, subtotal, shippingFee, total } = useCart()
  const { placeOrder } = useOrders()
  const navigate = useNavigate()

  const [values, setValues] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [errors, setErrors] = useState({})
  const [orderError, setOrderError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  // A ref changes instantly, so a quick double click cannot submit the order twice
  const submitLock = useRef(false)

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (submitLock.current) return // already submitting
    setOrderError('')

    // 1. Validate the form and the cart
    const validationErrors = validateCheckout(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    if (cartItems.length === 0) {
      setOrderError('Your cart is empty.')
      return
    }

    // 2. Lock the button and show "processing" feedback
    submitLock.current = true
    setIsProcessing(true)

    setTimeout(() => {
      // 3. Create the order (checks stock, saves the order, reduces stock, clears the cart)
      const result = placeOrder(
        {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          postalCode: values.postalCode.trim(),
        },
        currentUser.id
      )

      if (!result.ok) {
        setOrderError(result.error)
        setIsProcessing(false)
        submitLock.current = false
        return
      }

      navigate(`/order-confirmation/${result.order.id}`, { replace: true })
    }, 600)
  }

  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Nothing to check out" message="Your cart is empty. Add a watch first." actionLabel="Browse watches" actionTo="/products" />
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-5xl font-semibold">Checkout</h1>
      <div className="mt-4">
        <Message type="info">
          This is a demo store. No payment is collected and no card details are needed. Placing an order only saves it in this browser.
        </Message>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem]">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <h2 className="text-3xl font-semibold">Shipping details</h2>
          {orderError && <Message type="error">{orderError}</Message>}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="fullName" label="Full name" autoComplete="name" value={values.fullName} onChange={handleChange} error={errors.fullName} />
            <FormField id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
            <FormField id="phone" label="Phone number" type="tel" autoComplete="tel" value={values.phone} onChange={handleChange} error={errors.phone} />
            <FormField id="postalCode" label="Postal code" autoComplete="postal-code" value={values.postalCode} onChange={handleChange} error={errors.postalCode} />
          </div>
          <FormField id="address" label="Shipping address" autoComplete="street-address" value={values.address} onChange={handleChange} error={errors.address} />
          <FormField id="city" label="City" autoComplete="address-level2" value={values.city} onChange={handleChange} error={errors.city} />
          <button type="submit" className="btn-gold w-full py-3 sm:w-auto sm:px-10" disabled={isProcessing}>
            {isProcessing ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Placing order...</>) : 'Place order'}
          </button>
        </form>

        <aside className="h-fit rounded border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-2xl font-semibold">Order summary</h2>
          <ul className="mt-4 divide-y divide-neutral-200">
            {cartItems.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <SafeImage src={product.image} alt={product.name} className="h-14 w-14 rounded bg-neutral-100 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-neutral-600">Qty {quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(product.price * quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-neutral-300 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</dd></div>
            <div className="flex justify-between border-t border-neutral-300 pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  )
}

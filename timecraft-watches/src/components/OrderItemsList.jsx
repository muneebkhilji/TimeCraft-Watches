import SafeImage from './SafeImage'
import { formatPrice } from '../utils/format'

// Shows the items of a saved order. Uses the copied item details stored in the order,
// so it still works if the original product was edited or deleted.
export default function OrderItemsList({ items }) {
  return (
    <ul className="divide-y divide-neutral-200">
      {items.map((item) => (
        <li key={item.productId} className="flex items-center gap-4 py-3">
          <SafeImage src={item.image} alt={item.name} className="h-16 w-16 shrink-0 rounded bg-neutral-100 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.name}</p>
            <p className="text-sm text-neutral-600">
              {item.quantity} x {formatPrice(item.price)}
            </p>
          </div>
          <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
        </li>
      ))}
    </ul>
  )
}

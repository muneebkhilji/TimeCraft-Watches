import { Link } from 'react-router-dom'
import SafeImage from './SafeImage'
import { formatPrice } from '../utils/format'

export default function ProductCard({ product }) {
  const soldOut = product.stock <= 0
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded border border-neutral-200 bg-white transition-colors hover:border-black"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <SafeImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {soldOut && (
          <span className="absolute left-3 top-3 rounded bg-black px-2 py-1 text-xs font-semibold text-white">Sold out</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-sm text-neutral-500">
          {product.brand} - {product.category}
        </p>
        <h3 className="mt-1 text-xl font-semibold leading-snug">{product.name}</h3>
        <p className="mt-auto pt-3 text-base font-semibold text-gold-dark">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}

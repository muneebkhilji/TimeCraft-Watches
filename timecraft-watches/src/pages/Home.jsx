import { Link } from 'react-router-dom'
import { ArrowRight, Truck } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { PRODUCT_CATEGORIES } from '../data/sampleProducts'
import { FREE_SHIPPING_THRESHOLD } from '../utils/pricing'
import { formatPrice } from '../utils/format'
import ProductCard from '../components/ProductCard'
import SafeImage from '../components/SafeImage'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1100&q=80'

const CATEGORY_TEXT = {
  Luxury: 'Hand-finished movements and precious details.',
  Classic: 'Slim, dressy and made for every day.',
  Sports: 'Tough, water resistant and ready to move.',
}

export default function Home() {
  const { products } = useProducts()

  // Featured watches that are still in stock (show at most 4)
  const featuredProducts = products.filter((p) => p.featured && p.stock > 0).slice(0, 4)

  return (
    <>
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-5xl font-semibold leading-[1.05] sm:text-6xl">Watches made to be handed down.</h1>
            <p className="mt-5 max-w-md text-lg text-neutral-300">
              Luxury, classic and sports watches chosen for how well they wear, not how loudly they shout.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-gold px-6 py-3">
                Shop Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/products?category=Luxury" className="inline-flex items-center rounded border border-neutral-600 px-6 py-3 text-sm font-semibold hover:border-gold hover:text-gold">
                See luxury watches
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded bg-neutral-900">
            <SafeImage src={HERO_IMAGE} alt="A silver wristwatch with a white dial" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Featured watches */}
      <section className="container-page pt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-4xl font-semibold">Featured watches</h2>
          <Link to="/products" className="text-sm font-semibold text-gold-dark hover:underline">View all watches</Link>
        </div>
        {featuredProducts.length === 0 ? (
          <p className="mt-6 text-neutral-600">No featured watches right now. Browse all watches instead.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="container-page pt-16">
        <h2 className="text-4xl font-semibold">Shop by category</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {PRODUCT_CATEGORIES.map((category) => {
            const inCategory = products.filter((p) => p.category === category)
            return (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="group relative block overflow-hidden rounded bg-black"
              >
                <SafeImage
                  src={inCategory[0]?.image}
                  alt=""
                  className="h-64 w-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <h3 className="text-3xl font-semibold">{category}</h3>
                  <p className="text-sm text-neutral-200">{CATEGORY_TEXT[category]}</p>
                  <p className="mt-1 text-sm font-semibold text-gold">{inCategory.length} watches</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Promotion */}
      <section className="container-page pt-16">
        <div className="flex flex-col items-start gap-4 rounded border border-gold bg-gold-light/40 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Truck className="mt-1 h-7 w-7 shrink-0 text-gold-dark" aria-hidden="true" />
            <div>
              <h2 className="text-3xl font-semibold">Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}</h2>
              <p className="mt-1 text-sm text-neutral-700">Applied automatically at checkout. This is a demo store, so no payment is taken.</p>
            </div>
          </div>
          <Link to="/products" className="btn-primary shrink-0">Start shopping</Link>
        </div>
      </section>
    </>
  )
}

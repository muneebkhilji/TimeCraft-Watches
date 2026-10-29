import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { PRODUCT_CATEGORIES } from '../data/sampleProducts'
import { PRICE_RANGES, SORT_OPTIONS, filterAndSortProducts } from '../utils/productFilters'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'

export default function Products() {
  const { products } = useProducts()

  // All filters live in the URL (for example /products?category=Sports&sort=price-asc).
  // That way search, category, price and sort work together, and links can open a filtered page.
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || 'all'
  const priceRange = searchParams.get('price') || 'all'
  const sort = searchParams.get('sort') || 'featured'

  // Change one filter and keep the others
  function updateFilter(name, value) {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all' || (name === 'sort' && value === 'featured')) next.delete(name)
    else next.set(name, value)
    setSearchParams(next)
  }

  function clearFilters() {
    setSearchParams({})
  }

  const visibleProducts = filterAndSortProducts(products, { search, category, priceRange, sort })
  const hasActiveFilters = search || category !== 'all' || priceRange !== 'all' || sort !== 'featured'

  return (
    <div className="container-page py-10">
      <h1 className="text-5xl font-semibold">All watches</h1>
      <p className="mt-2 text-neutral-600">
        Showing {visibleProducts.length} of {products.length} watches
      </p>

      <div className="mt-6 grid gap-4 rounded border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label htmlFor="filter-search" className="mb-1 block text-sm font-medium">Search</label>
          <input
            id="filter-search"
            type="search"
            className="input"
            placeholder="Name or brand"
            value={search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filter-category" className="mb-1 block text-sm font-medium">Category</label>
          <select id="filter-category" className="input" value={category} onChange={(e) => updateFilter('category', e.target.value)}>
            <option value="all">All categories</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-price" className="mb-1 block text-sm font-medium">Price</label>
          <select id="filter-price" className="input" value={priceRange} onChange={(e) => updateFilter('price', e.target.value)}>
            {PRICE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-sort" className="mb-1 block text-sm font-medium">Sort by</label>
          <select id="filter-sort" className="input" value={sort} onChange={(e) => updateFilter('sort', e.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <button type="button" onClick={clearFilters} className="btn-outline mt-4 px-3 py-1.5">
          Clear all filters
        </button>
      )}

      <div className="mt-8">
        {visibleProducts.length === 0 ? (
          <EmptyState
            title="No watches match your search"
            message="Try a different name, a wider price range, or remove a filter."
            actionLabel="Clear all filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

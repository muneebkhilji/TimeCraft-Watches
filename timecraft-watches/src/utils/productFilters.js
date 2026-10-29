// One place that applies search, category, price range and sorting TOGETHER.
export const PRICE_RANGES = [
  { value: 'all', label: 'Any price', min: 0, max: Infinity },
  { value: 'under-500', label: 'Under $500', min: 0, max: 500 },
  { value: '500-1500', label: '$500 - $1,500', min: 500, max: 1500 },
  { value: '1500-3000', label: '$1,500 - $3,000', min: 1500, max: 3000 },
  { value: 'over-3000', label: 'Over $3,000', min: 3000, max: Infinity },
]

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

export function filterAndSortProducts(products, { search, category, priceRange, sort }) {
  const searchText = (search || '').trim().toLowerCase()
  const range = PRICE_RANGES.find((r) => r.value === priceRange) || PRICE_RANGES[0]

  const matches = products.filter((product) => {
    const matchesSearch =
      !searchText ||
      product.name.toLowerCase().includes(searchText) ||
      product.brand.toLowerCase().includes(searchText)
    const matchesCategory = !category || category === 'all' || product.category === category
    const matchesPrice = product.price >= range.min && product.price < range.max
    return matchesSearch && matchesCategory && matchesPrice
  })

  // Copy before sorting so we never change the original list
  const sorted = [...matches]
  if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
  else if (sort === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name))
  else sorted.sort((a, b) => Number(b.featured) - Number(a.featured))

  return sorted
}

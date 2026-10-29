import { createContext, useContext, useEffect, useState } from 'react'
import { sampleProducts } from '../data/sampleProducts'
import { STORAGE_KEYS, createUniqueId, loadOrSeed, writeStorage } from '../utils/storage'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  // Sample products are only added when nothing is saved yet
  const [products, setProducts] = useState(() => loadOrSeed(STORAGE_KEYS.products, sampleProducts))

  // Save to localStorage every time the products change
  useEffect(() => {
    writeStorage(STORAGE_KEYS.products, products)
  }, [products])

  function getProductById(productId) {
    return products.find((product) => product.id === productId) || null
  }

  // Admin: add a new product. Form values come in as strings, so convert numbers here.
  function addProduct(values) {
    const id = createUniqueId('p', (candidate) => products.some((p) => p.id === candidate))
    const newProduct = {
      id,
      name: values.name.trim(),
      brand: values.brand.trim(),
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
      featured: Boolean(values.featured),
      description: values.description.trim(),
      image: values.image.trim(),
    }
    setProducts((current) => [newProduct, ...current])
    return newProduct
  }

  // Admin: edit an existing product
  function updateProduct(productId, values) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              name: values.name.trim(),
              brand: values.brand.trim(),
              category: values.category,
              price: Number(values.price),
              stock: Number(values.stock),
              featured: Boolean(values.featured),
              description: values.description.trim(),
              image: values.image.trim(),
            }
          : product
      )
    )
  }

  // Admin: delete a product. Existing orders keep their own copy of the item details,
  // so deleting a product never breaks old orders.
  function deleteProduct(productId) {
    setProducts((current) => current.filter((product) => product.id !== productId))
  }

  // Used by orders: change stock for several products at once.
  // changes looks like [{ productId: 'p1', delta: -2 }] (negative = sold, positive = restored)
  function adjustStock(changes) {
    setProducts((current) =>
      current.map((product) => {
        const change = changes.find((c) => c.productId === product.id)
        if (!change) return product
        return { ...product, stock: Math.max(0, product.stock + change.delta) }
      })
    )
  }

  const value = { products, getProductById, addProduct, updateProduct, deleteProduct, adjustStock }
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts must be used inside ProductProvider')
  return context
}

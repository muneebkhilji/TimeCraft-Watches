import { useState } from 'react'
import { PRODUCT_CATEGORIES } from '../data/sampleProducts'
import { validateProduct } from '../utils/validation'
import FormField from './FormField'

const emptyProduct = {
  name: '',
  brand: '',
  category: '',
  price: '',
  stock: '',
  image: '',
  description: '',
  featured: false,
}

// Form used by the admin to add or edit a product.
// "initialProduct" is null when adding, or an existing product when editing.
export default function ProductForm({ initialProduct, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    initialProduct
      ? { ...initialProduct, price: String(initialProduct.price), stock: String(initialProduct.stock) }
      : emptyProduct
  )
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues({ ...values, [name]: type === 'checkbox' ? checked : value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateProduct(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded border border-neutral-200 bg-white p-5">
      <h2 className="text-3xl font-semibold">{initialProduct ? 'Edit product' : 'Add a new product'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="name" label="Product name" value={values.name} onChange={handleChange} error={errors.name} />
        <FormField id="brand" label="Brand" value={values.brand} onChange={handleChange} error={errors.brand} />
        <FormField id="category" label="Category" as="select" value={values.category} onChange={handleChange} error={errors.category}>
          <option value="">Choose a category</option>
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </FormField>
        <FormField id="price" label="Price (USD)" type="number" min="0" step="0.01" value={values.price} onChange={handleChange} error={errors.price} />
        <FormField id="stock" label="Stock quantity" type="number" min="0" step="1" value={values.stock} onChange={handleChange} error={errors.stock} />
        <FormField id="image" label="Image URL (optional)" type="url" placeholder="https://..." value={values.image} onChange={handleChange} error={errors.image} />
      </div>
      <FormField id="description" label="Description" as="textarea" value={values.description} onChange={handleChange} error={errors.description} />
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="featured" checked={values.featured} onChange={handleChange} className="h-4 w-4 accent-black" />
        Show as a featured watch on the home page
      </label>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary">{initialProduct ? 'Save changes' : 'Add product'}</button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </form>
  )
}

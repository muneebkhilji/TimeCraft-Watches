import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { formatPrice } from '../../utils/format'
import ProductForm from '../../components/ProductForm'
import Message from '../../components/Message'
import SafeImage from '../../components/SafeImage'

// Small input + button to change one product's stock quickly
function StockEditor({ product, onSave }) {
  const [value, setValue] = useState(String(product.stock))

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        onSave(product, value)
      }}
    >
      <label htmlFor={`stock-${product.id}`} className="sr-only">Stock for {product.name}</label>
      <input id={`stock-${product.id}`} type="number" min="0" step="1" value={value} onChange={(e) => setValue(e.target.value)} className="input w-20 px-2 py-1.5" />
      <button type="submit" className="btn-outline px-3 py-1.5">Update</button>
    </form>
  )
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [formMode, setFormMode] = useState(null) // null, 'add' or 'edit'
  const [editingProduct, setEditingProduct] = useState(null)
  const [message, setMessage] = useState(null) // { type, text }

  function openAddForm() {
    setEditingProduct(null)
    setFormMode('add')
    setMessage(null)
  }

  function openEditForm(product) {
    setEditingProduct(product)
    setFormMode('edit')
    setMessage(null)
  }

  function closeForm() {
    setFormMode(null)
    setEditingProduct(null)
  }

  function handleFormSubmit(values) {
    if (formMode === 'edit') {
      updateProduct(editingProduct.id, values)
      setMessage({ type: 'success', text: `"${values.name}" was updated.` })
    } else {
      addProduct(values)
      setMessage({ type: 'success', text: `"${values.name}" was added to the store.` })
    }
    closeForm()
  }

  function handleDelete(product) {
    // Confirm before deleting. Old orders keep their own copy of the item, so they are not affected.
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone. Existing orders will not be affected.`)) return
    deleteProduct(product.id)
    setMessage({ type: 'success', text: `"${product.name}" was deleted.` })
  }

  function handleStockSave(product, newStock) {
    const stockNumber = Number(newStock)
    if (newStock.trim() === '' || !Number.isInteger(stockNumber) || stockNumber < 0) {
      setMessage({ type: 'error', text: `Stock for "${product.name}" must be a whole number, 0 or higher.` })
      return
    }
    updateProduct(product.id, { ...product, stock: stockNumber })
    setMessage({ type: 'success', text: `Stock for "${product.name}" is now ${stockNumber}.` })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-5xl font-semibold">Products</h1>
        {!formMode && (
          <button type="button" onClick={openAddForm} className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" /> Add product
          </button>
        )}
      </div>

      {message && (
        <div className="mt-4">
          <Message type={message.type}>{message.text}</Message>
        </div>
      )}

      {formMode && (
        <div className="mt-6">
          <ProductForm key={editingProduct?.id || 'new'} initialProduct={editingProduct} onSubmit={handleFormSubmit} onCancel={closeForm} />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded border border-neutral-200 bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
            <tr>
              <th scope="col" className="p-3 font-semibold">Product</th>
              <th scope="col" className="p-3 font-semibold">Category</th>
              <th scope="col" className="p-3 font-semibold">Price</th>
              <th scope="col" className="p-3 font-semibold">Stock</th>
              <th scope="col" className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {products.length === 0 && (
              <tr><td colSpan="5" className="p-6 text-center text-neutral-600">There are no products yet. Add your first one.</td></tr>
            )}
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <SafeImage src={product.image} alt="" className="h-12 w-12 rounded bg-neutral-100 object-cover" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-neutral-500">{product.brand}{product.featured ? ' - Featured' : ''}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{formatPrice(product.price)}</td>
                <td className="p-3"><StockEditor key={`${product.id}-${product.stock}`} product={product} onSave={handleStockSave} /></td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEditForm(product)} className="btn-outline px-3 py-1.5" aria-label={`Edit ${product.name}`}>
                      <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(product)} className="btn-danger" aria-label={`Delete ${product.name}`}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatPrice(amount) {
  return priceFormatter.format(Number(amount) || 0)
}

export function formatDate(isoString) {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Avoid floating point errors such as 0.1 + 0.2 = 0.30000000000000004
export function roundMoney(amount) {
  return Math.round(amount * 100) / 100
}

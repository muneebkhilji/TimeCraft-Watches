// Validation helpers. Each function returns an object of error messages.
// An empty object means the form is valid.

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function validateSignup({ fullName, email, password, confirmPassword }) {
  const errors = {}

  if (!fullName.trim()) errors.fullName = 'Full name is required.'

  if (!email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address, like name@example.com.'

  if (!password) errors.password = 'Password is required.'
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.'

  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'

  return errors
}

export function validateLogin({ email, password }) {
  const errors = {}

  if (!email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'

  if (!password) errors.password = 'Password is required.'

  return errors
}

export function validateCheckout({ fullName, email, phone, address, city, postalCode }) {
  const errors = {}

  if (!fullName.trim()) errors.fullName = 'Full name is required.'

  if (!email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'

  if (!phone.trim()) errors.phone = 'Phone number is required.'
  else if (!/^[0-9+\-()\s]{7,20}$/.test(phone.trim()))
    errors.phone = 'Enter a valid phone number (digits, spaces, + - ( ) only, at least 7 characters).'

  if (!address.trim()) errors.address = 'Shipping address is required.'
  if (!city.trim()) errors.city = 'City is required.'

  if (!postalCode.trim()) errors.postalCode = 'Postal code is required.'
  else if (!/^[A-Za-z0-9\- ]{3,10}$/.test(postalCode.trim()))
    errors.postalCode = 'Enter a valid postal code (3-10 letters or numbers).'

  return errors
}

// Product form values arrive as strings from the inputs, so numbers are checked carefully.
export function validateProduct({ name, brand, category, price, stock, description }) {
  const errors = {}

  if (!name.trim()) errors.name = 'Product name is required.'
  if (!brand.trim()) errors.brand = 'Brand is required.'
  if (!category) errors.category = 'Choose a category.'

  if (String(price).trim() === '') errors.price = 'Price is required.'
  else if (Number.isNaN(Number(price)) || Number(price) <= 0) errors.price = 'Price must be a number greater than 0.'

  if (String(stock).trim() === '') errors.stock = 'Stock is required.'
  else if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
    errors.stock = 'Stock must be a whole number, 0 or higher.'

  if (!description.trim()) errors.description = 'Description is required.'

  return errors
}

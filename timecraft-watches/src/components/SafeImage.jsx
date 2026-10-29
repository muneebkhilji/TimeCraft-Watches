import { useState } from 'react'
import { FALLBACK_IMAGE } from '../utils/images'

// An <img> that swaps to a built-in picture if the real image fails to load.
export default function SafeImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed || !src ? FALLBACK_IMAGE : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}

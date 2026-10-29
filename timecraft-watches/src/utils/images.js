// Built-in watch picture used when a product image cannot be loaded.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#e5e5e5"/>
  <rect x="165" y="20" width="70" height="360" rx="22" fill="#404040"/>
  <circle cx="200" cy="200" r="118" fill="#111"/>
  <circle cx="200" cy="200" r="104" fill="#f5f5f5" stroke="#b08d57" stroke-width="5"/>
  <g stroke="#222" stroke-width="4" stroke-linecap="round">
    <path d="M200 106v16M200 278v16M106 200h16M278 200h16"/>
  </g>
  <path d="M200 200V140" stroke="#000" stroke-width="7" stroke-linecap="round"/>
  <path d="M200 200l44 26" stroke="#000" stroke-width="5" stroke-linecap="round"/>
  <circle cx="200" cy="200" r="7" fill="#b08d57"/>
</svg>`

export const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`

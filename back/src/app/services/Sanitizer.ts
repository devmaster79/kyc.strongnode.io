export function sanitizeUrl(url: unknown) {
  return encodeURI(String(url))
}

export function sanitizeText(text: unknown) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

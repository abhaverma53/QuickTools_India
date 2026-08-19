export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B"
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  const digits = value >= 100 || unitIndex === 0 ? 0 : value >= 10 ? 1 : 2
  return `${value.toFixed(digits)} ${units[unitIndex]}`
}

export function percentReduced(original, compressed) {
  if (!original) return 0
  return Math.max(0, Math.round((1 - compressed / original) * 100))
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = sanitizeFilename(filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function sanitizeFilename(name) {
  return String(name || "download")
    .split(/[/\\]/)
    .pop()
    .replace(/[^\w.\-() ]+/g, "_")
    .slice(0, 120) || "download"
}

export function parseNumber(value, label) {
  const trimmed = String(value).trim()
  if (!trimmed) return { error: `Please enter ${label}.` }
  const normalised = trimmed.replace(/,/g, "")
  const number = Number(normalised)
  if (!Number.isFinite(number)) return { error: `${label} must be a valid number.` }
  return { value: number }
}

export function percentOf(percent, total) {
  return (percent / 100) * total
}

export function isWhatPercent(part, whole) {
  if (whole === 0) {
    return { error: "The second number cannot be 0." }
  }
  return { value: (part / whole) * 100 }
}

export function percentChange(oldValue, newValue) {
  if (oldValue === 0) {
    return { error: "The old value cannot be 0." }
  }
  const change = ((newValue - oldValue) / Math.abs(oldValue)) * 100
  return { value: change, increased: newValue >= oldValue }
}

export function formatResultNumber(value) {
  if (!Number.isFinite(value)) return "—"
  const abs = Math.abs(value)
  const digits = abs >= 1000 ? 2 : abs >= 1 ? 4 : 6
  return Number(value.toFixed(digits)).toString()
}

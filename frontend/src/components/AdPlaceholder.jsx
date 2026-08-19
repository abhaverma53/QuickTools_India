export default function AdPlaceholder({ slot = "content" }) {
  return (
    <aside className={`ad-slot ad-slot-${slot}`} aria-label="Advertisement placeholder">
      <span>Advertisement</span>
    </aside>
  )
}

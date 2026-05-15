export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(dateStr)
}

export function truncate(str, len = 140) {
  if (!str) return ''
  return str.length <= len ? str : str.slice(0, len) + '...'
}

export function readingTime(content) {
  if (!content) return '1 min read'
  const words = content.trim().split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 200))
  return `${mins} min read`
}

export function randomImage(seed, w = 800, h = 450) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

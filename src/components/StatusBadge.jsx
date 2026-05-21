import React from 'react'

function getStatusColour(status) {
  if (!status) return 'var(--status-unknown)'

  switch (status.toLowerCase()) {
    case 'active':
      return 'var(--status-active)'

    case 'blocked':
      return 'var(--status-blocked)'

    case 'review':
      return 'var(--status-review)'

    case 'completed':
      return 'var(--status-completed)'

    case 'in progress':
      return 'var(--status-active)'

    default:
      return 'var(--status-unknown)'
  }
}

export default function StatusBadge({
  status,
  count,
  small = false,
}) {
  const colour = getStatusColour(status)

  return (
    <span
      className="status-label"
      style={{
        color: colour,
        fontSize: small ? '11px' : '12px',
      }}
    >
      <span
        className="status-dot"
        style={{ background: colour }}
      />

      {count !== undefined
        ? `${count} ${status}`
        : status ?? 'unknown'}
    </span>
  )
}
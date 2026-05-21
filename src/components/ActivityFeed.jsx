// ActivityFeed.jsx
//
// T-06: Activity feed component.
//
// This is a SHELL. The container renders and the header shows,
// but nothing is displayed inside it.
//
// Candidate's job:
//   - Receive `activityLog` and `users` as props
//   - Sort entries newest first
//   - For each entry render: timestamp, user name (look up from users),
//     action text, and the workflow ID it belongs to
//   - Handle edge cases in the data:
//       - user: null (anonymous entries)
//       - action: "" (empty action string — wf_039)
//       - duplicate entries (act_022 and act_023 are identical)
//       - act_040 references wf_999 which doesn't exist in workflows
//
// The CSS for .activity-feed and .activity-feed-header is in global.css.
//
// Inline status colour — T-07: 4th copy of this logic. Extract to StatusBadge.

import React, { useMemo } from 'react'

export default function ActivityFeed({ activityLog, users }) {
  // TODO (T-06): Wire the data. Right now this renders nothing.
  // Start here:
  //   const sorted = [...(activityLog ?? [])].sort(
  //     (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  //   )

  // Build a fast id → user lookup so each entry doesn't loop the whole array
 const userMap = useMemo(() => {
    if (!users) return {}
    if (Array.isArray(users)) {
      const map = {}
      users.forEach(u => { map[u.id] = u })
      return map
    }
    return users
  }, [users])

  const sorted = useMemo(() => {
    const seen = new Set()
    return [...(activityLog ?? [])]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      // deduplicate — act_022 and act_023 are identical, drop the second
      .filter(entry => {
        const key = `${entry.user_id}|${entry.action}|${entry.workflow_id}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      // skip empty action string — wf_039
      .filter(entry => entry.action?.trim() !== '')
  }, [activityLog])

  return (
    <div className="activity-feed">
      <div className="activity-feed-header">Activity</div>

      {/* TODO (T-06): map sorted entries here */}
      {/* Each entry should look roughly like:
          <div key={entry.id} style={{ ... }}>
            <span style={{ color: 'var(--text-muted)' }}>{formattedTime}</span>
            {' '}<strong>{userName}</strong>{' '}{entry.action}
            {' '}<span style={{ color: 'var(--text-muted)' }}>{entry.workflow_id}</span>
          </div>
      */}

      {sorted.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '8px' }}>
          No activity yet.
        </div>
      )}

      {sorted.map(entry => {
        // user_id: null → anonymous; user_id not in users → also falls back
        const user = entry.user_id ? userMap[entry.user_id] : null
        const userName = user?.name ?? 'Anonymous'

        const parsedDate =
  typeof entry.timestamp === 'number'
    ? new Date(entry.timestamp * 1000)
    : new Date(entry.timestamp)

const time = isNaN(parsedDate)
  ? '--:--'
  : parsedDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
        // act_040 references wf_999 which doesn't exist — just display the id, no crash
        const workflowLabel = entry.workflow_id ?? '—'

        return (
          <div
            key={entry.id}
            style={{
              padding: '6px 0',
              borderBottom: '1px solid var(--border)',
              fontSize: '12px',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>{time}</span>
            {' '}<strong>{userName}</strong>{' '}{entry.action}
            {' '}<span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {workflowLabel}
            </span>
          </div>
        )
      })}
    </div>
  )
}
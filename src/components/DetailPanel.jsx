// DetailPanel.jsx
//
// T-05: Task detail side panel.
//
// This component is a SHELL. It renders the container and empty state
// but contains no real content logic. Candidate's job:
//   - Show workflow title, client, status (use StatusBadge — T-07)
//   - Render status history timeline from workflow.history
//   - Show last updated, due date, assignee
//   - Add a notes field (read from workflow.notes, allow editing)
//   - Panel should slide in when a card is selected
//
// The panel container and CSS class already exist in global.css.
// Wire it up here.
//
// Inline status colour map — copy-pasted again (T-07: extract to StatusBadge)

import React, { useState } from 'react'

// TODO (T-07): replace this with <StatusBadge status={workflow.status} />
function getStatusColour(status) {
  if (!status) return 'var(--status-unknown)'
  switch (status.toLowerCase()) {
    case 'active':      return 'var(--status-active)'
    case 'blocked':     return 'var(--status-blocked)'
    case 'review':      return 'var(--status-review)'
    case 'completed':   return 'var(--status-completed)'
    case 'in progress': return 'var(--status-active)'
    default:            return 'var(--status-unknown)'
  }
}

export default function DetailPanel({ workflow, onClose }) {
  const [notes, setNotes] = useState(workflow?.notes ?? '')

  // T-05: If no workflow is selected, show the empty state.
  if (!workflow) {
    return (
      <div className="detail-panel">
        <div className="detail-panel-empty">
          Select a workflow<br />to see details
        </div>
      </div>
    )
  }

  // TODO (T-05): Build the full detail view here.
  // Right now it just shows the title and a placeholder.
  // Candidate should add:
  //   - Status badge (T-07)
  //   - Assignee
  //   - Due date / created date
  //   - Progress bar
  //   - History timeline (workflow.history)
  //   - Notes field
  //   - suggested_actions array (hint for T-08)

  const updatedAt = workflow.updated_at
    ? new Date(workflow.updated_at).toLocaleString([], {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null

  return (
    <div className="detail-panel">

      {/* Header — title, client, status, close button */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {workflow.id}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: 1.3,
            }}>
              {workflow.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {workflow.client_name || <span style={{ color: 'var(--text-muted)' }}>No client</span>}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1,
              padding: '2px 4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Inline status — T-07: this is the 3rd copy of this logic */}
        <div style={{ marginTop: '12px' }}>
          <span className="status-label" style={{ color: getStatusColour(workflow.status) }}>
            <span className="status-dot" style={{ background: getStatusColour(workflow.status) }} />
            {workflow.status ?? 'unknown'}
          </span>
        </div>
      </div>

      {/* Body — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Meta — assignee, updated, priority */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>

          {/* Assignee */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Assignee</span>
            {workflow.assignee
              ? <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'var(--accent)', color: '#fff',
                    fontSize: '9px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {workflow.assignee.avatar}
                  </span>
                  {workflow.assignee.name}
                </span>
              : <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
            }
          </div>

          {/* Last updated */}
          {updatedAt && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Last updated</span>
              <span>{updatedAt}</span>
            </div>
          )}

          {/* Priority */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Priority</span>
            <span>{workflow.priority ?? '—'}</span>
          </div>
        </div>

        {/* Progress bar */}
        {workflow.progress != null && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Progress</span>
              <span>{workflow.progress}%</span>
            </div>
            <div style={{ height: '4px', borderRadius: '2px', background: 'var(--border)' }}>
              <div style={{
                height: '100%',
                borderRadius: '2px',
                width: `${workflow.progress}%`,
                background: getStatusColour(workflow.status),
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}

        {/* Tags */}
        {workflow.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {workflow.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '999px',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* History timeline — workflow.history */}
        {workflow.history?.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              History
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {workflow.history.map((entry, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--text-muted)',
                    marginTop: '4px', flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ color: 'var(--text-primary)' }}>{entry.note ?? entry.action ?? '—'}</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                      {entry.timestamp
                        ? new Date(entry.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes — editable */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Notes
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add notes..."
            style={{
              width: '100%',
              minHeight: '80px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '12px',
              padding: '8px',
              resize: 'vertical',
              fontFamily: 'var(--font-sans)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* suggested_actions — hint for T-08 */}
        {workflow.suggested_actions?.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Suggested actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {workflow.suggested_actions.map(action => (
                <button
                  key={action}
                  style={{
                    textAlign: 'left',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {action.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
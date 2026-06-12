import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

interface BootScreenProps {
  onDone: () => void
}

const VISIBLE_MS = 2100
const FADE_MS = 450

/** A short, skippable Windows 98 style splash. Click anywhere to skip. */
export function BootScreen({ onDone }: BootScreenProps) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = window.setTimeout(() => setLeaving(true), VISIBLE_MS)
    return () => window.clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (!leaving) return
    const t = window.setTimeout(onDone, FADE_MS)
    return () => window.clearTimeout(t)
  }, [leaving, onDone])

  return (
    <div
      className={`boot-screen${leaving ? ' leaving' : ''}`}
      onClick={() => setLeaving(true)}
      role="button"
      aria-label="Skip intro"
    >
      <div className="boot-logo">
        <div className="boot-flag" aria-hidden>
          <span /><span /><span /><span />
        </div>
        <div className="boot-title">
          <small>Welcome to</small>
          <strong>
            {profile.shortName}
            <em>98</em>
          </strong>
        </div>
      </div>

      <div className="boot-loader" aria-hidden>
        <div className="boot-loader-track">
          <div className="boot-loader-block" />
        </div>
      </div>

      <div className="boot-hint">click to skip</div>
    </div>
  )
}

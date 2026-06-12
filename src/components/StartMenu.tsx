import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { AppId } from '../types'
import { APPS, APP_ORDER } from '../apps/registry'
import { asset } from '../lib/asset'
import { profile } from '../data/profile'

interface StartMenuProps {
  open: boolean
  onClose: () => void
  onLaunch: (id: AppId) => void
  onShutDown: () => void
}

export function StartMenu({ open, onClose, onLaunch, onShutDown }: StartMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const startBtn = (e.target as HTMLElement).closest('.start-button')
        if (!startBtn) onClose()
      }
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className="start-menu"
          initial={{ opacity: 0, y: 8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.14 }}
        >
          <div className="start-menu-sidebar">
            <span className="start-menu-sidebar-text">
              {profile.shortName}
              <strong>98</strong>
            </span>
          </div>

          <ul className="start-menu-list">
            {APP_ORDER.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => {
                    onLaunch(id)
                    onClose()
                  }}
                >
                  <img src={APPS[id].icon} alt="" aria-hidden />
                  <span>{APPS[id].title}</span>
                </button>
              </li>
            ))}
            <li className="start-menu-sep" role="separator" />
            <li>
              <button type="button" onClick={onShutDown}>
                <img src={asset('icons/shutdown.svg')} alt="" aria-hidden />
                <span>Shut Down…</span>
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

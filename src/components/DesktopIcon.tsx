import { useRef, useState } from 'react'

interface DesktopIconProps {
  icon: string
  label: string
  onOpen: () => void
}

const isTouch =
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/**
 * A desktop icon. Double-click opens it (classic), but on touch devices a
 * single tap opens so phones aren't stuck. Single click just selects.
 */
export function DesktopIcon({ icon, label, onOpen }: DesktopIconProps) {
  const [selected, setSelected] = useState(false)
  const blurTimer = useRef<number | undefined>(undefined)

  return (
    <button
      type="button"
      className={`desktop-icon${selected ? ' selected' : ''}`}
      onClick={() => {
        setSelected(true)
        if (isTouch) onOpen()
      }}
      onDoubleClick={onOpen}
      onBlur={() => {
        window.clearTimeout(blurTimer.current)
        blurTimer.current = window.setTimeout(() => setSelected(false), 120)
      }}
    >
      <img src={icon} alt="" className="desktop-icon-img" draggable={false} />
      <span className="desktop-icon-label">{label}</span>
    </button>
  )
}

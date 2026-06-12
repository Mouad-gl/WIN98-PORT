import { useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useWindows } from '../context/WindowManager'
import { APPS, APP_ORDER } from '../apps/registry'
import { shortcuts } from '../data/shortcuts'
import { DesktopIcon } from './DesktopIcon'
import { Window } from './Window'
import { Taskbar } from './Taskbar'
import { StartMenu } from './StartMenu'

interface DesktopProps {
  onShutDown: () => void
}

export function Desktop({ onShutDown }: DesktopProps) {
  const { windows, openApp } = useWindows()
  const boundsRef = useRef<HTMLDivElement>(null)
  const [startOpen, setStartOpen] = useState(false)

  return (
    <div className="desktop">
      <div className="desktop-icons">
        {APP_ORDER.map((id) => (
          <DesktopIcon
            key={id}
            icon={APPS[id].icon}
            label={APPS[id].title}
            onOpen={() => openApp(id)}
          />
        ))}
        {shortcuts.map((s) => (
          <DesktopIcon
            key={s.id}
            icon={s.icon}
            label={s.label}
            onOpen={() => window.open(s.href, '_blank', 'noopener,noreferrer')}
          />
        ))}
      </div>

      <div className="window-layer" ref={boundsRef}>
        <AnimatePresence>
          {windows.map((w) => (
            <Window key={w.id} win={w} boundsRef={boundsRef} />
          ))}
        </AnimatePresence>
      </div>

      <StartMenu
        open={startOpen}
        onClose={() => setStartOpen(false)}
        onLaunch={openApp}
        onShutDown={() => {
          setStartOpen(false)
          onShutDown()
        }}
      />

      <Taskbar startOpen={startOpen} onStartToggle={() => setStartOpen((o) => !o)} />
    </div>
  )
}

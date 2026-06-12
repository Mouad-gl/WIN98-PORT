import { useWindows } from '../context/WindowManager'
import { APPS, APP_ORDER } from '../apps/registry'
import { asset } from '../lib/asset'
import { Clock } from './Clock'

interface TaskbarProps {
  startOpen: boolean
  onStartToggle: () => void
}

export function Taskbar({ startOpen, onStartToggle }: TaskbarProps) {
  const { windows, activeId, taskbarClick } = useWindows()

  // Keep task buttons in a stable order (by app order, not open order).
  const openWindows = APP_ORDER.map((id) => windows.find((w) => w.id === id)).filter(
    (w): w is NonNullable<typeof w> => Boolean(w),
  )

  return (
    <footer className="taskbar">
      <button
        type="button"
        className={`start-button${startOpen ? ' active' : ''}`}
        onClick={onStartToggle}
      >
        <img src={asset('icons/logo.svg')} alt="" className="start-logo" aria-hidden />
        <span>Start</span>
      </button>

      <div className="taskbar-divider" />

      <div className="taskbar-tasks">
        {openWindows.map((w) => {
          const active = activeId === w.id && !w.minimized
          return (
            <button
              key={w.id}
              type="button"
              className={`task-button${active ? ' active' : ''}`}
              onClick={() => taskbarClick(w.id)}
            >
              <img src={APPS[w.id].icon} alt="" aria-hidden />
              <span>{w.title}</span>
            </button>
          )
        })}
      </div>

      <div className="taskbar-tray">
        <Clock />
      </div>
    </footer>
  )
}

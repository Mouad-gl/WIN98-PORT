import {
  memo,
  Suspense,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { motion } from 'framer-motion'
import type { OpenWindow } from '../types'
import { APPS } from '../apps/registry'
import { useWindows } from '../context/WindowManager'

interface WindowProps {
  win: OpenWindow
  /** The desktop area the window lives in — used for drag/maximize bounds. */
  boundsRef: RefObject<HTMLDivElement>
}

const MIN_W = 240
const MIN_H = 160

function WindowImpl({ win, boundsRef }: WindowProps) {
  const { focusWindow, minimizeWindow, closeWindow, activeId } = useWindows()
  const def = APPS[win.id]
  const isActive = activeId === win.id

  const [pos, setPos] = useState({ x: win.initialX, y: win.initialY })
  const [size, setSize] = useState({ w: win.initialWidth, h: win.initialHeight })
  const [maximized, setMaximized] = useState(false)
  const prevRect = useRef({ x: win.initialX, y: win.initialY, w: win.initialWidth, h: win.initialHeight })

  const bounds = () => boundsRef.current?.getBoundingClientRect()

  const startDrag = useCallback(
    (e: ReactPointerEvent) => {
      if (maximized) return
      if ((e.target as HTMLElement).closest('.title-bar-controls')) return
      e.preventDefault()
      focusWindow(win.id)

      const startX = e.clientX
      const startY = e.clientY
      const origin = { ...pos }
      const b = bounds()

      const onMove = (ev: PointerEvent) => {
        let nx = origin.x + (ev.clientX - startX)
        let ny = origin.y + (ev.clientY - startY)
        if (b) {
          nx = Math.min(Math.max(nx, -(size.w - 90)), b.width - 90)
          ny = Math.min(Math.max(ny, 0), b.height - 34)
        }
        setPos({ x: nx, y: ny })
      }
      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [maximized, focusWindow, win.id, pos, size.w],
  )

  const startResize = useCallback(
    (e: ReactPointerEvent) => {
      if (maximized) return
      e.preventDefault()
      e.stopPropagation()
      focusWindow(win.id)

      const startX = e.clientX
      const startY = e.clientY
      const origin = { ...size }
      const b = bounds()

      const onMove = (ev: PointerEvent) => {
        let nw = origin.w + (ev.clientX - startX)
        let nh = origin.h + (ev.clientY - startY)
        nw = Math.max(nw, MIN_W)
        nh = Math.max(nh, MIN_H)
        if (b) {
          nw = Math.min(nw, b.width - pos.x - 4)
          nh = Math.min(nh, b.height - pos.y - 4)
        }
        setSize({ w: nw, h: nh })
      }
      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [maximized, focusWindow, win.id, size, pos.x, pos.y],
  )

  const toggleMaximize = useCallback(() => {
    setMaximized((m) => {
      if (!m) prevRect.current = { x: pos.x, y: pos.y, w: size.w, h: size.h }
      else {
        setPos({ x: prevRect.current.x, y: prevRect.current.y })
        setSize({ w: prevRect.current.w, h: prevRect.current.h })
      }
      return !m
    })
  }, [pos, size])

  const Component = def.Component

  const style: CSSProperties = maximized
    ? { left: 0, top: 0, width: '100%', height: '100%', zIndex: win.zIndex }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex: win.zIndex }

  return (
    <motion.div
      className={`window win98-window${maximized ? ' is-maximized' : ''}`}
      style={style}
      role="dialog"
      aria-label={win.title}
      onPointerDown={() => focusWindow(win.id)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: win.minimized ? 0.85 : 1,
        pointerEvents: win.minimized ? 'none' : 'auto',
        transition: { type: 'spring', stiffness: 420, damping: 30 },
      }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.12 } }}
    >
      <div
        className={`title-bar${isActive ? '' : ' inactive'}`}
        onPointerDown={startDrag}
        onDoubleClick={toggleMaximize}
      >
        <div className="title-bar-text">
          <img src={def.icon} alt="" className="title-bar-icon" aria-hidden />
          {win.title}
        </div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={() => minimizeWindow(win.id)} />
          <button aria-label={maximized ? 'Restore' : 'Maximize'} onClick={toggleMaximize} />
          <button aria-label="Close" onClick={() => closeWindow(win.id)} />
        </div>
      </div>

      <div className="window-body win98-window-body">
        <Suspense fallback={<div className="window-loading">Loading…</div>}>
          <Component />
        </Suspense>
      </div>

      {!maximized && (
        <div className="resize-grip" onPointerDown={startResize} aria-hidden />
      )}
    </motion.div>
  )
}

export const Window = memo(WindowImpl)

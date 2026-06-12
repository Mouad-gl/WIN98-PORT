import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { AppId, OpenWindow } from '../types'
import { APPS } from '../apps/registry'

interface WindowManagerState {
  windows: OpenWindow[]
  activeId: AppId | null
  topZ: number
}

type Action =
  | { type: 'OPEN'; id: AppId }
  | { type: 'CLOSE'; id: AppId }
  | { type: 'FOCUS'; id: AppId }
  | { type: 'MINIMIZE'; id: AppId }
  | { type: 'TASKBAR_CLICK'; id: AppId }

const BASE_Z = 10

/** Work out where a freshly opened window should appear (centered + cascaded). */
function initialGeometry(id: AppId, openCount: number) {
  const def = APPS[id]
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768

  const width = Math.min(def.defaultWidth, vw - 16)
  const height = Math.min(def.defaultHeight, vh - 80)

  const cascade = (openCount % 6) * 26
  const x = Math.max(8, Math.round((vw - width) / 2) + cascade - 60)
  const y = Math.max(8, Math.round((vh - height) / 2) + cascade - 70)

  return { initialWidth: width, initialHeight: height, initialX: x, initialY: y }
}

function topmostVisible(windows: OpenWindow[]): AppId | null {
  const visible = windows.filter((w) => !w.minimized)
  if (visible.length === 0) return null
  return visible.reduce((top, w) => (w.zIndex > top.zIndex ? w : top)).id
}

function reducer(state: WindowManagerState, action: Action): WindowManagerState {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.windows.find((w) => w.id === action.id)
      const nextZ = state.topZ + 1
      if (existing) {
        // Already open: restore (if minimized) and bring to front.
        return {
          ...state,
          activeId: action.id,
          topZ: nextZ,
          windows: state.windows.map((w) =>
            w.id === action.id ? { ...w, minimized: false, zIndex: nextZ } : w,
          ),
        }
      }
      const def = APPS[action.id]
      const geo = initialGeometry(action.id, state.windows.length)
      const win: OpenWindow = {
        id: action.id,
        title: def.title,
        zIndex: nextZ,
        minimized: false,
        ...geo,
      }
      return {
        windows: [...state.windows, win],
        activeId: action.id,
        topZ: nextZ,
      }
    }

    case 'CLOSE': {
      const windows = state.windows.filter((w) => w.id !== action.id)
      return {
        ...state,
        windows,
        activeId: state.activeId === action.id ? topmostVisible(windows) : state.activeId,
      }
    }

    case 'FOCUS': {
      if (state.activeId === action.id) {
        const w = state.windows.find((x) => x.id === action.id)
        if (w && !w.minimized && w.zIndex === state.topZ) return state
      }
      const nextZ = state.topZ + 1
      return {
        ...state,
        activeId: action.id,
        topZ: nextZ,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: false, zIndex: nextZ } : w,
        ),
      }
    }

    case 'MINIMIZE': {
      const windows = state.windows.map((w) =>
        w.id === action.id ? { ...w, minimized: true } : w,
      )
      return {
        ...state,
        windows,
        activeId: state.activeId === action.id ? topmostVisible(windows) : state.activeId,
      }
    }

    case 'TASKBAR_CLICK': {
      const w = state.windows.find((x) => x.id === action.id)
      if (!w) return state
      // Minimized → restore & focus. Focused & visible → minimize. Else focus.
      if (w.minimized) return reducer(state, { type: 'FOCUS', id: action.id })
      if (state.activeId === action.id) return reducer(state, { type: 'MINIMIZE', id: action.id })
      return reducer(state, { type: 'FOCUS', id: action.id })
    }

    default:
      return state
  }
}

interface WindowManagerValue {
  windows: OpenWindow[]
  activeId: AppId | null
  openApp: (id: AppId) => void
  closeWindow: (id: AppId) => void
  focusWindow: (id: AppId) => void
  minimizeWindow: (id: AppId) => void
  taskbarClick: (id: AppId) => void
  isOpen: (id: AppId) => boolean
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null)

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    windows: [],
    activeId: null,
    topZ: BASE_Z,
  })

  const openApp = useCallback((id: AppId) => dispatch({ type: 'OPEN', id }), [])
  const closeWindow = useCallback((id: AppId) => dispatch({ type: 'CLOSE', id }), [])
  const focusWindow = useCallback((id: AppId) => dispatch({ type: 'FOCUS', id }), [])
  const minimizeWindow = useCallback((id: AppId) => dispatch({ type: 'MINIMIZE', id }), [])
  const taskbarClick = useCallback((id: AppId) => dispatch({ type: 'TASKBAR_CLICK', id }), [])

  const value = useMemo<WindowManagerValue>(
    () => ({
      windows: state.windows,
      activeId: state.activeId,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      taskbarClick,
      isOpen: (id: AppId) => state.windows.some((w) => w.id === id),
    }),
    [state.windows, state.activeId, openApp, closeWindow, focusWindow, minimizeWindow, taskbarClick],
  )

  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>
}

export function useWindows(): WindowManagerValue {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindows must be used within a WindowManagerProvider')
  return ctx
}

import type { ComponentType } from 'react'

/** Every "app" / window on the desktop is keyed by one of these ids. */
export type AppId = 'about' | 'projects' | 'hobbies' | 'contact' | 'minesweeper'

/** A window that is currently open on the desktop (single instance per app). */
export interface OpenWindow {
  id: AppId
  title: string
  zIndex: number
  minimized: boolean
  /** Geometry used to seed the window's own local state on first open. */
  initialX: number
  initialY: number
  initialWidth: number
  initialHeight: number
}

/** Static definition of an app, used by the desktop, Start menu and taskbar. */
export interface AppDefinition {
  id: AppId
  title: string
  /** Path (under /public) to the app's icon. */
  icon: string
  Component: ComponentType
  defaultWidth: number
  defaultHeight: number
}

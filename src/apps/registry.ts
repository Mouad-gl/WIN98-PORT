import { lazy } from 'react'
import type { AppDefinition, AppId } from '../types'
import { asset } from '../lib/asset'

/**
 * Central registry of every app/window. The desktop icons, Start menu and
 * taskbar are all generated from this. App components are lazy-loaded so each
 * window's code only ships when it's actually opened (faster first paint).
 */
export const APPS: Record<AppId, AppDefinition> = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: asset('icons/user.svg'),
    Component: lazy(() => import('./About')),
    defaultWidth: 480,
    defaultHeight: 440,
  },
  projects: {
    id: 'projects',
    title: 'My Projects',
    icon: asset('icons/folder.svg'),
    Component: lazy(() => import('./Projects')),
    defaultWidth: 640,
    defaultHeight: 480,
  },
  hobbies: {
    id: 'hobbies',
    title: 'Hobbies',
    icon: asset('icons/star.svg'),
    Component: lazy(() => import('./Hobbies')),
    defaultWidth: 520,
    defaultHeight: 420,
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    icon: asset('icons/mail.svg'),
    Component: lazy(() => import('./Contact')),
    defaultWidth: 460,
    defaultHeight: 470,
  },
  minesweeper: {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: asset('icons/mine.svg'),
    Component: lazy(() => import('./Minesweeper')),
    defaultWidth: 320,
    defaultHeight: 400,
  },
}

/** Order used for desktop icons + Start menu. */
export const APP_ORDER: AppId[] = ['about', 'projects', 'hobbies', 'contact', 'minesweeper']

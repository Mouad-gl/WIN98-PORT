import { asset } from '../lib/asset'

/**
 * External-link desktop shortcuts. Unlike the apps in apps/registry.ts these
 * don't open a window — double-clicking (or tapping on touch) opens the link
 * in a new tab. Add more here and they show up on the desktop automatically.
 */
export interface Shortcut {
  id: string
  label: string
  /** Path under /public to the icon (no leading slash). */
  icon: string
  /** Where the shortcut points. */
  href: string
}

export const shortcuts: Shortcut[] = [
  {
    id: 'behance',
    label: 'Behance',
    icon: asset('icons/behance.svg'),
    href: 'https://www.behance.net/mouadguaalla',
  },
]

/**
 * ┌────────────────────────────────────────────────────────────────┐
 * │  EDIT ME — this is the single source of truth for your details.  │
 * └────────────────────────────────────────────────────────────────┘
 * Everything in the About / Contact windows reads from here.
 */

export interface SocialLink {
  label: string
  url: string
  handle: string
}

export interface Skill {
  name: string
  /** 0–100, drives the little Win98 progress bar. */
  level: number
}

export const profile = {
  // TODO: confirm your full name + role.
  name: 'Mouad Guaalla',
  shortName: 'Mouad',
  role: 'Designer & Creative Developer',
  tagline: 'I make things that look good and feel right — pixels, motion, and code.',

  // Shown in the About window. Each string is a paragraph.
  bio: [
    "Hi, I'm Mouad — a designer who codes (or a developer who designs, depending on the day). I like building interfaces that have a bit of personality instead of the same flat template everyone ships.",
    'This whole portfolio is a tiny Windows 98 running in your browser. Double-click the icons, drag the windows around, and yes — Minesweeper actually works. Have a look around.',
  ],

  // TODO: set a real location or leave as '' to hide it.
  location: 'Morocco',
  availability: 'Open to freelance & full-time work',

  email: 'm.guaalla@gmail.com',

  socials: [
    { label: 'GitHub', url: 'https://github.com/mouad-gl', handle: '@mouad-gl' },
    // TODO: replace these with your real links (or delete them).
    { label: 'LinkedIn', url: 'https://www.linkedin.com/', handle: 'add-your-linkedin' },
    { label: 'Behance / Dribbble', url: 'https://www.behance.net/', handle: 'add-your-portfolio' },
  ] as SocialLink[],

  skills: [
    { name: 'UI / UX Design', level: 92 },
    { name: 'Motion & Video', level: 85 },
    { name: 'Branding', level: 80 },
    { name: 'HTML / CSS', level: 88 },
    { name: 'JavaScript / React', level: 72 },
  ] as Skill[],

  // Optional: drop a PDF at /public/resume.pdf and set this to '/resume.pdf'.
  resumeUrl: '',
}

export type Profile = typeof profile

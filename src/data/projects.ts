/**
 * Your projects / design work.
 *
 * Each project has a `media` array of images and/or videos.
 *  - Put your files in /public/media/ and reference them via asset('media/your-file.png')
 *  - `type: 'video'` items use a <video> tag; give them a `poster` image so the
 *    thumbnail loads instantly and the video only downloads when played.
 *
 * The placeholders below point at /media/placeholder.svg so the site looks
 * intentional before you've added real assets — just swap the `src` values.
 */

import { asset } from '../lib/asset'

export type MediaType = 'image' | 'video'

export interface MediaItem {
  type: MediaType
  src: string
  /** Poster image for videos (and optional low-res preview for images). */
  poster?: string
  alt: string
}

export interface Project {
  id: string
  title: string
  year: string
  role: string
  /** Short one-liner shown on the card. */
  summary: string
  /** Longer description shown in the detail view. */
  description: string
  tags: string[]
  media: MediaItem[]
  links?: { label: string; url: string }[]
}

const PLACEHOLDER = asset('media/placeholder.svg')

export const projects: Project[] = [
  {
    id: 'aurora-brand',
    title: 'Aurora — Brand System',
    year: '2025',
    role: 'Brand & Visual Design',
    summary: 'A full identity system for a fictional fintech startup.',
    description:
      'Logo, type scale, color system, and a set of marketing visuals. Replace this text with the real story: the problem, what you made, and the outcome.',
    tags: ['Branding', 'Identity', 'Figma'],
    media: [
      { type: 'image', src: PLACEHOLDER, alt: 'Aurora brand — cover' },
      { type: 'image', src: PLACEHOLDER, alt: 'Aurora brand — logo grid' },
      { type: 'image', src: PLACEHOLDER, alt: 'Aurora brand — application' },
    ],
    links: [{ label: 'Case study', url: '#' }],
  },
  {
    id: 'motion-reel',
    title: 'Motion Reel 2025',
    year: '2025',
    role: 'Motion Design',
    summary: 'A short showreel of animation and product motion work.',
    description:
      'Drop your showreel in /public/media as an .mp4 and set the video src below. Add a poster image so the thumbnail is instant.',
    tags: ['Motion', 'After Effects', 'Video'],
    media: [
      // Example of a video item — swap src for your real mp4 + poster:
      { type: 'video', src: '', poster: PLACEHOLDER, alt: 'Motion reel 2025' },
    ],
  },
  {
    id: 'app-redesign',
    title: 'Habit App — Redesign',
    year: '2024',
    role: 'Product / UI Design',
    summary: 'End-to-end redesign of a habit-tracking mobile app.',
    description:
      'Research, flows, wireframes and a polished hi-fi UI kit. Replace with your real screens and a few words on what changed and why.',
    tags: ['Product', 'Mobile', 'UI'],
    media: [
      { type: 'image', src: PLACEHOLDER, alt: 'Habit app — screens' },
      { type: 'image', src: PLACEHOLDER, alt: 'Habit app — components' },
    ],
    links: [{ label: 'Prototype', url: '#' }],
  },
  {
    id: 'portfolio-98',
    title: "Portfolio '98",
    year: '2026',
    role: 'Design & Front-end',
    summary: 'This site — a Windows 98 desktop built in React.',
    description:
      'The thing you are looking at right now. Built with React + Vite and a lot of nostalgia. The source is on GitHub.',
    tags: ['React', 'TypeScript', 'CSS'],
    media: [{ type: 'image', src: PLACEHOLDER, alt: "Portfolio '98 desktop" }],
    links: [{ label: 'Source', url: 'https://github.com/mouad-gl/win98-port' }],
  },
]

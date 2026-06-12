# Portfolio '98 🪟

A personal portfolio built as a tiny **Windows 98 desktop** in the browser —
draggable windows, a Start menu, a taskbar, and a fully playable Minesweeper.

Built with **React + Vite + TypeScript**, styled with [`98.css`](https://jdan.github.io/98.css/),
and animated with **Framer Motion**. App code is lazy-loaded per window so first
paint stays fast.

## 🚀 Run locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build
```

## ✏️ Make it yours

All of your content lives in plain data files — no need to touch components:

| What | File |
| --- | --- |
| Name, role, bio, skills, socials, email | `src/data/profile.ts` |
| Projects + their images/videos | `src/data/projects.ts` |
| Hobbies | `src/data/hobbies.ts` |

### Adding images & videos

1. Drop files into `public/media/` (e.g. `public/media/my-shot.png`).
2. Reference them in `src/data/projects.ts` as `/media/my-shot.png`.
3. For videos, use `type: 'video'` and give a `poster` image so the thumbnail
   is instant and the video only downloads when played:

```ts
{ type: 'video', src: '/media/reel.mp4', poster: '/media/reel-poster.jpg', alt: 'My reel' }
```

Anything still pointing at `/media/placeholder.svg` shows a tidy placeholder
tile, so the site never looks broken while you fill it in.

> Search the `src/` files for `TODO` to find the spots worth confirming
> (your full name, social links, etc.).

## 🌐 Deploy to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and deploys on every push.

**One-time setup:** in the repo, go to **Settings → Pages → Build and
deployment → Source** and choose **GitHub Actions**.

After that, each push runs the workflow and publishes to:

```
https://mouad-gl.github.io/win98-port/
```

The Vite `base` is set to `./` (relative), so it works both on a project
sub-path (GitHub Pages) and at a domain root (Vercel/Netlify) with no changes.

## 🧱 Project structure

```
src/
  apps/         # each window's content (About, Projects, Hobbies, Contact, Minesweeper)
  components/   # desktop shell: Window, Taskbar, StartMenu, BootScreen, MediaViewer…
  context/      # window manager (open/focus/minimize/z-order)
  data/         # ← your content lives here
  styles/       # global + minesweeper CSS
public/
  icons/        # desktop / taskbar icons (SVG)
  media/        # ← your project images & videos
```

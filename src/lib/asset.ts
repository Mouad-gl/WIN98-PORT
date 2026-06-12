/**
 * Resolve a path to a file in /public against Vite's configured base URL.
 *
 * The app is built with `base: './'` so it works served from a domain root
 * *or* a sub-path (GitHub Pages project sites live under /<repo>/). A
 * root-absolute string like '/icons/x.svg' would 404 on a sub-path, so every
 * runtime reference to a public asset goes through here. Pass the path
 * WITHOUT a leading slash, e.g. asset('icons/user.svg').
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}

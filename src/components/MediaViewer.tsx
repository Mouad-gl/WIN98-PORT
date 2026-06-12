import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { MediaItem } from '../data/projects'
import { asset } from '../lib/asset'

const FALLBACK = asset('media/placeholder.svg')

interface MediaViewerProps {
  title: string
  items: MediaItem[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}

/** A Win98 "Imaging" style lightbox for viewing images and videos full-size. */
export function MediaViewer({ title, items, index, onClose, onIndex }: MediaViewerProps) {
  const open = index !== null
  const count = items.length

  const go = useCallback(
    (delta: number) => {
      if (index === null) return
      onIndex((index + delta + count) % count)
    },
    [index, count, onIndex],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, go])

  const item = index !== null ? items[index] : null

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="viewer-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="window viewer-window"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            <div className="title-bar">
              <div className="title-bar-text">
                {title} — {item.alt}
              </div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={onClose} />
              </div>
            </div>

            <div className="window-body viewer-body">
              <div className="viewer-stage">
                {item.type === 'video' ? (
                  item.src ? (
                    <video
                      key={item.src}
                      src={item.src}
                      poster={item.poster}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <div className="viewer-missing">
                      <img src={FALLBACK} alt="" />
                      <p>No video yet — add an .mp4 in /public/media and set its src.</p>
                    </div>
                  )
                ) : (
                  <img
                    key={item.src}
                    src={item.src || FALLBACK}
                    alt={item.alt}
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = FALLBACK
                    }}
                  />
                )}
              </div>

              {count > 1 && (
                <div className="viewer-controls">
                  <button type="button" onClick={() => go(-1)}>
                    ◄ Prev
                  </button>
                  <span className="viewer-count">
                    {(index ?? 0) + 1} / {count}
                  </span>
                  <button type="button" onClick={() => go(1)}>
                    Next ►
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

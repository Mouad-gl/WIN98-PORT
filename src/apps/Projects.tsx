import { useState } from 'react'
import { projects, type MediaItem, type Project } from '../data/projects'
import { MediaViewer } from '../components/MediaViewer'

const FALLBACK = '/media/placeholder.svg'

function thumbSrc(item: MediaItem): string {
  const raw = item.type === 'video' ? item.poster : item.src
  return raw || FALLBACK
}

function Thumb({ item, onClick }: { item: MediaItem; onClick: () => void }) {
  return (
    <button type="button" className="project-thumb" onClick={onClick} title={item.alt}>
      <img
        src={thumbSrc(item)}
        alt={item.alt}
        loading="lazy"
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).src = FALLBACK
        }}
      />
      {item.type === 'video' && <span className="thumb-play" aria-hidden>▶</span>}
    </button>
  )
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button type="button" className="project-card" onClick={onOpen}>
      <div className="project-card-thumb">
        <img
          src={thumbSrc(project.media[0])}
          alt=""
          loading="lazy"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = FALLBACK
          }}
        />
      </div>
      <div className="project-card-meta">
        <strong>{project.title}</strong>
        <span>{project.summary}</span>
      </div>
    </button>
  )
}

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const project = openId ? projects.find((p) => p.id === openId) ?? null : null

  // ── Folder view ────────────────────────────────────────────────
  if (!project) {
    return (
      <div className="app projects-app">
        <div className="projects-toolbar">
          <span>📁 {projects.length} items</span>
          <span className="muted">double-click a folder to open</span>
        </div>
        <div className="projects-grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={() => setOpenId(p.id)} />
          ))}
        </div>
      </div>
    )
  }

  // ── Detail view ────────────────────────────────────────────────
  return (
    <div className="app project-detail">
      <div className="projects-toolbar">
        <button type="button" onClick={() => setOpenId(null)}>
          ← Back
        </button>
        <span className="muted">
          {project.year} · {project.role}
        </span>
      </div>

      <div className="project-detail-body">
        <h2>{project.title}</h2>
        <p className="project-tags">
          {project.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </p>
        <p>{project.description}</p>

        {project.links && project.links.length > 0 && (
          <p className="project-links">
            {project.links.map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer">
                🔗 {l.label}
              </a>
            ))}
          </p>
        )}

        <fieldset className="project-gallery">
          <legend>Gallery</legend>
          <div className="thumb-grid">
            {project.media.map((m, i) => (
              <Thumb key={i} item={m} onClick={() => setViewerIndex(i)} />
            ))}
          </div>
        </fieldset>
      </div>

      <MediaViewer
        title={project.title}
        items={project.media}
        index={viewerIndex}
        onClose={() => setViewerIndex(null)}
        onIndex={setViewerIndex}
      />
    </div>
  )
}

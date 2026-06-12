import { hobbies } from '../data/hobbies'

export default function Hobbies() {
  return (
    <div className="app hobbies-app">
      <p className="hobbies-intro">When I&rsquo;m away from the screen (or still at it)…</p>
      <div className="hobbies-grid">
        {hobbies.map((h) => (
          <div key={h.title} className="hobby-card">
            <span className="hobby-emoji" aria-hidden>
              {h.emoji}
            </span>
            <strong>{h.title}</strong>
            <span className="hobby-text">{h.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

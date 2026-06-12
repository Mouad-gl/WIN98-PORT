import { profile } from '../data/profile'
import { useWindows } from '../context/WindowManager'
import { asset } from '../lib/asset'

export default function About() {
  const { openApp } = useWindows()

  return (
    <div className="app about-app">
      <div className="about-header">
        <img className="about-avatar" src={asset('avatar.svg')} alt={profile.name} />
        <div className="about-headline">
          <h2>{profile.name}</h2>
          <p className="about-role">{profile.role}</p>
          {profile.location && <p className="about-meta">📍 {profile.location}</p>}
          {profile.availability && (
            <p className="about-badge">🟢 {profile.availability}</p>
          )}
        </div>
      </div>

      <p className="about-tagline">{profile.tagline}</p>

      {profile.bio.map((para, i) => (
        <p key={i} className="about-bio">
          {para}
        </p>
      ))}

      <fieldset className="about-skills">
        <legend>Skills</legend>
        {profile.skills.map((skill) => (
          <div key={skill.name} className="skill-row">
            <span className="skill-name">{skill.name}</span>
            <div className="skill-bar" role="progressbar" aria-valuenow={skill.level}>
              <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        ))}
      </fieldset>

      <div className="about-actions">
        <button type="button" onClick={() => openApp('projects')}>
          📁 See my work
        </button>
        <button type="button" onClick={() => openApp('contact')}>
          ✉ Get in touch
        </button>
      </div>
    </div>
  )
}

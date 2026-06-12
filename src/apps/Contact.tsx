import { useState, type FormEvent } from 'react'
import { profile } from '../data/profile'

export default function Contact() {
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard not available — the mailto link still works */
    }
  }

  const sendMail = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio message from ${name || 'someone'}`)
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${from ? ` (${from})` : ''}`,
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="app contact-app">
      <fieldset className="contact-direct">
        <legend>Get in touch</legend>
        <div className="contact-email-row">
          <span className="contact-email">{profile.email}</span>
          <button type="button" onClick={copyEmail}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <ul className="contact-socials">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
              <span className="muted"> — {s.handle}</span>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="contact-form-wrap">
        <legend>Send a message</legend>
        <form className="contact-form" onSubmit={sendMail}>
          <label>
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            <span>Your email</span>
            <input
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label>
            <span>Message</span>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <div className="contact-form-actions">
            <button type="submit">✉ Send</button>
          </div>
          <p className="contact-note muted">
            Opens your email app with the message ready to send.
          </p>
        </form>
      </fieldset>
    </div>
  )
}

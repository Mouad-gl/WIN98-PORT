interface ShutDownScreenProps {
  onRestart: () => void
}

export function ShutDownScreen({ onRestart }: ShutDownScreenProps) {
  return (
    <div className="shutdown-screen" role="dialog" aria-label="Shut down">
      <p className="shutdown-text">
        It&rsquo;s now safe to turn off
        <br />
        your computer.
      </p>
      <button type="button" className="shutdown-restart" onClick={onRestart}>
        ⟳ Turn back on
      </button>
    </div>
  )
}

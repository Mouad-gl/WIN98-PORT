import { useEffect, useState } from 'react'
import { WindowManagerProvider } from './context/WindowManager'
import { Desktop } from './components/Desktop'
import { BootScreen } from './components/BootScreen'
import { ShutDownScreen } from './components/ShutDownScreen'
import { profile } from './data/profile'

type Phase = 'boot' | 'desktop' | 'off'

export default function App() {
  const [phase, setPhase] = useState<Phase>('boot')

  useEffect(() => {
    document.title = `${profile.name} — Portfolio '98`
  }, [])

  return (
    <WindowManagerProvider>
      {phase !== 'off' && <Desktop onShutDown={() => setPhase('off')} />}
      {phase === 'boot' && <BootScreen onDone={() => setPhase('desktop')} />}
      {phase === 'off' && <ShutDownScreen onRestart={() => setPhase('boot')} />}
    </WindowManagerProvider>
  )
}

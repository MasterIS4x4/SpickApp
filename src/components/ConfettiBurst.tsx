import { useEffect, useState } from 'react'
import { Particles, initParticlesEngine } from '@tsparticles/react'
import { loadConfettiPreset } from '@tsparticles/preset-confetti'
import type { Engine } from '@tsparticles/engine'

export const ConfettiBurst = ({ trigger }: { trigger: boolean }) => {
  const [engineInitialized, setEngineInitialized] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadConfettiPreset(engine)
    }).then(() => setEngineInitialized(true))
  }, [])

  if (!trigger || !engineInitialized) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <Particles
        id="confetti"
        options={{
          preset: 'confetti',
          fullScreen: { enable: true },
          emitters: {
            position: { x: 50, y: 50 },
            rate: {
              quantity: 50,
              delay: 0,
            },
            life: {
              count: 1,
              duration: 0.1,
            },
          },
        }}
      />
    </div>
  )
}

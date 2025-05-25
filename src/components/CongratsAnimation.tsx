import React, { useEffect, useRef, useState } from 'react'
import { createAnimation } from '@ionic/react'
import { useInteractions } from '../hooks/useInteractions'

import finishAudio from '../assets/audio/finish.mp3'

interface CongratsProps {
  visible: boolean
  onClose?: () => void
  duration?: number
  message?: string
  subMessage?: string
  icon?: string
}

export const CongratsAnimation = (props: CongratsProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const { playAudio } = useInteractions()
  const [isClosing, setIsClosing] = useState(false)

  const playExitAnimation = async () => {
    if (!containerRef.current) return

    setIsClosing(true)

    const exitAnim = createAnimation()
      .addElement(containerRef.current)
      .fromTo('opacity', 1, 0)
      .fromTo('transform', 'translateY(0)', 'translateY(-20px)')
      .duration(300)

    await exitAnim.play()
    props.onClose?.()
    setIsClosing(false)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (props.visible && containerRef.current && !isClosing) {
      // Reset initial state
      containerRef.current.style.opacity = '0'
      containerRef.current.style.transform = 'translateY(20px)'

      // Main container animation
      const containerAnim = createAnimation()
        .addElement(containerRef.current)
        .fromTo('opacity', 0, 1)
        .fromTo('transform', 'translateY(20px)', 'translateY(0)')
        .duration(300)
        .fill('forwards')

      // Icon animation
      const iconAnim = createAnimation()
        .addElement(iconRef.current!)
        .keyframes([
          { offset: 0, transform: 'scale(0.5) rotate(-20deg)', opacity: 0 },
          { offset: 0.5, transform: 'scale(1.2) rotate(15deg)', opacity: 1 },
          { offset: 0.8, transform: 'scale(0.95) rotate(-5deg)', opacity: 1 },
          { offset: 1, transform: 'scale(1) rotate(0)', opacity: 1 },
        ])
        .duration(1000)
        .fill('forwards')

      // Text animation
      const textAnim = createAnimation()
        .addElement(containerRef.current.querySelector('.congrats-text')!)
        .fromTo('opacity', 0, 1)
        .fromTo('transform', 'translateY(10px)', 'translateY(0)')
        .delay(300)
        .duration(500)
        .fill('forwards')

      // Scroll to top, then play animations
      window.scrollTo({ top: 0, behavior: 'smooth' })

      const timeoutId = setTimeout(() => {
        playAudio(finishAudio)
        containerAnim.play()
        iconAnim.play()
        textAnim.play()
        const exitTimeout = setTimeout(() => {
          playExitAnimation()
        }, props.duration || 3000)
      }, 1000)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [props.visible, props.duration])

  if (!props.visible) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 'calc(50% - 100px)',
        left: '2.5%',
        transform: 'translateX(20px)',
        zIndex: 1000,
        width: '95%',
        margin: '.5rem auto',
        backgroundColor: '#4CAF50',
        color: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        opacity: 0,
        transition: 'opacity 300ms ease, transform 300ms ease',
      }}
      onClick={playExitAnimation}
    >
      <div
        ref={iconRef}
        style={{
          fontSize: '64px',
          marginBottom: '16px',
          transform: 'scale(0.5) rotate(-20deg)',
          opacity: 0,
          transition: 'transform 1000ms ease, opacity 1000ms ease',
        }}
      >
        {props.icon || '🎉'}
      </div>

      <div
        className="congrats-text"
        style={{
          opacity: 0,
          transform: 'translateY(10px)',
          transition: 'opacity 500ms ease 300ms, transform 500ms ease 300ms',
        }}
      >
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
        >
          {props.message || 'Quiz Complete!'}
        </div>

        {props.subMessage && (
          <div
            style={{
              fontSize: '1rem',
              opacity: 0.9,
            }}
          >
            {props.subMessage}
          </div>
        )}
      </div>
    </div>
  )
}

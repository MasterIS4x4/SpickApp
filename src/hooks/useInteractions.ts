import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'

// audio and vibration utilities
export const useInteractions = () => {
  const giveHapticFeedback = async (style: ImpactStyle) => {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style })
    } else if (navigator.vibrate) {
      navigator.vibrate(style === ImpactStyle.Heavy ? 100 : 50)
    }
  }

  const playAudio = async (audio: any, volume: number = 0.1, loop: boolean = false) => {
    try {
      const audioElement = new Audio(audio)
      audioElement.volume = volume
      audioElement.loop = loop
      await audioElement.play()
    } catch (error) {
      console.warn('Audio playback failed:', error)
    }
  }

  return {
    giveHapticFeedback,
    playAudio,
  }
}

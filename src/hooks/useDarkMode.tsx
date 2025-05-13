import { useState, useEffect } from 'react'
import { useAppSelector } from '../store'
import { preferencesSelector } from '../reducers/preferences'

export const useDarkMode = () => {
  const perferences = useAppSelector(preferencesSelector)
  const [isDarkMode, setIsDarkMode] = useState(perferences.darkMode)

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd)
  }

  const initializeDarkPalette = (isDark: boolean) => {
    setIsDarkMode(isDark)
    toggleDarkPalette(isDark)
  }

  const toggleChange = () => {
    toggleDarkPalette(!isDarkMode)
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    //initializeDarkPalette(prefersDark.matches)

    const setDarkPaletteFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      initializeDarkPalette(mediaQuery.matches)
    }

    prefersDark.addEventListener('change', setDarkPaletteFromMediaQuery)

    return () => {
      prefersDark.removeEventListener('change', setDarkPaletteFromMediaQuery)
    }
  }, [])

  return { isDarkMode, toggleDarkMode: toggleChange }
}

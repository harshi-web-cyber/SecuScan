import React, { useState, useEffect } from 'react'
import { useTheme } from './ThemeContext'

type Size = 'sm' | 'md'

interface ThemeToggleProps {
  size?: Size
}

export default function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const [announcement, setAnnouncement] = useState('')
  const [previousTheme, setPreviousTheme] = useState(theme)

  const sizeClass = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10'
  const iconSize = size === 'sm' ? 'text-lg' : 'text-xl'

  // Handle theme toggle with announcement
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Store current theme before toggle
    const currentTheme = theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    
    // Only announce if theme actually changes
    if (currentTheme !== newTheme) {
      setPreviousTheme(currentTheme)
      toggleTheme()
      setAnnouncement(`Switched to ${newTheme} theme`)
    } else {
      toggleTheme()
    }
  }

  // Clear announcement after screen reader reads it
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [announcement])

  return (
    <>
      {/* Aria-live region for screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      <button
        onClick={handleToggle}
        className={`
          ${sizeClass}
          flex items-center justify-center
          rounded-lg
          bg-slate-200 dark:bg-slate-700
          hover:bg-slate-300 dark:hover:bg-slate-600
          transition-colors duration-200
          flex-shrink-0
        `}
        aria-label={`Toggle to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        aria-pressed={theme === 'dark'}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <span className={`material-symbols-outlined ${iconSize}`}>
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </>
  )
}

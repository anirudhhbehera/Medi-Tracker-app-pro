import { useEffect } from 'react'

const ThemeWrapper = ({ children, darkMode }) => {
  useEffect(() => {
    // Apply theme classes to all glass-effect elements
    const elements = document.querySelectorAll('.glass-effect')
    elements.forEach(el => {
      el.classList.remove('glass-effect')
      el.classList.add('card-bg')
    })

    // Apply text color classes
    const textElements = document.querySelectorAll('.text-white')
    textElements.forEach(el => {
      if (!el.classList.contains('btn-primary')) {
        el.classList.remove('text-white')
        el.classList.add('text-primary')
      }
    })

    const textSecondaryElements = document.querySelectorAll('.text-white\\/70, .text-white\\/60, .text-white\\/50')
    textSecondaryElements.forEach(el => {
      el.className = el.className.replace(/text-white\/\d+/, 'text-secondary')
    })
  }, [darkMode])

  return children
}

export default ThemeWrapper
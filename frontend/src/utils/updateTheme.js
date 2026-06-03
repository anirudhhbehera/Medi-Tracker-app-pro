// Utility to update all remaining glass-effect and text classes
export const updateAllThemeClasses = () => {
  // Update glass-effect to card-bg
  const glassElements = document.querySelectorAll('.glass-effect')
  glassElements.forEach(el => {
    el.classList.remove('glass-effect')
    el.classList.add('card-bg')
  })

  // Update text colors
  const whiteTextElements = document.querySelectorAll('.text-white:not(.btn-primary *)')
  whiteTextElements.forEach(el => {
    if (!el.closest('.btn-primary')) {
      el.classList.remove('text-white')
      el.classList.add('text-primary')
    }
  })

  // Update secondary text colors
  const secondaryTextSelectors = [
    '.text-white\\/70',
    '.text-white\\/60', 
    '.text-white\\/50',
    '.text-white\\/80'
  ]
  
  secondaryTextSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(el => {
      el.className = el.className.replace(/text-white\/\d+/, 'text-secondary')
    })
  })

  // Update input backgrounds
  const inputElements = document.querySelectorAll('input, select, textarea')
  inputElements.forEach(el => {
    if (el.className.includes('bg-white/10')) {
      el.className = el.className.replace('bg-white/10', 'bg-input')
      el.className = el.className.replace('border-white/20', 'border-primary')
      el.className = el.className.replace('text-white', 'text-primary')
      el.className = el.className.replace('placeholder-white/50', '')
    }
  })
}

// Run on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', updateAllThemeClasses)
  // Also run after a short delay to catch dynamically rendered content
  setTimeout(updateAllThemeClasses, 1000)
}
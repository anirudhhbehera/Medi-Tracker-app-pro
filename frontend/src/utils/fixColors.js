// Fix remaining color classes for light theme
export const fixLightThemeColors = () => {
  // Fix text-white classes
  const whiteTextElements = document.querySelectorAll('.text-white:not(.btn-primary):not(.btn-primary *)')
  whiteTextElements.forEach(el => {
    el.classList.remove('text-white')
    el.classList.add('text-gray-800', 'dark:text-white')
  })

  // Fix text-white/70 classes
  const secondaryTextElements = document.querySelectorAll('.text-white\\/70')
  secondaryTextElements.forEach(el => {
    el.className = el.className.replace('text-white/70', 'text-gray-600 dark:text-gray-400')
  })

  // Fix text-white/60 classes
  const tertiaryTextElements = document.querySelectorAll('.text-white\\/60')
  tertiaryTextElements.forEach(el => {
    el.className = el.className.replace('text-white/60', 'text-gray-600 dark:text-gray-400')
  })

  // Fix text-white/50 classes
  const placeholderTextElements = document.querySelectorAll('.text-white\\/50')
  placeholderTextElements.forEach(el => {
    el.className = el.className.replace('text-white/50', 'text-gray-500 dark:text-gray-400')
  })

  // Fix bg-white/10 classes
  const bgElements = document.querySelectorAll('.bg-white\\/10')
  bgElements.forEach(el => {
    el.className = el.className.replace('bg-white/10', 'bg-input')
  })

  // Fix border-white/20 classes
  const borderElements = document.querySelectorAll('.border-white\\/20')
  borderElements.forEach(el => {
    el.className = el.className.replace('border-white/20', 'border-gray-200 dark:border-gray-700')
  })

  // Fix border-white/10 classes
  const borderElements2 = document.querySelectorAll('.border-white\\/10')
  borderElements2.forEach(el => {
    el.className = el.className.replace('border-white/10', 'border-gray-200 dark:border-gray-700')
  })

  // Fix placeholder-white/50 classes
  const placeholderElements = document.querySelectorAll('.placeholder-white\\/50')
  placeholderElements.forEach(el => {
    el.className = el.className.replace('placeholder-white/50', '')
  })

  // Fix hover:bg-white/10 classes
  const hoverBgElements = document.querySelectorAll('.hover\\:bg-white\\/10')
  hoverBgElements.forEach(el => {
    el.className = el.className.replace('hover:bg-white/10', 'hover:bg-gray-100 dark:hover:bg-gray-800')
  })

  // Fix hover:bg-white/20 classes
  const hoverBgElements2 = document.querySelectorAll('.hover\\:bg-white\\/20')
  hoverBgElements2.forEach(el => {
    el.className = el.className.replace('hover:bg-white/20', 'hover:bg-gray-200 dark:hover:bg-gray-700')
  })
}

// Run on DOM changes
if (typeof window !== 'undefined') {
  const observer = new MutationObserver(() => {
    setTimeout(fixLightThemeColors, 100)
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  
  // Initial run
  setTimeout(fixLightThemeColors, 500)
}
import { useEffect, useState } from 'react'

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  const toggleDark = () => setIsDark((prev) => !prev)

  return { isDark, toggleDark }
}

export default useDarkMode

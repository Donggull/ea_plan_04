import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 브라우저 저장소에서 테마 확인
    const saved = localStorage.getItem('eluo-theme') as Theme
    if (saved && (saved === 'dark' || saved === 'light')) {
      return saved
    }

    // 시스템 기본 테마 확인
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    return 'dark' // Linear 테마는 기본적으로 다크모드
  })

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('eluo-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    // 초기 테마 설정
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('eluo-theme', theme)
  }, [theme])

  useEffect(() => {
    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // 사용자가 수동으로 설정하지 않은 경우에만 시스템 테마 따라감
      const savedTheme = localStorage.getItem('eluo-theme')
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
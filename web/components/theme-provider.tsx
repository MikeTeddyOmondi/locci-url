"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "data-theme",
  enableSystem = false,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<Theme>("light")

  useEffect(() => {
    const root = window.document.documentElement

    // Remove the transition temporarily when changing themes
    if (disableTransitionOnChange) {
      root.classList.add("transition-none")
      window.setTimeout(() => {
        root.classList.remove("transition-none")
      }, 0)
    }

    // Remove previous theme attribute
    root.removeAttribute(attribute)

    // Set the theme attribute based on the current theme
    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
      setResolvedTheme(systemTheme)
    } else {
      root.classList.remove("light", "dark")
      root.classList.add(theme)
      setResolvedTheme(theme)
    }
  }, [theme, attribute, disableTransitionOnChange, enableSystem])

  // Initialize theme from localStorage or default
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null

    if (storedTheme) {
      setTheme(storedTheme)
    } else if (enableSystem) {
      setTheme("system")
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        const newResolvedTheme = mediaQuery.matches ? "dark" : "light"
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(newResolvedTheme)
        setResolvedTheme(newResolvedTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [storageKey, enableSystem, theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

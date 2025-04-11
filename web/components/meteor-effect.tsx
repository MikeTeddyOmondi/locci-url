"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

interface Meteor {
  id: number
  size: number
  speed: number
  opacity: number
  top: number
  left: number
  delay: number
}

export function MeteorEffect() {
  const [meteors, setMeteors] = useState<Meteor[]>([])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    // Generate random meteors
    const generateMeteors = () => {
      const newMeteors: Meteor[] = []
      const count = Math.floor(Math.random() * 5) + 3 // 3-7 meteors at a time

      for (let i = 0; i < count; i++) {
        newMeteors.push({
          id: Date.now() + i,
          size: Math.floor(Math.random() * 200) + 50, // 50-250px
          speed: Math.floor(Math.random() * 10) + 5, // 5-15s
          opacity: Math.random() * 0.7 + 0.3, // 0.3-1.0
          top: Math.floor(Math.random() * 40), // 0-40% from top
          left: Math.floor(Math.random() * 70) + 15, // 15-85% from left
          delay: Math.random() * 5, // 0-5s delay
        })
      }

      setMeteors(newMeteors)
    }

    // Initial generation
    generateMeteors()

    // Regenerate meteors periodically
    const interval = setInterval(() => {
      generateMeteors()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className={cn(
            "absolute rounded-full transform -rotate-45 animate-meteor",
            isDark
              ? "bg-gradient-to-b from-primary/40 to-transparent"
              : "bg-gradient-to-b from-primary/50 to-transparent",
          )}
          style={{
            width: `${meteor.size}px`,
            height: `${meteor.size / 10}px`,
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            opacity: meteor.opacity,
            animationDuration: `${meteor.speed}s`,
            animationDelay: `${meteor.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

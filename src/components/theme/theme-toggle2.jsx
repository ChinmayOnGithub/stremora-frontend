// src/components/theme/ThemeToggle.tsx
"use client"

import { useEffect, useState } from "react"
import useTheme from "@/hooks/useTheme"
import { Sun, Moon } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../ui/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      mounted &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const nextTheme = isDark ? "light" : "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(nextTheme)}
      aria-label="Toggle theme"
      className={cn(
        // ensure visible border/text in light mode and adjust in dark
        "relative text-zinc-700 border-zinc-300 hover:bg-zinc-100",
        "dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800"
      )}
    >
      <Sun
        className={cn(
          "absolute w-5 h-5 transition-transform transition-opacity duration-300",
          isDark ? "opacity-100 rotate-0 text-yellow-400" : "opacity-0 -rotate-90"
        )}
      />
      <Moon
        className={cn(
          "absolute w-5 h-5 transition-transform transition-opacity duration-300",
          isDark ? "opacity-0 rotate-90" : "opacity-100 rotate-0 text-blue-500"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

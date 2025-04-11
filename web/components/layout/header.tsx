"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LinkIcon, LogIn, UserPlus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { isAuthenticated, logout } from "@/lib/auth"

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
  }, [pathname])

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg hidden sm:inline-block">URL Shortener</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </Link>
            </>
          )}

          <ModeToggle />
        </nav>

        {/* Mobile navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            <span className="sr-only">Toggle menu</span>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <Link
              href="/"
              className={`block py-2 text-sm font-medium ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block py-2 text-sm font-medium ${
                    pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="block py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

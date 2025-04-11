import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} URL Shortener. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            Terms
          </Link>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 fill-current text-red-500" />
          </div>
        </div>
      </div>
    </footer>
  )
}

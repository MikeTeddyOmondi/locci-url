import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MeteorEffect } from "@/components/meteor-effect"

export const metadata: Metadata = {
  title: "URL Shortener - Home",
  description: "Shorten your URLs with our simple and elegant URL shortener",
}

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center overflow-hidden">
      {/* Meteor animation in the background */}
      <MeteorEffect />

      {/* Content */}
      <div className="container px-4 py-10 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary animate-fade-in">
              Transform Long Links
              <span className="block mt-2">Into Short Magic</span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-delayed">
              Simplify your online experience with our elegant URL shortener service. Share links that are clean,
              concise, and captivating.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-up">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="/register">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          {/* Decorative elements */}
          <div className="relative mt-16 hidden md:block animate-float">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 left-1/4 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute top-8 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

            <div className="relative bg-card border rounded-xl shadow-lg p-6 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-2 h-6 w-full bg-muted rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
              <div className="mt-6 p-3 bg-primary/10 rounded-md flex items-center justify-between">
                <div className="h-4 bg-primary/30 rounded w-1/3" />
                <ArrowRight className="h-4 w-4 text-primary" />
                <div className="h-4 bg-primary/30 rounded w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

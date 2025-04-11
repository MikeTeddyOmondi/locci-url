import type { Metadata } from "next"
import { UrlShortenerForm } from "@/components/url-shortener-form"
import { UrlHistory } from "@/components/url-history"

export const metadata: Metadata = {
  title: "Dashboard - URL Shortener",
  description: "Manage your shortened URLs",
}

export default function DashboardPage() {
  return (
    <div className="container px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p className="text-muted-foreground">Manage your shortened URLs and create new ones</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Create New Short URL</h2>
            <UrlShortenerForm />
          </div>

          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your URL History</h2>
            <UrlHistory />
          </div>
        </div>
      </div>
    </div>
  )
}

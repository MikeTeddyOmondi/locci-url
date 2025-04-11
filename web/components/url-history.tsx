"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserUrls, deleteUrl } from "@/lib/api"

type UrlItem = {
  id: string
  originalUrl: string
  shortUrl: string
  createdAt: string
}

export function UrlHistory() {
  const [urls, setUrls] = useState<UrlItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUrls() {
      try {
        const data = await getUserUrls()
        setUrls(data)
      } catch (error) {
        console.error("Error fetching URLs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUrls()
  }, [])

  async function handleDelete(id: string) {
    try {
      await deleteUrl(id)
      setUrls(urls.filter((url) => url.id !== id))
    } catch (error) {
      console.error("Error deleting URL:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 border rounded-md">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (urls.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">You haven&apos;t created any short URLs yet.</div>
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
      {urls.map((url) => (
        <div key={url.id} className="p-3 border rounded-md bg-background">
          <div className="flex justify-between items-start gap-2">
            <div className="overflow-hidden">
              <p className="font-medium truncate" title={url.originalUrl}>
                {url.originalUrl}
              </p>
              <a
                href={url.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {url.shortUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                Created: {new Date(url.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(url.id)} aria-label="Delete URL">
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

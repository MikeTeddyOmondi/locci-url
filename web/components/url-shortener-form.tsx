"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { shortenUrl } from "@/lib/api"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
})

type FormValues = z.infer<typeof formSchema>

export function UrlShortenerForm() {
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      const result = await shortenUrl(data.url)
      setShortUrl(result.shortUrl)
    } catch (error) {
      console.error("Error shortening URL:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter your URL here" {...field} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </Button>
        </form>
      </Form>

      {shortUrl && (
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm font-medium mb-2">Your shortened URL:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  )
}

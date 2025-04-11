// Mock API functions for URL shortening
// In a real application, these would connect to your backend

type ShortenUrlResponse = {
  shortUrl: string
  originalUrl: string
  id: string
}

type UrlHistoryItem = {
  id: string
  originalUrl: string
  shortUrl: string
  createdAt: string
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate a random short code
const generateShortCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Mock storage for URLs
let mockUrlStorage: UrlHistoryItem[] = [
  {
    id: "1",
    originalUrl: "https://example.com/very/long/url/that/needs/shortening",
    shortUrl: "https://short.url/abc123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    originalUrl: "https://another-example.com/with/a/long/path",
    shortUrl: "https://short.url/def456",
    createdAt: new Date().toISOString(),
  },
]

// Shorten a URL
export async function shortenUrl(url: string): Promise<ShortenUrlResponse> {
  await delay(1000) // Simulate API delay

  const shortCode = generateShortCode()
  const shortUrl = `https://short.url/${shortCode}`

  const newUrl = {
    id: Date.now().toString(),
    originalUrl: url,
    shortUrl,
    createdAt: new Date().toISOString(),
  }

  // Add to mock storage if user is authenticated
  if (typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true") {
    mockUrlStorage.push(newUrl)
  }

  return {
    id: newUrl.id,
    shortUrl: newUrl.shortUrl,
    originalUrl: newUrl.originalUrl,
  }
}

// Get user's URL history
export async function getUserUrls(): Promise<UrlHistoryItem[]> {
  await delay(800) // Simulate API delay
  return [...mockUrlStorage].reverse() // Return newest first
}

// Delete a URL
export async function deleteUrl(id: string): Promise<void> {
  await delay(500) // Simulate API delay
  mockUrlStorage = mockUrlStorage.filter((url) => url.id !== id)
}

// Mock authentication functions
// In a real application, these would connect to your backend

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Login function
export async function login(email: string, password: string): Promise<void> {
  await delay(1000) // Simulate API delay

  // In a real app, this would validate credentials with your backend
  // For demo purposes, we'll accept any email/password
  if (typeof window !== "undefined") {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
  }
}

// Register function
export async function register(name: string, email: string, password: string): Promise<void> {
  await delay(1500) // Simulate API delay

  // In a real app, this would create a user in your backend
  // For demo purposes, we'll just set the auth state
  if (typeof window !== "undefined") {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userName", name)
    localStorage.setItem("userEmail", email)
  }
}

// Logout function
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isAuthenticated") === "true"
  }
  return false
}

// Get current user info
export function getCurrentUser() {
  if (typeof window !== "undefined" && isAuthenticated()) {
    return {
      name: localStorage.getItem("userName"),
      email: localStorage.getItem("userEmail"),
    }
  }
  return null
}

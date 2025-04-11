import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login - URL Shortener",
  description: "Login to your URL shortener account",
}

export default function LoginPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <LoginForm />
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

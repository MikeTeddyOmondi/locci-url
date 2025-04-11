import type { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register - URL Shortener",
  description: "Create a new account for URL Shortener",
}

export default function RegisterPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Register</h1>
          <p className="text-muted-foreground">Create a new account to manage your shortened URLs</p>
        </div>

        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <RegisterForm />
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

// app/not-found.tsx
"use client"
import Link from "next/link"
import { TriangleAlert, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button" 

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-gradient-to-br from-red-50 via-white to-red-100">
      <div
        className="w-full max-w-2xl rounded-2xl border border-red-200/70 bg-white/80 backdrop-blur-md shadow-2xl text-center p-8 sm:p-10 animate-[fadeIn_.5s_ease-out]"
        role="alert"
        aria-live="assertive"
      >
        {/* Red glow + icon */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-red-300/40 blur-2xl animate-pulse" />
          <TriangleAlert className="h-14 w-14 text-red-600 drop-shadow" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-red-700">
          404 — Page Not Found
        </h1>

        {/* Subtext */}
        <p className="mt-3 text-base sm:text-lg text-gray-600">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Danger badge style line */}
        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-red-100 text-red-800 px-4 py-1.5 text-sm font-medium border border-red-200">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Critical: invalid route requested
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Back button */}
          <Button
            variant="outline"
            className="w-full sm:w-auto border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
            asChild
          >
            <Link href="#" onClick={(e) => { e.preventDefault(); history.back(); }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>

          {/* Home button (primary danger style) */}
          <Button
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white shadow-lg"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>

          {/* Optional: Report issue */}
          <Button
            variant="ghost"
            className="w-full sm:w-auto text-red-700 hover:bg-red-50"
            asChild
          >
            <Link href="/contact">Report an Issue</Link>
          </Button>
        </div>

        {/* Helper text */}
        <p className="mt-4 text-xs sm:text-sm text-gray-500">
          Tip: Check the URL for typos or navigate using the menu.
        </p>
      </div>
    </div>
  )
}
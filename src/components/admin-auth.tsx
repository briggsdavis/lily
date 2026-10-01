"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth, useQuery } from "convex/react"
import { useCallback, useState } from "react"
import type { FormEvent } from "react"
import { api } from "../../convex/_generated/api"

type AuthMode = "signIn" | "signUp"

function authErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : ""

  if (message.includes("ADMIN_ACCESS_DENIED")) {
    return "This email is not authorized to access the admin area."
  }
  if (message.includes("Invalid credentials")) {
    return "The email or password is incorrect."
  }
  if (message.includes("already exists")) {
    return "An account already exists for this email. Sign in instead."
  }
  if (message.includes("Invalid password")) {
    return "Use a password with at least 8 characters."
  }

  return "Something went wrong. Please try again."
}

function AdminPanel() {
  const viewer = useQuery(api.admin.viewer)
  const { signOut } = useAuthActions()
  const handleSignOut = useCallback(() => void signOut(), [signOut])

  if (viewer === undefined) {
    return <p className="text-sm">Checking your access…</p>
  }

  if (viewer === null) {
    return (
      <div className="max-w-md space-y-6">
        <p>Your account no longer has access to this admin area.</p>
        <button
          className="rounded-full border-[0.75px] border-current px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-burgundy hover:text-cream"
          onClick={handleSignOut}
          type="button"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.12em] uppercase opacity-65">Signed in as</p>
        <p className="mt-2 text-lg">{viewer.email}</p>
      </div>
      <p className="max-w-lg text-lg leading-relaxed">
        The admin area is ready. There is nothing to manage here yet.
      </p>
      <button
        className="rounded-full border-[0.75px] border-current px-6 py-3 text-sm font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-burgundy hover:text-cream"
        onClick={handleSignOut}
        type="button"
      >
        Sign out
      </button>
    </div>
  )
}

function AdminAuthForm() {
  const [mode, setMode] = useState<AuthMode>("signIn")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { signIn } = useAuthActions()

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setError(null)

      const formData = new FormData(event.currentTarget)
      if (mode === "signUp" && formData.get("password") !== formData.get("confirmPassword")) {
        setError("The passwords do not match.")
        return
      }

      formData.set("flow", mode)
      formData.delete("confirmPassword")
      setSubmitting(true)

      try {
        await signIn("password", formData)
      } catch (authError) {
        setError(authErrorMessage(authError))
      } finally {
        setSubmitting(false)
      }
    },
    [mode, signIn],
  )

  const showSignIn = useCallback(() => {
    setMode("signIn")
    setError(null)
  }, [])

  const showSignUp = useCallback(() => {
    setMode("signUp")
    setError(null)
  }, [])

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex gap-2 rounded-full border-[0.75px] border-current/30 p-1">
        <button
          aria-pressed={mode === "signIn"}
          className="flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors aria-pressed:bg-burgundy aria-pressed:text-cream"
          onClick={showSignIn}
          type="button"
        >
          Sign in
        </button>
        <button
          aria-pressed={mode === "signUp"}
          className="flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors aria-pressed:bg-burgundy aria-pressed:text-cream"
          onClick={showSignUp}
          type="button"
        >
          Create account
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold tracking-[0.12em] uppercase">Email</span>
          <input
            autoComplete="email"
            className="w-full rounded-full border-[0.75px] border-current bg-transparent px-5 py-3 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            name="email"
            required
            type="email"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold tracking-[0.12em] uppercase">Password</span>
          <input
            autoComplete={mode === "signIn" ? "current-password" : "new-password"}
            className="w-full rounded-full border-[0.75px] border-current bg-transparent px-5 py-3 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </label>

        {mode === "signUp" ? (
          <label className="block">
            <span className="mb-2 block text-xs font-semibold tracking-[0.12em] uppercase">
              Confirm password
            </span>
            <input
              autoComplete="new-password"
              className="w-full rounded-full border-[0.75px] border-current bg-transparent px-5 py-3 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              minLength={8}
              name="confirmPassword"
              required
              type="password"
            />
          </label>
        ) : null}

        <output aria-live="polite" className="block min-h-6 text-sm text-burgundy">
          {error}
        </output>

        <button
          className="w-full rounded-full border-[0.75px] border-current bg-burgundy px-6 py-3 font-semibold text-cream transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Please wait…" : mode === "signIn" ? "Sign in" : "Set password"}
        </button>
      </form>
    </div>
  )
}

export function AdminAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth()

  if (isLoading) {
    return <p className="text-sm">Loading…</p>
  }

  return isAuthenticated ? <AdminPanel /> : <AdminAuthForm />
}

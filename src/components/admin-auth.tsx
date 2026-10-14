"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useConvex, useConvexAuth, useQuery } from "convex/react"
import type { ReactNode, SubmitEvent } from "react"
import { useCallback, useState } from "react"
import { api } from "#/_generated/api"

type AuthMode = "signIn" | "signUp"

function authErrorMessage(error: unknown, mode: AuthMode) {
  const message = error instanceof Error ? error.message : ""

  if (message.includes("ADMIN_ACCESS_DENIED")) {
    return "This email is not authorized to access the admin area."
  }

  if (message.includes("Invalid credentials")) {
    return "The email or password is incorrect."
  }

  if (message.includes("already exists")) {
    return "An account already exists for this email. Log in instead."
  }

  if (message.includes("Invalid password")) {
    return "Use a password with at least 8 characters."
  }

  return mode === "signIn"
    ? "The email or password is incorrect."
    : "We could not create the account. Please try again."
}

function AdminPanel({ children }: { children?: ReactNode }) {
  const viewer = useQuery(api.admin.viewer)
  const { signOut } = useAuthActions()
  const handleSignOut = useCallback(() => void signOut(), [signOut])

  if (viewer === undefined) {
    return <p className="text-sm">Checking your access...</p>
  }

  if (viewer === null) {
    return (
      <div className="max-w-md space-y-6">
        <p>Your account no longer has access to this admin area.</p>
        <button
          className="rounded-full border-[0.75px] border-current px-6 py-3 text-sm font-semibold uppercase hover:bg-burgundy hover:text-cream"
          onClick={handleSignOut}
          type="button"
        >
          Log out
        </button>
      </div>
    )
  }

  if (children) return children

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase opacity-65">Signed in as</p>
        <p className="mt-2 text-lg">{viewer.email}</p>
      </div>
      <p className="max-w-lg text-lg">
        The admin area is ready. There is nothing to manage here yet.
      </p>
      <button
        className="rounded-full border-[0.75px] border-current px-6 py-3 text-sm font-semibold uppercase hover:bg-burgundy hover:text-cream"
        onClick={handleSignOut}
        type="button"
      >
        Log out
      </button>
    </div>
  )
}

function AdminAuthForm() {
  const [mode, setMode] = useState<AuthMode>("signIn")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { signIn } = useAuthActions()
  const convex = useConvex()

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      setError(null)

      const formData = new FormData(event.currentTarget)
      const email = String(formData.get("email") ?? "")
        .trim()
        .toLowerCase()
      if (mode === "signUp" && formData.get("password") !== formData.get("confirmPassword")) {
        setError("The passwords do not match.")
        return
      }

      formData.set("flow", mode)
      formData.delete("confirmPassword")
      setSubmitting(true)

      try {
        const status = await convex.query(api.admin.signupStatus, { email })
        if (status === "denied") {
          setError("This email is not authorized to access the admin area.")
          return
        }
        if (mode === "signUp" && status === "existing") {
          setError("An account already exists for this email. Log in instead.")
          return
        }
        if (mode === "signIn" && status === "available") {
          setError("No account exists for this email yet. Sign up to set your password.")
          return
        }

        formData.set("email", email)
        await signIn("password", formData)
      } catch (authError) {
        setError(authErrorMessage(authError, mode))
      } finally {
        setSubmitting(false)
      }
    },
    [convex, mode, signIn],
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
    <section className="relative grid min-h-dvh place-items-center overflow-hidden bg-cream px-5 py-14 text-deep-brown sm:px-8">
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-24 size-80 rounded-full bg-mauve/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 -bottom-40 size-96 rounded-full bg-wine/10 blur-3xl"
      />
      <div className="relative w-full max-w-lg border border-deep-brown/25 bg-cream p-2 shadow-[0_28px_90px_rgba(53,22,26,0.16)]">
        <div className="border border-deep-brown/15 px-6 py-8 sm:px-10 sm:py-10">
          <header className="mb-8 border-b border-deep-brown/15 pb-7 text-center">
            <p className="font-display text-4xl text-wine">Lily</p>
            <p className="mt-1 text-[0.65rem] font-bold tracking-[0.18em] text-deep-brown/55 uppercase">
              Administration
            </p>
            <h1 className="mt-7 font-display text-3xl sm:text-4xl">
              {mode === "signIn" ? "Welcome back" : "Create your access"}
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-deep-brown/65">
              {mode === "signIn"
                ? "Log in to manage Lily's menus, events, and inquiries."
                : "Approved administrators can choose their password and create an account."}
            </p>
          </header>
          <div className="mb-8 flex gap-2 rounded-full border-[0.75px] border-current/30 p-1">
            <button
              aria-pressed={mode === "signIn"}
              className="flex-1 rounded-full px-4 py-2 text-sm font-semibold aria-pressed:bg-burgundy aria-pressed:text-cream"
              onClick={showSignIn}
              type="button"
            >
              Log in
            </button>
            <button
              aria-pressed={mode === "signUp"}
              className="flex-1 rounded-full px-4 py-2 text-sm font-semibold aria-pressed:bg-burgundy aria-pressed:text-cream"
              onClick={showSignUp}
              type="button"
            >
              Sign up
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase">Email</span>
              <input
                autoComplete="email"
                className="w-full rounded-full border-[0.75px] border-current bg-transparent px-5 py-3 outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                name="email"
                required
                type="email"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase">Password</span>
              <input
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                className="w-full rounded-full border-[0.75px] border-current bg-transparent px-5 py-3 outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </label>

            {mode === "signUp" ? (
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase">Confirm password</span>
                <input
                  autoComplete="new-password"
                  className="w-full rounded-full border-[0.75px] border-current bg-transparent px-5 py-3 outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  minLength={8}
                  name="confirmPassword"
                  required
                  type="password"
                />
              </label>
            ) : null}

            <output
              aria-live="polite"
              className="block min-h-6 border-l-2 border-transparent pl-3 text-sm text-burgundy not-empty:border-wine empty:border-transparent"
            >
              {error}
            </output>

            <button
              className="w-full rounded-full border-[0.75px] border-current bg-burgundy px-6 py-3 font-semibold text-cream hover:bg-dark-maroon disabled:cursor-wait disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Please wait..." : mode === "signIn" ? "Log in" : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export function AdminAuth({ children }: { children?: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()

  if (isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-cream text-sm text-deep-brown">
        Loading the admin area…
      </div>
    )
  }

  return isAuthenticated ? <AdminPanel>{children}</AdminPanel> : <AdminAuthForm />
}

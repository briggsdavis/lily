"use client"
import { useMutation, useQuery } from "convex/react"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { MarketingPopupCard } from "@/components/marketing-popup-card"
import { PillButton } from "@/components/pill-button"
import { api } from "../../convex/_generated/api"

type PublishedMarketing = import("convex/server").FunctionReturnType<typeof api.marketing.published>
type CaptureEmail = (
  args: import("convex/server").FunctionArgs<typeof api.marketing.capture>,
) => Promise<null>

const sessionKey = "lily:marketing-popup-seen"
let seenInMemory = false
function readStorage(storage: Storage, key: string) {
  try {
    return storage.getItem(key) === "1"
  } catch {
    return false
  }
}
export function PublicMarketing() {
  const data = useQuery(api.marketing.published)
  const captureEmail = useMutation(api.marketing.capture)
  return <MarketingExperience data={data} captureEmail={captureEmail} />
}

export function MarketingExperience({
  data,
  captureEmail,
}: {
  data: PublishedMarketing | undefined
  captureEmail: CaptureEmail
}) {
  const bar = useRef<HTMLAnchorElement>(null)
  const startedAt = useRef<number | null>(null)
  const [offeredId, setOfferedId] = useState<string | null>(null)
  const popup = data?.popup
  const popupId = popup?._id
  useEffect(() => {
    if (startedAt.current === null) startedAt.current = Date.now()
  }, [])
  useEffect(() => {
    const element = bar.current
    if (!element) {
      document.documentElement.style.removeProperty("--announcement-height")
      return
    }
    const measure = () =>
      document.documentElement.style.setProperty(
        "--announcement-height",
        `${element.getBoundingClientRect().height}px`,
      )
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty("--announcement-height")
    }
  }, [data?.announcement])
  useEffect(() => {
    if (!popupId || seenInMemory) return
    let seen = false,
      captured = false
    try {
      seen = readStorage(sessionStorage, sessionKey)
      captured = readStorage(localStorage, `lily:popup-captured:${popupId}`)
    } catch {
      /* Storage may be unavailable. */
    }
    if (seen || captured) return
    const timer = setTimeout(
      () => {
        seenInMemory = true
        try {
          sessionStorage.setItem(sessionKey, "1")
        } catch {
          /* Keep the in-memory session fallback. */
        }
        setOfferedId(popupId)
      },
      Math.max(0, 4000 - (Date.now() - (startedAt.current ?? Date.now()))),
    )
    return () => clearTimeout(timer)
  }, [popupId])
  return (
    <>
      {data?.announcement && (
        <>
          <div aria-hidden="true" style={{ height: "var(--announcement-height, 0px)" }} />
          <a
            ref={bar}
            href={data.announcement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed inset-x-0 top-0 z-70 block px-5 py-3 text-center text-xs leading-5 font-semibold break-words md:text-sm"
            style={{
              color: data.announcement.textColor,
              backgroundColor: data.announcement.backgroundColor,
            }}
          >
            {data.announcement.text}
            <span aria-hidden="true" className="ml-2">
              ↗
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </>
      )}
      {offeredId === popupId && popup && (
        <PopupDialog
          key={popup._id}
          popup={popup}
          captureEmail={captureEmail}
          onDismiss={() => setOfferedId(null)}
        />
      )}
    </>
  )
}
type PublishedPopup = NonNullable<
  import("convex/server").FunctionReturnType<typeof api.marketing.published>["popup"]
>
function PopupDialog({
  popup,
  onDismiss,
  captureEmail,
}: {
  popup: PublishedPopup
  onDismiss: () => void
  captureEmail: CaptureEmail
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [visible, setVisible] = useState(false),
    [email, setEmail] = useState(""),
    [busy, setBusy] = useState(false),
    [success, setSuccess] = useState(false),
    [error, setError] = useState("")
  const closing = useRef(false),
    dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    setVisible(false)
    dismissTimer.current = setTimeout(
      onDismiss,
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 250,
    )
  }, [onDismiss])
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    element.showModal()
    element.querySelector<HTMLButtonElement>('[aria-label="Close pop-up"]')?.focus()
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setVisible(true))
    })
    return () => {
      cancelAnimationFrame(frame)
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      element.close()
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [])
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      className={`fixed inset-0 z-100 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-black/60 p-4 text-cream transition-opacity duration-250 backdrop:bg-transparent motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <button
        type="button"
        aria-label="Dismiss pop-up"
        tabIndex={-1}
        className="fixed inset-0 cursor-default"
        onClick={close}
      />
      <div className="pointer-events-none relative flex min-h-full items-center justify-center py-6">
        <div
          className={`pointer-events-auto w-full ${popup.layout === "left" || popup.layout === "right" ? "max-w-3xl" : "max-w-lg"}`}
        >
          <MarketingPopupCard popup={popup} onClose={close} titleId={titleId}>
            {popup.captureEmail &&
              (success ? (
                <output className="text-sm">Thank you! Your email has been submitted.</output>
              ) : (
                <form
                  className="grid gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setBusy(true)
                    setError("")
                    try {
                      await captureEmail({ popupId: popup._id, email })
                      setSuccess(true)
                      try {
                        localStorage.setItem(`lily:popup-captured:${popup._id}`, "1")
                      } catch {
                        /* Submission still succeeded. */
                      }
                    } catch (reason) {
                      setError(
                        reason instanceof Error
                          ? reason.message
                          : "Could not submit your email. Please try again.",
                      )
                    } finally {
                      setBusy(false)
                    }
                  }}
                >
                  <label className="grid gap-2 text-sm">
                    Email address
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="min-h-12 w-full rounded-lg border border-cream/50 bg-transparent px-4 text-cream outline-none placeholder:text-cream/50 focus:border-cream focus:ring-2 focus:ring-cream/30"
                      placeholder="you@example.com"
                    />
                  </label>
                  <div>
                    <PillButton color="wineCream" type="submit" disabled={busy}>
                      {busy ? "Submitting…" : "Submit"}
                    </PillButton>
                  </div>
                  {error && (
                    <p role="alert" className="text-sm">
                      {error}
                    </p>
                  )}
                </form>
              ))}
          </MarketingPopupCard>
        </div>
      </div>
    </dialog>
  )
}

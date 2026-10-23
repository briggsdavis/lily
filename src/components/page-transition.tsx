"use client"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function PageTransition() {
  const pathname = usePathname()
  const router = useRouter()
  const [phase, setPhase] = useState<"idle" | "enter" | "exit">("idle")
  const pending = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!pending.current) return
    // Keep the curtain covering the first painted frame of the destination.
    const frame = requestAnimationFrame(() => {
      setPhase("exit")
      timer.current = setTimeout(() => {
        pending.current = false
        setPhase("idle")
      }, 780)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  useEffect(() => {
    const navigate = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (
        !anchor ||
        anchor.hasAttribute("data-transition-link") ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        anchor.download ||
        (anchor.target && anchor.target !== "_self")
      )
        return
      const url = new URL(anchor.href, location.href)
      if (
        url.origin !== location.origin ||
        url.pathname === location.pathname ||
        url.pathname.startsWith("/admin") ||
        location.pathname.startsWith("/admin") ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return
      event.preventDefault()
      event.stopPropagation()
      if (pending.current) return
      pending.current = true
      router.prefetch(url.pathname)
      setPhase("enter")
      timer.current = setTimeout(() => router.push(url.pathname + url.search + url.hash), 624)
    }
    const requested = (event: Event) => {
      const request = event as CustomEvent<string>
      if (pending.current) {
        request.preventDefault()
        return
      }
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
      request.preventDefault()
      pending.current = true
      router.prefetch(request.detail)
      setPhase("enter")
      timer.current = setTimeout(() => router.push(request.detail), 624)
    }
    window.addEventListener("lily:navigate", requested)
    document.addEventListener("click", navigate, true)
    return () => {
      window.removeEventListener("lily:navigate", requested)
      document.removeEventListener("click", navigate, true)
      clearTimeout(timer.current)
    }
  }, [router])

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className="page-transition fixed inset-0 z-[200] grid place-items-center bg-dark-maroon"
    >
      <Image
        alt=""
        src="/images/social-work.png"
        width={1254}
        height={1254}
        sizes="70px"
        className="h-auto w-[70px]"
      />
    </div>
  )
}

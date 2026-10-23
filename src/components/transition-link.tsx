"use client"

import Link from "@/components/site-link"
import { useRouter } from "next/navigation"
import { ComponentProps, MouseEvent, ReactNode, useCallback } from "react"

export function TransitionLink({
  children,
  className,
  href,
  onNavigate,
  ...props
}: Omit<ComponentProps<typeof Link>, "onClick"> & {
  children: ReactNode
  className?: string
  onNavigate?: () => void
}) {
  const router = useRouter()

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        typeof href !== "string" ||
        href.startsWith("#")
      ) {
        return
      }

      event.preventDefault()
      onNavigate?.()
      const url = new URL(href, window.location.href)
      if (url.origin !== window.location.origin) {
        window.location.assign(url.href)
        return
      }
      const request = new CustomEvent("lily:navigate", { detail: href, cancelable: true })
      if (
        url.pathname !== window.location.pathname &&
        !url.pathname.startsWith("/admin") &&
        window.dispatchEvent(request) === false
      )
        return
      router.push(href)
    },
    [href, onNavigate, router],
  )

  return (
    <Link data-transition-link className={className} href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

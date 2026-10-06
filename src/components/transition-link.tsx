"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ComponentProps, MouseEvent, ReactNode } from "react"

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

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
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
    document.documentElement.classList.add("route-leaving")

    window.setTimeout(() => {
      router.push(href)
      window.setTimeout(() => document.documentElement.classList.remove("route-leaving"), 320)
    }, 260)
  }

  return (
    <Link className={className} href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

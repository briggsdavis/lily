"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import { useDisabledPages } from "@/components/page-visibility"
import { isPageEnabled } from "@/lib/page-visibility"

export default function SiteLink({
  children,
  href,
  className,
  ...props
}: ComponentProps<typeof Link>) {
  const disabled = useDisabledPages()
  const path = typeof href === "string" ? href : (href.pathname ?? "")
  if (path.startsWith("/") && !path.startsWith("//") && !isPageEnabled(path, disabled)) {
    return null
  }
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  )
}

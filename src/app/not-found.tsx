import Image from "next/image"
import { PillLink } from "@/components/pill-button"

export default function NotFound() {
  return (
    <div className="grid min-h-svh items-center gap-8 bg-cream px-page pt-28 pb-12 text-orange-brown md:grid-cols-2 md:gap-16 lg:gap-32 lg:pt-40 lg:pb-24">
      <div className="flex max-w-lg flex-col items-start">
        <p className="eyebrow" data-reveal>
          Error 404
        </p>
        <h1
          className="mt-2.5 mb-5 max-w-[8ch] font-display text-5xl font-medium text-burgundy reveal-delay-120 lg:text-7xl"
          data-reveal
        >
          This table is empty.
        </h1>
        <p className="mb-8 max-w-[39ch] reveal-delay-240" data-reveal>
          The page you were looking for is no longer on the menu. Let&apos;s bring you back to Lily.
        </p>
        <span className="reveal-delay-360" data-reveal>
          <PillLink color="burgundy" href="/">
            Return home
          </PillLink>
        </span>
      </div>
      <div className="relative aspect-4/5 w-4/5 max-w-sm justify-self-center overflow-hidden md:w-full md:max-w-xl md:justify-self-end">
        <Image
          alt="A candlelit table waiting at Lily"
          className="object-cover"
          fill
          priority
          sizes="(max-width: 800px) 100vw, 46vw"
          src="/lily-romantic-interior-9x16.webp"
        />
      </div>
    </div>
  )
}

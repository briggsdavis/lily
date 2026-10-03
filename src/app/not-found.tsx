import Image from "next/image"
import { PillLink } from "@/components/pill-button"

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-page__copy">
        <p className="eyebrow">Error 404</p>
        <h1>This table is empty.</h1>
        <p>
          The page you were looking for is no longer on the menu. Let&apos;s bring you back to Lily.
        </p>
        <PillLink color="burgundy" href="/">
          Return home
        </PillLink>
      </div>
      <div className="not-found-page__image">
        <Image
          alt="A candlelit table waiting at Lily"
          fill
          priority
          sizes="(max-width: 800px) 100vw, 46vw"
          src="/lily-romantic-interior-9x16.png"
        />
      </div>
    </div>
  )
}

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-cream px-page pt-4 pb-12 text-burgundy">
      <p className="font-display text-[clamp(6rem,22vw,22rem)] leading-none font-bold">Lily</p>
      <div className="mt-6 flex flex-col items-start gap-4 text-xs uppercase sm:flex-row sm:justify-between">
        <p>© {year} Lily. All rights reserved.</p>
        <a
          className="animated-underline"
          href="https://socialsatisfaction.agency"
          rel="noopener noreferrer"
          target="_blank"
        >
          Made by Social Satisfaction
        </a>
      </div>
    </footer>
  )
}

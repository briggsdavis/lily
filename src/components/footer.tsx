const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-cream px-page pt-4 pb-12 text-burgundy">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-[clamp(6rem,22vw,22rem)] leading-none font-bold">Lily</p>
        <div className="flex flex-col items-start gap-3 text-base sm:items-end sm:text-right lg:text-lg">
          <p>hello@lilyrestaurant.com</p>
          <p>(724) 502-4572</p>
          <address className="not-italic">
            500 Grandview Crossing Dr
            <br />
            Gibsonia, PA 15044
          </address>
        </div>
      </div>
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

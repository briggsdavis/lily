const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="flex items-center justify-between gap-4 px-5 py-6 text-xs md:px-8 xl:px-16">
      <p>© {year} Cala Lily</p>

      <a
        className="animated-underline"
        href="https://socialsatisfaction.agency"
        rel="noopener noreferrer"
        target="_blank"
      >
        Made by Social Satisfaction
      </a>
    </footer>
  )
}

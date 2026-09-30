import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

type Tone = "cream" | "green-pink" | "green-cream" | "burgundy";

export function SiteShell({
  children,
  tone,
}: {
  children: ReactNode;
  tone: Tone;
}) {
  return (
    <div className="site-shell" data-tone={tone}>
      <header className="site-header">
        <Link className="site-name" href="/">
          Lily
        </Link>
        <nav aria-label="Main navigation" className="site-nav">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
}

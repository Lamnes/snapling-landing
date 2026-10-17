import { CTA } from "@/lib/seo";

export type NavItem = { label: string; href: string };

// iGaming lives in the footer, not here: many game studios won't work with a
// vendor that leads with gambling.
const NAV: NavItem[] = [
  { label: "Product", href: "#modules" },
  { label: "Context", href: "#context" },
  { label: "LQA", href: "#lqa" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

export function Logo({ href = "#top" }: { href?: string }) {
  return (
    <a href={href} aria-label="Snapling — home" className="flex items-center gap-2.5">
      <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime font-display text-lg font-extrabold text-black">
        S
      </span>
      <span className="text-lg font-semibold tracking-tight">Snapling</span>
    </a>
  );
}

export default function Header({
  nav = NAV,
  home = "#top",
  ctaHref = "#contact",
}: {
  nav?: NavItem[];
  home?: string;
  ctaHref?: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo href={home} />
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href={ctaHref}
          className="rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-black transition hover:bg-lime-dim active:scale-[0.98]"
        >
          {CTA}
        </a>
      </div>
    </header>
  );
}

const NAV = [
  { label: "Product", href: "#modules" },
  { label: "Quality", href: "#context" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime font-display text-lg font-extrabold text-black">
        S
      </span>
      <span className="text-lg font-semibold tracking-tight">Snapling</span>
    </a>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-black transition hover:bg-lime-dim"
        >
          Request a demo
        </a>
      </div>
    </header>
  );
}

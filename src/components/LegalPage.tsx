import Header from "@/components/Header";
import { contactEmail } from "@/lib/seo";

const NAV = [
  { label: "Product", href: "/#modules" },
  { label: "Pricing", href: "/#pricing" },
  { label: "iGaming", href: "/igaming" },
];

// Shared shell for /privacy and /terms: site header, one readable column,
// a short footer. Pilot-stage drafts — no legal entity details yet.
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header nav={NAV} home="/" ctaHref="/#contact" />
      <main id="main" className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="h-display text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 font-mono text-xs tracking-wide text-faint">Last updated {updated}</p>
        <p className="mt-6 rounded-xl border border-line bg-panel px-5 py-4 text-sm leading-relaxed text-muted">
          Snapling is in a closed pilot. This is a working version of the document; it will be
          finalized before general availability, and we&apos;ll tell pilot participants what
          changed. Questions:{" "}
          <a href={`mailto:${contactEmail}`} className="text-lime hover:underline">
            {contactEmail}
          </a>
          .
        </p>
        <div className="mt-10 text-[15px] leading-relaxed text-white/80 [&_a]:text-lime [&_a:hover]:underline [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:mt-2 [&_p]:mt-4 [&_strong]:text-white [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-faint">
          <span>© 2026 Snapling. All rights reserved.</span>
          <span className="flex gap-4">
            <a href="/" className="transition-colors hover:text-white">Home</a>
            <a href="/privacy" className="transition-colors hover:text-white">Privacy</a>
            <a href="/terms" className="transition-colors hover:text-white">Terms</a>
          </span>
        </div>
      </footer>
    </>
  );
}

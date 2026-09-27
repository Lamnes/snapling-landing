import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Estimator from "@/components/Estimator";
import { contactEmail } from "@/lib/seo";

const TITLE = "Word count & plan estimate — Snapling";
const DESCRIPTION =
  "Count the translatable words in your site or localization files (JSON, PO, XLIFF, CSV, .strings) and see which Snapling plan fits.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/estimate" },
  openGraph: { type: "website", url: "/estimate", siteName: "Snapling", title: TITLE, description: DESCRIPTION },
};

const NAV = [
  { label: "Product", href: "/#modules" },
  { label: "Pricing", href: "/#pricing" },
  { label: "iGaming", href: "/igaming" },
];

export default async function EstimatePage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  return (
    <>
      <Header nav={NAV} home="/" ctaHref="#apply" />
      <main id="main" className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
        <p className="eyebrow">Estimate</p>
        <h1 className="h-display mt-4 text-balance text-4xl sm:text-5xl">
          How many words will you translate?
        </h1>
        <p className="mt-5 max-w-2xl text-muted">
          Plans are priced in translated words: the words of your source text, once per target
          language. Count them from your site or your string tables and see which plan fits — before
          you talk to anyone.
        </p>
        <Estimator initialSource={source === "site" ? "url" : "files"} />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-faint">
          <span>© 2026 Snapling. All rights reserved.</span>
          <span className="flex flex-wrap gap-4">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-white">{contactEmail}</a>
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
          </span>
        </div>
      </footer>
    </>
  );
}

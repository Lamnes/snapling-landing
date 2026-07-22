import { Logo } from "@/components/Header";

/* Branded 404, styled like an Auto-LQA defect report — the product's own
   visual language (see Defect in components/Mocks.tsx). */
export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative inline-block px-4 py-1">
        <p className="h-display text-7xl sm:text-8xl">404</p>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded border-2 border-[#ef4444]"
          style={{ boxShadow: "0 0 0 1px rgba(0,0,0,.4)" }}
        >
          <span className="absolute -top-5 left-0 rounded bg-[#ef4444] px-1.5 font-mono text-[10px] font-medium text-black">
            Not found
          </span>
        </span>
      </div>

      <h1 className="h-display mt-10 text-balance text-3xl sm:text-4xl">This screen didn&apos;t ship.</h1>
      <p className="mt-4 max-w-md text-pretty text-muted">
        The page you&apos;re looking for doesn&apos;t exist — flagged and boxed, the way our
        automated LQA reports a missing screen. Head back to the start.
      </p>

      <a
        href="/"
        className="mt-8 rounded-lg bg-lime px-5 py-3 font-semibold text-black transition hover:bg-lime-dim active:scale-[0.98]"
      >
        ← Back to Snapling
      </a>

      <div className="mt-14 opacity-60">
        <Logo />
      </div>
    </main>
  );
}

// What happens after the application: the build appears only at step 3,
// after a call and under NDA.
export default function PilotSteps({ slice = "a slice of your game" }: { slice?: string }) {
  const steps = [
    "Tell us about your game.",
    "A 20-minute call to scope it.",
    `Under NDA, share ${slice} — we localize it and hand back the LQA report.`,
  ];
  return (
    <div className="mx-auto mt-10 max-w-md text-left">
      <p className="font-mono text-[11px] tracking-widest text-faint">HOW THE PILOT WORKS</p>
      <ol className="mt-3 space-y-2 text-sm text-muted">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="font-mono text-lime">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-faint">We sign an NDA before any build changes hands.</p>
    </div>
  );
}

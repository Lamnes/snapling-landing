"use client";

import { useState } from "react";

/**
 * Lead-capture form for the final CTA. No backend on the marketing site — on
 * submit it opens a prefilled email to hello@snapling.io and shows a thanks
 * state. Swap the handler for a real endpoint when one exists.
 */
export default function DemoForm() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const body = encodeURIComponent(
      `Email: ${email}\n\n${note || "I'd like to see my game localized live. I can share a build / assets."}`
    );
    window.location.href = `mailto:hello@snapling.io?subject=${encodeURIComponent(
      "Snapling — game localization demo"
    )}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-lime/40 bg-lime/10 px-6 py-5 text-center">
        <p className="font-semibold text-lime">Thanks — your email client is opening.</p>
        <p className="mt-1 text-sm text-muted">
          Or write us directly at{" "}
          <a href="mailto:hello@snapling.io" className="text-lime hover:underline">
            hello@snapling.io
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-8 max-w-md text-left">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          className="flex-1 rounded-lg border border-line-strong bg-white/[0.03] px-4 py-3 text-white placeholder:text-faint outline-none focus:border-lime"
        />
        <button
          type="submit"
          className="rounded-lg bg-lime px-5 py-3 font-semibold text-black transition hover:bg-lime-dim"
        >
          Get access →
        </button>
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional: engine, languages, or a link to your build"
        className="mt-3 w-full rounded-lg border border-line bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-faint outline-none focus:border-lime"
      />
      <p className="mt-3 text-center text-xs text-faint">
        Send us a build or a few assets — we&apos;ll show it localized live.
      </p>
    </form>
  );
}

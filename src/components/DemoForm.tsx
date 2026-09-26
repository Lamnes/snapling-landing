"use client";

import { useState } from "react";
import { CTA } from "@/lib/seo";

/**
 * Pilot application form for the final CTA. Posts to /api/lead, which emails
 * the team when delivery is configured. If it isn't (or the request fails),
 * the form opens a prefilled email instead and says so plainly — it never
 * shows "thanks" for an application that went nowhere.
 */
export default function DemoForm() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailto">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, note, page: window.location.pathname }),
      });
      if (res.ok) {
        setState("sent");
        return;
      }
    } catch {
      // network error — fall back to email below
    }
    const body = encodeURIComponent(
      `Email: ${email}\n\n${note || "I'd like to apply for the closed pilot. I can share a build / assets."}`
    );
    window.location.href = `mailto:hello@snapling.io?subject=${encodeURIComponent(
      "Snapling — pilot application"
    )}&body=${body}`;
    setState("mailto");
  };

  if (state === "sent") {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-lime/40 bg-lime/10 px-6 py-5 text-center">
        <p className="font-semibold text-lime">Thanks — your application is in.</p>
        <p className="mt-1 text-sm text-muted">We&apos;ll reply to {email}.</p>
      </div>
    );
  }

  if (state === "mailto") {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-lime/40 bg-lime/10 px-6 py-5 text-center">
        <p className="font-semibold text-lime">Almost there — send the email that just opened.</p>
        <p className="mt-1 text-sm text-muted">
          If no email app opened, write to{" "}
          <a href="mailto:hello@snapling.io" className="text-lime hover:underline">
            hello@snapling.io
          </a>{" "}
          from {email}.
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
          aria-label="Work email"
          className="flex-1 rounded-lg border border-line-strong bg-white/[0.03] px-4 py-3 text-white transition-colors placeholder:text-faint outline-none focus:border-lime"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-lg bg-lime px-5 py-3 font-semibold text-black transition hover:bg-lime-dim active:scale-[0.98] disabled:opacity-60"
        >
          {CTA} →
        </button>
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional: engine, languages, or a link to your build"
        aria-label="Optional context: engine, languages, or a link to your build"
        className="mt-3 w-full rounded-lg border border-line bg-white/[0.02] px-4 py-3 text-sm text-white transition-colors placeholder:text-faint outline-none focus:border-lime"
      />
      <p className="mt-3 text-center text-xs text-faint">
        Send a build or a few assets — we&apos;ll localize a slice of it with you and hand back the
        LQA report.
      </p>
    </form>
  );
}

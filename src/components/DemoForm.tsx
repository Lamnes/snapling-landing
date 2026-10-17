"use client";

import { useState } from "react";
import { CTA, contactEmail } from "@/lib/seo";

const ENGINES = ["Unity", "Unreal", "Flutter", "Web", "Other"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM = /^(@|https?:\/\/t\.me\/)?[A-Za-z0-9_]{5,32}$/;

/**
 * Pilot application form. The first step is a short message, not a build:
 * name, an email or Telegram, a line about the game; the engine is optional.
 * Posts to /api/lead, which emails the team when delivery is configured. If it
 * isn't (or the request fails), the form opens a prefilled email instead and
 * says so plainly — it never shows "thanks" for an application that went nowhere.
 * `initialNote` prefills "about" (the estimator passes its result).
 */
export default function DemoForm({
  initialNote = "",
  aboutPlaceholder = "Indie RPG in Unity, want JA and ZH with voice",
}: {
  initialNote?: string;
  aboutPlaceholder?: string;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [about, setAbout] = useState(initialNote);
  const [engine, setEngine] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailto">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    const c = contact.trim();
    if (!EMAIL.test(c) && !TELEGRAM.test(c)) {
      setError("Enter an email or a Telegram username.");
      return;
    }
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact: c, about, engine, page: window.location.pathname }),
      });
      if (res.ok) {
        setState("sent");
        return;
      }
    } catch {
      // network error — fall back to email below
    }
    const body = encodeURIComponent(
      `Name: ${name}\nContact: ${c}\nEngine: ${engine || "—"}\n\n${about}`,
    );
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      "Snapling — pilot application",
    )}&body=${body}`;
    setState("mailto");
  };

  if (state === "sent") {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-lime/40 bg-lime/10 px-6 py-5 text-center">
        <p className="font-semibold text-lime">Thanks — your application is in.</p>
        <p className="mt-1 text-sm text-muted">We&apos;ll get back to you at {contact.trim()}.</p>
      </div>
    );
  }

  if (state === "mailto") {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-lime/40 bg-lime/10 px-6 py-5 text-center">
        <p className="font-semibold text-lime">Almost there — send the email that just opened.</p>
        <p className="mt-1 text-sm text-muted">
          If no email app opened, write to{" "}
          <a href={`mailto:${contactEmail}`} className="text-lime hover:underline">
            {contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-lg border border-line-strong bg-white/[0.03] px-4 py-3 text-white transition-colors placeholder:text-faint outline-none focus:border-lime";

  return (
    <form onSubmit={submit} className="mx-auto mt-8 max-w-md space-y-3 text-left">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
          aria-label="Name" autoComplete="name" className={field} />
        <input required value={contact} onChange={(e) => setContact(e.target.value)}
          placeholder="Email or @telegram" aria-label="Email or Telegram" autoComplete="email" className={field} />
      </div>
      <textarea required rows={2} value={about} onChange={(e) => setAbout(e.target.value)}
        placeholder={aboutPlaceholder} aria-label="About your game" className={`${field} resize-y text-sm`} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <select value={engine} onChange={(e) => setEngine(e.target.value)} aria-label="Engine (optional)"
          className={`${field} sm:w-44 ${engine ? "" : "text-faint"}`}>
          <option value="">Engine (optional)</option>
          {ENGINES.map((x) => <option key={x} value={x} className="bg-ink text-white">{x}</option>)}
        </select>
        <button type="submit" disabled={state === "sending"}
          className="flex-1 rounded-lg bg-lime px-5 py-3 font-semibold text-black transition hover:bg-lime-dim active:scale-[0.98] disabled:opacity-60">
          {CTA} →
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <p className="text-center text-xs text-faint">No build needed to start. A short message is enough.</p>
    </form>
  );
}

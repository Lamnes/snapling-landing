import { NextResponse } from "next/server";

/**
 * Pilot applications from the site form: name, an email or Telegram, a line
 * about the game, optionally the engine. Delivered by email through Resend
 * when RESEND_API_KEY and LEAD_TO_EMAIL are set (LEAD_FROM_EMAIL optional — a
 * verified sender on your domain). Without them this answers 503 and the form
 * falls back to the visitor's email app, so no application is silently dropped.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM = /^(@|https?:\/\/t\.me\/)?[A-Za-z0-9_]{5,32}$/;

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = text(body.name, 120);
  const contact = text(body.contact, 254);
  const about = text(body.about, 2000);
  const engine = text(body.engine, 40);
  const page = text(body.page, 200);
  const isEmail = EMAIL.test(contact);
  if (!name || !about) {
    return NextResponse.json({ error: "Tell us your name and a line about your game" }, { status: 400 });
  }
  if (!isEmail && !TELEGRAM.test(contact)) {
    return NextResponse.json({ error: "Enter an email or a Telegram username" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!key || !to) {
    return NextResponse.json({ error: "Lead delivery is not configured" }, { status: 503 });
  }

  const telegram = isEmail ? "" : `https://t.me/${contact.replace(/^@|^https?:\/\/t\.me\//, "")}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? "Snapling site <onboarding@resend.dev>",
      to: [to],
      ...(isEmail ? { reply_to: contact } : {}),
      subject: `Pilot application — ${name}`,
      text:
        `Name: ${name}\nContact: ${contact}${telegram ? ` (${telegram})` : ""}\n` +
        `Engine: ${engine || "—"}\nPage: ${page}\n\n${about}`,
    }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

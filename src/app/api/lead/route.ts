import { NextResponse } from "next/server";

/**
 * Pilot applications from the site form. Delivered by email through Resend
 * when RESEND_API_KEY and LEAD_TO_EMAIL are set (LEAD_FROM_EMAIL optional —
 * a verified sender on your domain). Without them this answers 503 and the
 * form falls back to the visitor's email app, so no application is silently
 * dropped.
 */
export async function POST(req: Request) {
  let body: { email?: unknown; note?: unknown; page?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 2000) : "";
  const page = typeof body.page === "string" ? body.page.slice(0, 200) : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!key || !to) {
    return NextResponse.json({ error: "Lead delivery is not configured" }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? "Snapling site <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Pilot application — ${email}`,
      text: `Email: ${email}\nPage: ${page}\n\n${note || "(no note)"}`,
    }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

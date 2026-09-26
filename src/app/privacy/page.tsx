import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { contactEmail } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy — Snapling",
  description: "What Snapling collects on this website and in the pilot service, why, and who processes it.",
  alternates: { canonical: "/privacy" },
  openGraph: { type: "website", url: "/privacy", siteName: "Snapling", title: "Privacy Policy — Snapling" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 27, 2026">
      <p>
        This policy covers this website and the Snapling localization service we run for pilot
        participants. It says what we collect, why, who else processes it, and what you can ask us
        to do with it.
      </p>

      <h2>This website</h2>
      <ul>
        <li>
          <strong>No cookies, analytics or ad trackers.</strong> Fonts are served from this site, not
          from a third party.
        </li>
        <li>
          Our hosting provider keeps standard server logs (IP address, browser, the page requested)
          to run the site and keep it secure.
        </li>
        <li>
          <strong>Pilot applications.</strong>{" "}
          When you apply, we receive your email address, the
          note you write, and which page you applied from. It is delivered to our team by email. If
          the form can&apos;t send, it opens your own email app instead — then it is an ordinary
          email to us.
        </li>
      </ul>

      <h2>The Snapling service (pilot)</h2>
      <ul>
        <li>
          <strong>Account data:</strong> name, work email and organization name. Passwords are
          stored only as one-way hashes; API keys only as hashes.
        </li>
        <li>
          <strong>Your content:</strong> what you send us to localize or check — text and i18n
          files, screenshots, images, audio and video, and, if you use the web SDK, the text and
          markup of the pages it runs on.
        </li>
        <li>
          <strong>Usage and security records:</strong> what jobs ran and how much they used (for
          quotas and billing), and sign-in attempts (to stop password guessing).
        </li>
        <li>
          The pilot has no card payments. If we add them, a payment processor will handle card
          details; we would keep only the card brand and last four digits.
        </li>
      </ul>
      <p>
        Please keep your players&apos; or customers&apos; personal data out of the content you send.
        If a screenshot shows a real user&apos;s details, crop or mask them first.
      </p>

      <h2>How we use it</h2>
      <p>
        To run the jobs you ask for and deliver the results, to talk with you about the pilot, to
        enforce usage limits, and to keep the service secure. We don&apos;t sell data, don&apos;t
        use it for advertising, and don&apos;t train our own models on your content.
      </p>

      <h2>Who processes it for us</h2>
      <ul>
        <li>
          <strong>OpenRouter</strong> — routes translation and review requests to the AI language
          and vision models that perform them.
        </li>
        <li>
          <strong>fal.ai</strong> — image, video and speech generation and processing.
        </li>
        <li>
          <strong>Resend</strong> — delivers pilot applications from this site to our inbox.
        </li>
        <li>
          <strong>Railway</strong> — hosts this website. Separate cloud hosting and storage
          providers run the Snapling service and store your files.
        </li>
      </ul>
      <p>
        Each receives only what its part of the work needs and processes it under its own terms.
        Some of them are in the United States, so your data may be processed outside your country.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Account data and content — while your account is active, or until you ask us to delete it.</li>
        <li>
          Files you delete in the app — removed from storage after a short recovery window
          (currently 7 days).
        </li>
        <li>Pilot applications — as long as the conversation needs them, or until you ask us to delete them.</li>
        <li>Server logs — for a limited period, for operations and security.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can ask us for a copy of your data, to correct it, to export your content, or to delete
        it — write to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. If you are in the EU or
        UK, you also have the rights the GDPR gives you, including complaining to your data
        protection authority.
      </p>

      <h2>Security</h2>
      <p>
        Traffic is encrypted in transit, passwords and API keys are stored as hashes, and every
        organization&apos;s data is separated from every other&apos;s. No system is perfectly
        secure; if we learn of a breach that affects your data, we will tell you.
      </p>

      <h2>Children</h2>
      <p>Snapling is a business service and isn&apos;t meant for anyone under 16.</p>

      <h2>Changes</h2>
      <p>
        When this policy changes, we update the date at the top and tell pilot participants about
        material changes before they apply.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or Telegram{" "}
        <a href="https://t.me/snapling" target="_blank" rel="noopener noreferrer">@snapling</a>.
      </p>
    </LegalPage>
  );
}

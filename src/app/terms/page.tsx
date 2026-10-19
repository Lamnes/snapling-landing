import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { contactEmail } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service — Snapling",
  description: "The terms for using the Snapling website and the Snapling pilot service.",
  alternates: { canonical: "/terms" },
  openGraph: { type: "website", url: "/terms", siteName: "Snapling", title: "Terms of Service — Snapling" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="September 27, 2026">
      <p>
        These terms apply to this website and to the Snapling localization service. By using
        either, you agree to them. If you use Snapling for a company, you confirm you may accept
        these terms on its behalf.
      </p>

      <h2>1. The pilot</h2>
      <p>
        Snapling is in a closed, invitation-only pilot. Features may change, be limited or be
        removed, and there is no uptime or support-time commitment. We may end the pilot with
        reasonable notice. Anything we agree with you in writing for your pilot — scope, dates,
        pricing — takes precedence over these terms.
      </p>

      <h2>2. Your account</h2>
      <p>
        We create accounts for pilot participants. Keep your password and API keys secret: you are
        responsible for what is done with them. Tell us straight away if you think someone else has
        access.
      </p>

      <h2>3. Your content</h2>
      <p>
        You keep all rights to what you upload and to the localized output we produce for you. You
        let us host, process and transmit your content only to provide the service — including
        sending it to the AI providers listed in our <a href="/privacy">Privacy Policy</a>. You
        confirm you have the rights to the content you send.
      </p>

      <h2>4. Machine output needs review</h2>
      <p>
        Translations, voice and images are produced by AI models and can be wrong. Automated LQA
        catches many defects but not all of them. Review output before you release it. For
        regulated text — gambling compliance and responsible-gambling notices, age limits, legal
        terms — you remain responsible for the final wording and for meeting your license and local
        law. Snapling does not give legal or compliance advice.
      </p>

      <h2>5. Acceptable use</h2>
      <ul>
        <li>No unlawful content, and no content you don&apos;t have the rights to.</li>
        <li>
          No attempts to break, probe or overload the service or get around its limits — security
          testing only with our written permission.
        </li>
        <li>No reselling or sharing access outside your organization without our agreement.</li>
        <li>No using Snapling to produce content that misleads people or infringes others&apos; rights.</li>
      </ul>

      <h2>6. Fees</h2>
      <p>
        The pilot is free unless we agree otherwise in writing. Paid plans will come with their own
        published terms, and nothing is charged without your agreement.
      </p>

      <h2>7. Confidentiality</h2>
      <p>
        We treat your unreleased builds, assets and content as confidential and give access to them
        only to the people and providers who need it to run and support the service.
      </p>

      <h2>8. Our software</h2>
      <p>
        The Snapling service, SDKs and this website belong to us. You may use the SDKs to integrate
        your products with Snapling. If you send us feedback, we may use it without obligation.
      </p>

      <h2>9. No warranty</h2>
      <p>
        During the pilot the service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;,
        without warranties of any kind, to the extent the law allows.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the extent the law allows, we are not liable for indirect or consequential losses (such
        as lost profits or revenue), and our total liability is limited to what you paid us for the
        service in the 12 months before the claim. Nothing here limits liability that the law does
        not allow to be limited.
      </p>

      <h2>11. Ending use</h2>
      <p>
        You can stop using Snapling at any time and ask us to export and then delete your content.
        We may suspend access that breaks these terms or puts the service or other customers at
        risk, and will tell you why.
      </p>

      <h2>12. Changes</h2>
      <p>
        When these terms change, we update the date at the top and tell pilot participants about
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

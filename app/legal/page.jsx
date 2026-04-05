export default function LegalPage() {
  return (
    <main className="px-3 py-16 min-[1200px]:px-38">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-5xl">
          Legal
        </h1>
        <p className="mb-10 text-sm text-neutral-500">
          Terms of Service and Privacy Policy for Visawise
        </p>

        {/* TERMS */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold">Terms of Service</h2>

          <div className="space-y-4 text-sm leading-relaxed text-neutral-600">
            <p>
              By using Visawise, you agree to use the platform only for lawful
              purposes and in accordance with these terms.
            </p>

            <p>
              Visawise provides guidance and checklist tools for visa
              applications. We do not guarantee visa approval or act as an
              immigration authority.
            </p>

            <p>
              You are responsible for the accuracy of the information you
              provide. Incorrect or incomplete data may affect your experience.
            </p>

            <p>
              We may update or modify the service at any time without prior
              notice.
            </p>

            <p>
              We reserve the right to suspend or terminate accounts that abuse
              the platform.
            </p>
          </div>
        </section>

        {/* PRIVACY */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold">Privacy Policy</h2>

          <div className="space-y-4 text-sm leading-relaxed text-neutral-600">
            <p>
              We collect basic account information such as your email and the
              data you provide when creating visa applications.
            </p>

            <p>
              Your data is private and only accessible to you. We use secure
              infrastructure (e.g. Supabase with row-level security) to protect
              your information.
            </p>

            <p>We do not sell your personal data to third parties.</p>

            <p>
              Aggregated and anonymized data may be used to improve features
              like insights and trends.
            </p>

            <p>
              You can request deletion of your data at any time by contacting
              us.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section>
          <h2 className="mb-4 text-xl font-bold">Contact</h2>
          <p className="text-sm text-neutral-600">
            For any questions about these terms, contact:{" "}
            <a
              href="mailto:billy@visawise.ngk@gmail.com"
              className="font-medium text-neutral-900 underline"
            >
              billy@visawise.ngk@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

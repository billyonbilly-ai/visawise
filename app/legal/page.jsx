import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LegalPage() {
  return (
    <main className="px-3 py-16 min-[1200px]:px-38">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="flex w-max">
          <Button type="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4 rotate-180"
            >
              <path
                fillRule="evenodd"
                d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                clipRule="evenodd"
              />
            </svg>{" "}
            Back
          </Button>
        </Link>

        <h1 className="mt-7.5 mb-12 text-2xl font-extrabold tracking-tight md:text-3xl">
          Legal
        </h1>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold">Terms of Service</h2>

          <div className="space-y-4 text-sm leading-relaxed text-neutral-600">
            <p>
              By using Visawise, you agree to use the platform only for lawful
              purposes and in accordance with these terms.
            </p>

            <p>
              Visawise provides guidance and checklist tools for visa
              applications.{" "}
              <span className="font-medium text-neutral-900">
                We do not guarantee visa approval
              </span>{" "}
              or act as an immigration authority.
            </p>

            <p>
              <span className="font-medium text-neutral-900">
                You are responsible for the accuracy
              </span>{" "}
              of the information you provide. Incorrect or incomplete data may
              affect your experience.
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

            <p>
              <span className="font-medium text-neutral-900">
                We do not sell your personal data
              </span>{" "}
              to third parties.
            </p>

            <p>
              Aggregated and anonymized data may be used to improve features
              like insights and trends.
            </p>

            <p>
              <span className="font-medium text-neutral-900">
                You can request deletion of your data
              </span>{" "}
              at any time by contacting us.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">Contact</h2>
          <p className="text-sm text-neutral-600">
            For any questions about these terms, contact:{" "}
            <a
              href="mailto:billy@visawise.ng@gmail.com"
              className="text-base font-medium text-neutral-900 underline"
            >
              billy@visawise.ng@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

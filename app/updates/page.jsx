import Link from "next/link";
import Button from "@/components/ui/Button";

export default function UpdatesPage() {
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
          Updates
        </h1>

        <div className="card-shadow rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-sm leading-relaxed text-neutral-600">
            All future updates, improvements, and announcements about Visawise
            will be published here.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            As we continue to build, you'll find new features, changes, and
            important information documented on this page.
          </p>
        </div>
      </div>
    </main>
  );
}

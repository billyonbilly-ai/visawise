export default function ContactPage() {
  return (
    <main className="px-3 py-16 min-[1200px]:px-38">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          Contact
        </h1>

        <p className="text-md mb-2 font-medium text-neutral-800">
          Hi traveler 👋
        </p>
        <p className="mb-10 max-w-xl text-sm leading-relaxed text-neutral-500">
          Need help, have a question, or want to make an inquiry? Reach out
          directly to the founder.
        </p>

        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="card-shadow flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 transition hover:bg-neutral-50">
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                Send an email to
              </p>
              <p className="text-sm text-neutral-500">billy@visawise.ng</p>
            </div>
          </div>

          {/* X (Twitter) */}
          <a
            href="https://x.com/billyonbilly"
            target="_blank"
            rel="noopener noreferrer"
            className="card-shadow flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-4 transition hover:bg-neutral-50"
          >
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                Message on X
              </p>
              <p className="text-sm text-neutral-500">@billyonbilly</p>
            </div>

            <span className="text-neutral-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}

export default function UpdatesPage() {
  return (
    <main className="px-3 py-16 min-[1200px]:px-38">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-5xl">
          Updates
        </h1>
        <p className="mb-10 text-sm text-neutral-500">
          Product updates and announcements
        </p>

        <div className="card-shadow rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-sm leading-relaxed text-neutral-600">
            All future updates, improvements, and announcements about Visawise
            will be published here.
          </p>

          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            As we continue to build, you’ll find new features, changes, and
            important information documented on this page.
          </p>
        </div>
      </div>
    </main>
  );
}

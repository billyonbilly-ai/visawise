import Button from "../ui/Button";

export default function Mission() {
  return (
    <section className="px-3 py-12 min-[1200px]:px-38 lg:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
          Built for Nigerians
        </h2>
      </div>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-10">
        <p className="text-center">
          We empower Nigerian travelers by providing a clear, manageable path
          through the visa application process, replacing complexity with
          structure and ease.
        </p>
        <div className="flex max-w-xl justify-center">
          <Button className="w-full py-3 text-[16px]" href="/signup">
            Begin your visa journey
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
          </Button>
        </div>
      </div>
    </section>
  );
}

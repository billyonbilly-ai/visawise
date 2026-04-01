import Image from "next/image";

const steps = [
  {
    number: "1",
    image: "/step1.png",
    title: "Create a Visawise account",
    description:
      "Sign up in seconds with just your email. No lengthy forms, no unnecessary details — just create your account and you're in.",
  },
  {
    number: "2",
    image: "/step2.png",
    title: "Build your personalized checklist",
    description:
      "Select your destination country, visa type, and employment status. We generate a checklist tailored exactly to your situation.",
  },
  {
    number: "3",
    image: "/step3.png",
    title: "Submit with confidence",
    description:
      "Check off documents as you gather them, mark your application as submitted, and log the outcome when you hear back.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-3 py-12 min-[1200px]:px-38 lg:py-24">
      <div className="mb-12 text-center">
        <p className="text-brand-green mb-3 text-xs font-semibold tracking-widest uppercase">
          How it works
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
          Get visa-ready in 3 steps
        </h2>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {steps.map((step, index) => (
          <>
            <div
              key={step.number}
              className="card-shadow flex flex-col overflow-hidden rounded-2xl bg-white md:flex-1"
            >
              <div className="m-3 overflow-hidden rounded-xl bg-neutral-100">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="px-5 pt-2 pb-6">
                <p className="mb-1.5 text-sm font-bold text-neutral-800">
                  {step.number}. {step.title}
                </p>
                <p className="text-sm leading-relaxed text-neutral-500">
                  {step.description}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                key={`arrow-${index}`}
                className="hidden shrink-0 items-center justify-center md:flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 text-neutral-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </>
        ))}
      </div>
    </section>
  );
}

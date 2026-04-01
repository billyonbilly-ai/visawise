import React from "react";
import Image from "next/image";

const steps = [
  {
    number: "1",
    image: "/step1.png",
    title: "Create a Visawise account",
    description:
      "Sign up in seconds with your email and password to get started.",
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

      <div className="flex flex-col gap-8 px-12 sm:px-38 md:px-40 lg:flex-row lg:gap-8 lg:px-0">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="card-shadow flex flex-1 flex-col overflow-hidden rounded-2xl bg-neutral-100 p-1.5">
              <div className="card-shadow flex h-full flex-1 flex-col overflow-hidden rounded-xl bg-white">
                <div className="relative aspect-video w-full overflow-hidden border-b border-b-neutral-200 bg-neutral-100">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="px-5 pt-4 pb-6">
                  <p className="mb-1.5 text-sm font-bold text-neutral-800">
                    {step.number}. {step.title}
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex shrink-0 items-center justify-center py-2 lg:block lg:self-center lg:py-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-5 w-5 rotate-90 text-neutral-400 lg:rotate-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

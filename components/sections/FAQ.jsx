"use client";
import { useState } from "react";

const faqs = [
  {
    question: "Is Visawise free to use?",
    answer:
      "Yes, the core features are completely free. Create an account, build personalized checklists, and track your applications at no cost. We plan to offer premium features in the future for power users.",
  },
  {
    question: "Which countries and visa types are supported?",
    answer:
      "We currently support the most common destinations for Nigerians which are United Kingdom, United States, Canada, and Schengen (Europe). We're actively adding more countries and visa types based on user demand.",
  },
  {
    question: "How is my checklist personalized?",
    answer:
      "When you create a new application, you select your destination country, visa type, and employment status. Visawise uses these to filter out documents that don't apply to your situation. So a self-employed applicant sees different requirements than a full-time employee.",
  },
  {
    question: "Can I have multiple visa applications at the same time?",
    answer:
      "Absolutely. You can create and track as many applications as you need simultaneously, for different countries, different visa types, or even multiple attempts at the same visa.",
  },
  {
    question: "What happens after I submit my application to the embassy?",
    answer:
      "Once you've physically submitted your application, you mark it as submitted on Visawise and we help you track the days. When you hear back from the embassy, you log the outcome, approved or rejected. This helps us build better insights for the community over time.",
  },
  {
    question: "Why should I log if my application was rejected?",
    answer:
      "Rejection data is anonymised and used to surface common rejection reasons for other Nigerians applying for the same visa. The more outcomes logged, the smarter our insights become, it's a community resource that benefits everyone.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. Your application data is private and only visible to you. We use Supabase with row-level security, meaning your data is protected at the database level, not just in the app.",
  },
  {
    question: "What is the Insights feature?",
    answer:
      "Insights is a premium feature coming soon. It will surface approval rates, common rejection reasons, and processing time data specific to Nigerian applicants, giving you a real edge when preparing your application.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section id="faq" className="px-3 py-12 min-[1200px]:px-38 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight md:text-4xl">
          FAQ
        </h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
                  isOpen
                    ? "bg-brand-black border-transparent"
                    : "card-shadow border-neutral-200 bg-white"
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span
                    className={`text-sm font-semibold ${
                      isOpen ? "text-white" : "text-neutral-800"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`ml-4 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-white" : "text-neutral-400"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

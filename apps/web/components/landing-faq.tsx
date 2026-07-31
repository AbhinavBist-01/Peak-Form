"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

const faqs = [
  {
    question: "Do respondents need to log in to fill out a form?",
    answer:
      "No. All PeakForms public links and QR codes allow respondents to submit answers instantaneously without creating an account or logging in.",
  },
  {
    question: "How does conditional branching logic work?",
    answer:
      "You can set simple If/Then rules based on earlier answers (e.g. rating < 3 stars) to show specific follow-up questions or jump to different form pages automatically.",
  },
  {
    question: "Can I export form responses to CSV?",
    answer:
      "Yes. You can export complete, un-truncated response datasets directly to CSV files with one click from your creator dashboard.",
  },
  {
    question: "Can I password-protect public form links?",
    answer:
      "Yes. You can set an optional password on any form link to restrict access to invited respondents or confidential team surveys.",
  },
  {
    question: "Is there an API for developers?",
    answer:
      "Yes. PeakForms exposes a fully typed REST API with Scalar documentation, allowing programmatically fetching submission data and form schemas.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-[#78726A]">
          Everything you need to know about PeakForms capabilities.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="rounded-xl border border-[#E5DFD5] bg-[#FFFDF9] transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="flex w-full items-center justify-between p-5 text-left text-sm font-medium text-[#2D2926] focus:outline-none"
              >
                <span>{faq.question}</span>
                <ChevronDownIcon
                  className={`size-4 text-[#78726A] transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#DA7756]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-[#E5DFD5] p-5 pt-3 text-xs leading-relaxed text-[#78726A] animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

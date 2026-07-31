"use client";

import { useState } from "react";
import {
  CheckIcon,
  ChevronRightIcon,
  RotateCcwIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";

export function LandingInteractivePreview() {
  const [step, setStep] = useState<number>(1);
  const [rating, setRating] = useState<number>(0);
  const [useCase, setUseCase] = useState<string>("Product Feedback");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const useCaseOptions = [
    "Product Feedback",
    "Customer Research",
    "Event RSVP",
    "Job Application",
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setStep(1);
    setRating(0);
    setUseCase("Product Feedback");
    setSubmitted(false);
  };

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E5DFD5] bg-[#FFFDF9] p-6 shadow-xs transition-all duration-200">
      {/* Top Header */}
      <div className="mb-5 flex items-center justify-between border-b border-[#E5DFD5] pb-3">
        <span className="font-mono text-xs text-[#78726A]">
          peakforms.live/f/preview
        </span>
        <span className="text-xs text-[#9E978F]">
          Step {step} of 2
        </span>
      </div>

      {!submitted ? (
        <div className="space-y-5">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <label className="block text-[#2D2926] peak-serif text-lg font-medium">
                What type of form are you building?
              </label>
              <div className="space-y-2">
                {useCaseOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setUseCase(option)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-xs font-medium transition-all ${
                      useCase === option
                        ? "border-[#DA7756] bg-[#F7EBE1] text-[#2D2926]"
                        : "border-[#E5DFD5] bg-white text-[#57524A] hover:border-[#D6CEC1] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <span>{option}</span>
                    {useCase === option && (
                      <CheckIcon className="size-4 text-[#DA7756]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <label className="block text-[#2D2926] peak-serif text-lg font-medium">
                How essential is smart branching for your workflow?
              </label>
              <div className="flex items-center justify-center gap-3 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <StarIcon
                      className={`size-6 transition-colors ${
                        star <= rating
                          ? "fill-[#DA7756] text-[#DA7756]"
                          : "text-[#E5DFD5] hover:text-[#DA7756]/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="text-xs text-[#78726A] hover:bg-[#F2ECE1] hover:text-[#2D2926]"
              >
                Back
              </Button>
            ) : (
              <span />
            )}

            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="rounded-xl bg-[#DA7756] px-4 text-xs font-medium text-white hover:bg-[#C66545]"
            >
              {step === 2 ? "Submit response" : "Next question"}
              <ChevronRightIcon className="ml-1 size-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        /* Submission Success Preview */
        <div className="space-y-4 py-6 text-center animate-in zoom-in-95 duration-200">
          <div className="mx-auto grid size-10 place-items-center rounded-full bg-[#F7EBE1] text-[#DA7756]">
            <SparklesIcon className="size-5" />
          </div>
          <div>
            <h4 className="peak-serif text-lg font-medium text-[#2D2926]">
              Response Recorded
            </h4>
            <p className="mt-1 text-xs text-[#78726A]">
              Logged seamlessly into PeakForms analytics.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="mt-2 border-[#E5DFD5] bg-white text-xs text-[#2D2926] hover:bg-[#F2ECE1]"
          >
            <RotateCcwIcon className="mr-1.5 size-3.5" />
            Try preview again
          </Button>
        </div>
      )}
    </div>
  );
}

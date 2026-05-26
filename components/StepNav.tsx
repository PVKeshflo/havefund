"use client";

const STEPS = [
  { number: 1, label: "Founder Brief" },
  { number: 2, label: "VC Discovery" },
  { number: 3, label: "Market Landscape" },
  { number: 4, label: "Stress Test" },
  { number: 5, label: "Final Output" },
];

interface StepNavProps {
  currentStep: number;
}

export default function StepNav({ currentStep }: StepNavProps) {
  return (
    <nav className="border-b border-[#E5E5E5] bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <span
            className="text-[13px] tracking-widest uppercase text-[#0A0A0A]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", letterSpacing: "0.12em" }}
          >
            HaveFund
          </span>
          <ol className="flex items-center gap-1 sm:gap-3">
            {STEPS.map((step, i) => {
              const isDone = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              const isFuture = step.number > currentStep;

              return (
                <li key={step.number} className="flex items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`
                        w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0
                        ${isDone ? "bg-[#0A0A0A] text-white" : ""}
                        ${isCurrent ? "border border-[#0A0A0A] text-[#0A0A0A]" : ""}
                        ${isFuture ? "border border-[#E5E5E5] text-[#A0A0A0]" : ""}
                      `}
                    >
                      {isDone ? (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </span>
                    <span
                      className={`
                        hidden sm:block text-[11px] tracking-wide uppercase
                        ${isCurrent ? "text-[#0A0A0A] font-medium" : ""}
                        ${isDone ? "text-[#0A0A0A]" : ""}
                        ${isFuture ? "text-[#A0A0A0]" : ""}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <span className="text-[#E5E5E5] text-xs hidden sm:block">—</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}

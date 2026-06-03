"use client";

const STEPS = [
  { number: 1, label: "Your Input" },
  { number: 2, label: "Email + VC Match" },
  { number: 3, label: "Market Landscape" },
  { number: 4, label: "Stress Test" },
  { number: 5, label: "Gantt Chart" },
];

interface StepNavProps {
  currentStep: number;
}

export default function StepNav({ currentStep }: StepNavProps) {
  return (
    <nav className="border-b-2 border-[#0A0A0A] bg-white sticky top-0 z-50 shadow-[0px_3px_0px_0px_#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Brand — lego-stud accent on the dot */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#DC2626] border-2 border-[#0A0A0A] flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A]">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>
            <span className="text-[15px] font-black tracking-tight text-[#0A0A0A]">
              GoHave<span className="text-[#DC2626]">Fund</span>
            </span>
          </div>

          {/* Step bricks */}
          <ol className="flex items-center gap-1">
            {STEPS.map((step, i) => {
              const isDone = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              const isFuture = step.number > currentStep;

              return (
                <li key={step.number} className="flex items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    {/* Step brick */}
                    <div
                      className={`
                        w-6 h-6 border-2 border-[#0A0A0A] flex items-center justify-center text-[9px] font-black shrink-0 relative transition-all
                        ${isDone ? "bg-[#DC2626] shadow-[2px_2px_0px_0px_#0A0A0A]" : ""}
                        ${isCurrent ? "bg-white shadow-[2px_2px_0px_0px_#DC2626] border-[#DC2626]" : ""}
                        ${isFuture ? "bg-white shadow-[2px_2px_0px_0px_#0A0A0A] opacity-40" : ""}
                      `}
                    >
                      {isDone ? (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className={isCurrent ? "text-[#DC2626]" : "text-[#0A0A0A]"}>
                          {step.number}
                        </span>
                      )}
                    </div>

                    <span
                      className={`
                        hidden sm:block text-[10px] tracking-widest uppercase font-black
                        ${isCurrent ? "text-[#DC2626]" : ""}
                        ${isDone ? "text-[#0A0A0A]" : ""}
                        ${isFuture ? "text-[#AAAAAA]" : ""}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div className="w-4 h-0.5 bg-[#E5E5E5] border-y border-[#DDDDDD] mx-0.5 hidden sm:block" />
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

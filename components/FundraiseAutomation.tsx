"use client";

import { useState } from "react";

interface StressTestReport {
  overallScore: number;
  strengths: string[];
  gaps: string[];
  suggestedNarrative: string;
}

interface Investor {
  name: string;
  focus: string;
  stage: string;
  location: string;
  notablePortfolio: string[];
  activeFund: string;
  whyMatch: string;
  website: string;
}

interface FundraiseAutomationProps {
  stressReport: StressTestReport | null;
  startupSummary: Record<string, string>;
  investors: Investor[];
  onStartOver: () => void;
}

function Studs({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-3 h-3 rounded-full bg-white/25 border border-white/50 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-white/60" />
        </div>
      ))}
    </div>
  );
}

function BrickBlock({
  accentColor,
  label,
  children,
}: {
  accentColor: "red" | "black";
  label: string;
  children: React.ReactNode;
}) {
  const bg = accentColor === "red" ? "bg-[#DC2626]" : "bg-[#0A0A0A]";
  return (
    <div className="border-2 border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] bg-white">
      <div className={`${bg} px-4 py-2.5 border-b-2 border-[#0A0A0A] flex items-center gap-3`}>
        <Studs count={3} />
        <span className="text-[10px] tracking-widest uppercase font-black text-white">{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function FundraiseAutomation({
  stressReport,
  startupSummary,
  investors,
  onStartOver,
}: FundraiseAutomationProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [regError, setRegError] = useState("");

  const score = stressReport?.overallScore ?? null;
  const scoreBarWidth = score !== null ? (score / 10) * 100 : 0;
  const scoreBarColor =
    score === null ? "bg-[#E5E5E5]" : score >= 8 ? "bg-[#16A34A]" : score >= 6 ? "bg-[#F59E0B]" : "bg-[#DC2626]";
  const scoreLabel =
    score === null ? "" : score >= 8 ? "Strong" : score >= 6 ? "Solid" : "Needs Work";

  const topVCs = investors.slice(0, 3);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    setSubmitting(true);
    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          startupName: startupSummary.name ?? "",
          startupSummary,
        }),
      });
      setSubmitted(true);
    } catch {
      setRegError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16 border-t-2 border-[#0A0A0A]">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-[10px] font-black tracking-widest uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] mb-5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-white/30 border border-white/50 flex items-center justify-center"
            >
              <div className="w-1 h-1 rounded-full bg-white/70" />
            </div>
          ))}
          Step 05
        </div>
        <h2 className="text-[46px] font-black leading-[1.05] text-[#0A0A0A] mb-3">
          Fundraise Automation
        </h2>
        <p className="text-[15px] text-[#555555] leading-relaxed border-l-4 border-[#DC2626] pl-4">
          Your pitch readiness score, what to sharpen, and how we take the fundraising grind off your plate.
        </p>
      </div>

      <div className="space-y-4">

        {/* ── Score ── */}
        {stressReport && (
          <BrickBlock accentColor="red" label="Pitch Readiness Score">
            <div className="flex items-start gap-6 flex-wrap">
              {/* Big number */}
              <div className="shrink-0 text-center">
                <p className="text-[11px] font-black tracking-widest uppercase text-[#555555] mb-2">Overall</p>
                <div className="border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] px-5 py-3 inline-block">
                  <span className="text-[56px] font-black leading-none text-[#0A0A0A]">{score}</span>
                  <span className="text-[24px] font-black text-[#AAAAAA]">/10</span>
                </div>
                <div className="mt-2">
                  <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 border-2 border-[#0A0A0A] ${
                    score! >= 8 ? "bg-[#16A34A] text-white" : score! >= 6 ? "bg-[#F59E0B] text-white" : "bg-[#DC2626] text-white"
                  }`}>
                    {scoreLabel}
                  </span>
                </div>
              </div>

              {/* Bar + narrative */}
              <div className="flex-1 min-w-0 space-y-3 pt-1">
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-[#555555] mb-1.5">Readiness</p>
                  <div className="w-full h-4 bg-[#E5E5E5] border-2 border-[#0A0A0A]">
                    <div
                      className={`h-full transition-all ${scoreBarColor}`}
                      style={{ width: `${scoreBarWidth}%` }}
                    />
                  </div>
                </div>
                <p className="text-[13px] text-[#555555] leading-relaxed italic border-l-4 border-[#DC2626] pl-3">
                  &ldquo;{stressReport.suggestedNarrative}&rdquo;
                </p>
              </div>
            </div>
          </BrickBlock>
        )}

        {/* ── Areas to improve ── */}
        {stressReport && stressReport.gaps.length > 0 && (
          <BrickBlock accentColor="black" label="What to Improve">
            <div className="space-y-2">
              {stressReport.gaps.map((gap, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border-2 border-[#0A0A0A] p-3 shadow-[2px_2px_0px_0px_#0A0A0A] bg-white"
                >
                  <div className="bg-[#DC2626] text-white text-[9px] font-black tracking-widest px-2 py-1 border border-[#0A0A0A] shrink-0 mt-0.5 min-w-[28px] text-center">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-[13px] text-[#0A0A0A] leading-snug">{gap}</p>
                </div>
              ))}
            </div>
          </BrickBlock>
        )}

        {/* ── The proposition ── */}
        <BrickBlock accentColor="red" label="Focus on Building. We Handle the Rest.">
          <div className="space-y-4">
            <p className="text-[20px] font-black text-[#0A0A0A] leading-snug">
              Founders like you should give 100% of their attention to building the startup.
            </p>
            <p className="text-[14px] text-[#555555] leading-relaxed">
              The best founders we know didn&apos;t close their round because they were great at sending cold emails. They closed because they had a great product — and someone else handled the introductions. That&apos;s what we&apos;re building.
            </p>
            <div className="space-y-2.5 pt-1">
              {[
                "We identify VCs actively deploying in your stage, industry, and country",
                "We review your profile and personally connect you with the right investors",
                "You only talk to people who are already interested — no cold outreach on your end",
                "No relationship-building grind. No cold email guesswork. Just build.",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-4 h-4 bg-[#DC2626] border-2 border-[#0A0A0A] shrink-0 mt-0.5 flex items-center justify-center shadow-[1px_1px_0px_0px_#0A0A0A]">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  </div>
                  <p className="text-[13px] text-[#0A0A0A] leading-snug">{point}</p>
                </div>
              ))}
            </div>
            <div className="border-2 border-[#0A0A0A] px-4 py-3 shadow-[2px_2px_0px_0px_#0A0A0A] bg-[#F5F5F5]">
              <p className="text-[11px] font-black tracking-widest uppercase text-[#555555] mb-1">Coming soon</p>
              <p className="text-[13px] text-[#0A0A0A]">This feature is in development. Register below and we&apos;ll notify you when it&apos;s live.</p>
            </div>
          </div>
        </BrickBlock>

        {/* ── Registration / Success ── */}
        {!submitted ? (
          <BrickBlock accentColor="black" label="Register Your Interest">
            <div className="space-y-4">
              <p className="text-[14px] text-[#555555] leading-relaxed">
                This feature is coming soon. Drop your email and we&apos;ll notify you the moment it&apos;s live — no spam, just one message when it&apos;s ready.
              </p>
              <form onSubmit={handleRegister} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-[#0A0A0A] px-4 py-3 text-[14px] text-[#0A0A0A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#DC2626] bg-white shadow-[3px_3px_0px_0px_#0A0A0A] focus:shadow-[3px_3px_0px_0px_#DC2626] transition-all"
                />
                {regError && (
                  <p className="text-[12px] text-[#DC2626] font-black">{regError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#DC2626] text-white py-4 text-[13px] font-black tracking-widest uppercase border-2 border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#0A0A0A] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? "Registering…" : "Notify Me When It's Live →"}
                </button>
              </form>
            </div>
          </BrickBlock>
        ) : (
          <div className="border-2 border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] bg-white">
            <div className="bg-[#DC2626] px-4 py-2.5 border-b-2 border-[#0A0A0A] flex items-center gap-3">
              <Studs count={3} />
              <span className="text-[10px] tracking-widest uppercase font-black text-white">
                You&apos;re In — Go Build
              </span>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[22px] font-black text-[#0A0A0A] leading-tight">
                You&apos;re on the list.
              </p>
              <p className="text-[14px] text-[#555555] leading-relaxed">
                We&apos;ll send you one email when the feature is live. Until then — go build.
              </p>
              {topVCs.length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] font-black tracking-widest uppercase text-[#555555] mb-3">
                    VCs that match your profile
                  </p>
                  <div className="space-y-2">
                    {topVCs.map((vc) => (
                      <div
                        key={vc.name}
                        className="flex items-center gap-3 border-2 border-[#0A0A0A] px-4 py-3 shadow-[2px_2px_0px_0px_#0A0A0A] bg-white"
                      >
                        <div className="w-2.5 h-2.5 bg-[#DC2626] border-2 border-[#0A0A0A] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-black text-[#0A0A0A] truncate">{vc.name}</p>
                          <p className="text-[11px] text-[#555555] truncate">{vc.location} · {vc.stage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Start over */}
        <button
          onClick={onStartOver}
          className="w-full bg-white text-[#0A0A0A] py-4 text-[13px] font-black tracking-widest uppercase border-2 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          Start Over
        </button>

      </div>
    </section>
  );
}

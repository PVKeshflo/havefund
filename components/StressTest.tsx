"use client";

import { useEffect, useState } from "react";
import FetchingNotice from "./FetchingNotice";

interface HistoryEntry {
  investorChallenge: string;
  founderResponse: string;
}

interface StressTestReport {
  overallScore: number;
  strengths: string[];
  gaps: string[];
  suggestedNarrative: string;
}

interface StressTestProps {
  startupSummary: Record<string, string>;
  onComplete: (report: StressTestReport) => void;
}

export default function StressTest({ startupSummary, onComplete }: StressTestProps) {
  const [round, setRound] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState("");
  const [challengeLoading, setChallengeLoading] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState<StressTestReport | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { fetchChallenge(1, [], undefined); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchChallenge(r: number, hist: HistoryEntry[], founderResp: string | undefined) {
    setChallengeLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stress-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          round: r,
          conversationHistory: hist,
          startupSummary,
          founderResponse: founderResp,
        }),
      });
      const text = await res.text();
      let data: { challenge?: string; error?: string };
      try { data = JSON.parse(text); } catch { throw new Error(`[${res.status}] ${text.slice(0, 300)}`); }
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setCurrentChallenge(data.challenge ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate challenge.");
    } finally {
      setChallengeLoading(false);
    }
  }

  async function handleSubmitResponse() {
    if (!input.trim() || submitting) return;
    setSubmitting(true);
    setError("");

    const resp = input.trim();
    setInput("");

    if (round < 3) {
      const newHistory = [...history, { investorChallenge: currentChallenge, founderResponse: resp }];
      setHistory(newHistory);
      setCurrentChallenge("");
      const nextRound = round + 1;
      setRound(nextRound);
      await fetchChallenge(nextRound, newHistory, resp);
      setSubmitting(false);
    } else {
      // Final round — fetch evaluation
      const finalHistory = [...history, { investorChallenge: currentChallenge, founderResponse: resp }];
      setHistory(finalHistory);
      try {
        const res = await fetch("/api/stress-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            round: 4,
            conversationHistory: finalHistory,
            startupSummary,
            founderResponse: resp,
          }),
        });
        const evalText = await res.text();
        let data: StressTestReport & { error?: string };
        try { data = JSON.parse(evalText); } catch { throw new Error(`[${res.status}] ${evalText.slice(0, 300)}`); }
        if (!res.ok) throw new Error(data.error || "Unknown error");
        setReport(data);
        onComplete(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Evaluation failed.");
      } finally {
        setSubmitting(false);
      }
    }
  }

  const allHistory = history.map((h, i) => [
    { type: "investor" as const, text: h.investorChallenge, roundLabel: `Round ${i + 1}` },
    { type: "founder" as const, text: h.founderResponse },
  ]).flat();

  return (
    <section className="max-w-2xl mx-auto px-6 py-16 border-t border-[#E5E5E5]">
      <div className="mb-12">
        <p className="text-[11px] tracking-widest uppercase font-bold text-[#DC2626] mb-3">Step 04</p>
        <h2
          className="text-[46px] font-black leading-[1.05] text-[#0A0A0A] mb-4"
          
        >
          Stress Test
        </h2>
        <p className="text-[15px] text-[#555555] leading-relaxed">
          Three rounds with a skeptical investor. Defend your thesis. Sharpen your narrative.
        </p>
      </div>

      {/* Round indicator */}
      {!report && (
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((r) => (
            <div
              key={r}
              className={`h-1 flex-1 transition-colors ${
                r < round ? "bg-[#0A0A0A]" : r === round ? "bg-[#555555]" : "bg-[#E5E5E5]"
              }`}
            />
          ))}
        </div>
      )}

      {/* Chat history */}
      <div className="space-y-4 mb-6">
        {allHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === "founder" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-5 py-4 ${
                msg.type === "investor"
                  ? "border border-[#E5E5E5] bg-white"
                  : "bg-[#0A0A0A] text-white"
              }`}
            >
              {msg.type === "investor" && (
                <p className="text-[10px] tracking-widest uppercase text-[#555555] mb-2">
                  {"roundLabel" in msg ? msg.roundLabel : ""} — Investor
                </p>
              )}
              <p
                className={`text-[14px] leading-relaxed ${
                  msg.type === "investor"
                    ? "text-[#0A0A0A] italic"
                    : "text-white"
                }`}
                style={msg.type === "investor" ? { fontFamily: "var(--font-instrument-serif), Georgia, serif" } : {}}
              >
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        {/* Current challenge */}
        {!report && (
          <div className="flex justify-start">
            <div className="max-w-[85%] border border-[#E5E5E5] bg-white px-5 py-4">
              <p className="text-[10px] tracking-widest uppercase text-[#555555] mb-2">
                Round {round} — Investor
              </p>
              {challengeLoading ? (
                <div>
                  <FetchingNotice
                    title={
                      round === 1
                        ? "The investor is reviewing your brief…"
                        : round === 2
                        ? "Analysing your response and preparing follow-up…"
                        : round === 4
                        ? "Evaluating your performance across all 3 rounds…"
                        : "Preparing the final challenge…"
                    }
                    detail={
                      round === 1
                        ? "Generating your first tough question."
                        : round === 4
                        ? "Scoring strengths, gaps, and drafting your 'why us' narrative."
                        : "This usually takes a few seconds."
                    }
                  />
                  <div className="space-y-2 mt-2">
                    <div className="h-4 bg-[#F0F0F0] rounded animate-pulse w-full" />
                    <div className="h-4 bg-[#F0F0F0] rounded animate-pulse w-4/5" />
                  </div>
                </div>
              ) : (
                <p
                  className="text-[14px] leading-relaxed text-[#0A0A0A] italic"
                  
                >
                  {currentChallenge}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      {!report && !challengeLoading && (
        <div className="border border-[#E5E5E5] focus-within:border-[#0A0A0A] transition-colors">
          <textarea
            rows={3}
            className="w-full px-5 py-4 text-[14px] text-[#0A0A0A] placeholder-[#555555] resize-none focus:outline-none"
            placeholder="Your response..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitResponse();
            }}
          />
          <div className="flex items-center justify-between border-t border-[#E5E5E5] px-5 py-3">
            <span className="text-[11px] text-[#555555]">⌘↵ to submit</span>
            <button
              onClick={handleSubmitResponse}
              disabled={!input.trim() || submitting}
              className="text-[11px] tracking-widest uppercase bg-[#0A0A0A] text-white px-5 py-2 hover:bg-[#2a2a2a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting
                ? round === 3
                  ? "Evaluating..."
                  : "Sending..."
                : round === 3
                ? "Submit Final Response →"
                : `Respond — Round ${round} of 3`}
            </button>
          </div>
        </div>
      )}

      {submitting && round === 3 && (
        <FetchingNotice
          title="Evaluating your performance…"
          detail="Scoring all 3 rounds and drafting your suggested narrative — takes around 10 seconds."
        />
      )}

      {error && (
        <p className="text-[13px] text-[#0A0A0A] border border-[#E5E5E5] px-4 py-3 mt-4">{error}</p>
      )}

      {/* Report */}
      {report && (
        <div className="mt-12 border border-[#E5E5E5]">
          <div className="p-6 border-b border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-[24px] text-[#0A0A0A]"
                
              >
                Stress Test Report
              </h3>
              <div className="text-right">
                <p className="text-[11px] tracking-widest uppercase text-[#555555] mb-0.5">Overall Score</p>
                <p
                  className="text-[36px] leading-none text-[#0A0A0A]"
                  
                >
                  {report.overallScore}<span className="text-[20px] text-[#555555]">/10</span>
                </p>
              </div>
            </div>
            <p
              className="text-[20px] leading-relaxed text-[#0A0A0A] italic"
              
            >
              &ldquo;{report.suggestedNarrative}&rdquo;
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-6 border-b sm:border-b-0 sm:border-r border-[#E5E5E5]">
              <p className="text-[11px] tracking-widest uppercase text-[#555555] mb-4">Strengths</p>
              <ul className="space-y-3">
                {report.strengths.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[13px] text-[#0A0A0A] leading-relaxed">
                    <span className="text-[#555555] shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6">
              <p className="text-[11px] tracking-widest uppercase text-[#555555] mb-4">Gaps to Address</p>
              <ul className="space-y-3">
                {report.gaps.map((g, i) => (
                  <li key={i} className="flex gap-3 text-[13px] text-[#0A0A0A] leading-relaxed">
                    <span className="text-[#555555] shrink-0">△</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

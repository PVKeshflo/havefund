"use client";

import { useState } from "react";

interface Investor {
  name: string;
  focus: string;
  stage: string;
  location: string;
  notablePortfolio: string[];
  contactHint: string;
  website: string;
}

interface MarketData {
  marketSize: { tam: string; sam: string; som: string };
  keyTrends: string[];
  competitors: { name: string; positioning: string; funding: string }[];
  tailwinds: string[];
  risks: string[];
}

interface StressTestReport {
  overallScore: number;
  strengths: string[];
  gaps: string[];
  suggestedNarrative: string;
}

interface FinalOutputProps {
  refinedEmail: string;
  investors: Investor[];
  marketData: MarketData;
  stressReport: StressTestReport;
  onStartOver: () => void;
}

export default function FinalOutput({
  refinedEmail,
  investors,
  marketData,
  stressReport,
  onStartOver,
}: FinalOutputProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(refinedEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  function exportPDF() {
    window.print();
  }

  const topThreeVCs = investors.slice(0, 3);

  return (
    <section className="max-w-2xl mx-auto px-6 py-16 border-t border-[#E5E5E5]">
      <div className="mb-12">
        <p className="text-[11px] tracking-widest uppercase font-bold text-[#DC2626] mb-3">Step 05</p>
        <h2
          className="text-[46px] font-black leading-[1.05] text-[#0A0A0A] mb-4"
          
        >
          Final Output
        </h2>
        <p className="text-[15px] text-[#555555] leading-relaxed">
          Everything refined and ready. Your investor package, distilled.
        </p>
      </div>

      <div className="space-y-16">
        {/* Refined Email */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-[28px] text-[#0A0A0A]"
              
            >
              Investor Communication
            </h3>
            <button
              onClick={copyEmail}
              className="text-[11px] tracking-widest uppercase border border-[#E5E5E5] px-4 py-2 hover:bg-[#F5F5F5] transition-colors"
            >
              {copiedEmail ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div className="border border-[#E5E5E5] p-6">
            <pre className="text-[14px] leading-relaxed text-[#0A0A0A] whitespace-pre-wrap font-sans">
              {refinedEmail}
            </pre>
          </div>
        </div>

        {/* VC Shortlist */}
        {topThreeVCs.length > 0 && (
          <div>
            <h3
              className="text-[28px] font-black text-[#0A0A0A] mb-6"
              
            >
              Recommended VCs
            </h3>
            <div className="space-y-px border border-[#E5E5E5]">
              {topThreeVCs.map((inv, i) => (
                <div
                  key={inv.name}
                  className="flex items-start gap-5 p-5 border-b border-[#E5E5E5] last:border-0 hover:bg-[#F5F5F5] transition-colors"
                >
                  <span
                    className="text-[24px] text-[#E5E5E5] shrink-0"
                    
                  >
                    0{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className="text-[18px] text-[#0A0A0A]"
                        
                      >
                        {inv.name}
                      </p>
                      <span className="text-[10px] tracking-widest uppercase border border-[#E5E5E5] px-2 py-0.5 text-[#555555] shrink-0">
                        {inv.stage}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#555555] mt-1">{inv.location}</p>
                    <p className="text-[13px] text-[#0A0A0A] mt-2 leading-snug">{inv.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Snapshot */}
        <div>
          <h3
            className="text-[28px] font-black text-[#0A0A0A] mb-6"
            
          >
            Market Snapshot
          </h3>
          <div className="border border-[#E5E5E5] divide-y divide-[#E5E5E5]">
            <div className="flex gap-4 p-5">
              <span className="text-[10px] tracking-widest uppercase text-[#555555] w-16 shrink-0 pt-0.5">TAM</span>
              <p className="text-[14px] text-[#0A0A0A]">{marketData.marketSize.tam}</p>
            </div>
            <div className="flex gap-4 p-5">
              <span className="text-[10px] tracking-widest uppercase text-[#555555] w-16 shrink-0 pt-0.5">Trend</span>
              <p className="text-[14px] text-[#0A0A0A]">{marketData.keyTrends[0]}</p>
            </div>
            <div className="flex gap-4 p-5">
              <span className="text-[10px] tracking-widest uppercase text-[#555555] w-16 shrink-0 pt-0.5">Rival</span>
              <p className="text-[14px] text-[#0A0A0A]">
                {marketData.competitors[0]?.name} — {marketData.competitors[0]?.positioning}
              </p>
            </div>
          </div>
        </div>

        {/* Stress Test Summary */}
        <div>
          <h3
            className="text-[28px] font-black text-[#0A0A0A] mb-6"
            
          >
            Stress Test
          </h3>
          <div className="border border-[#E5E5E5] p-6">
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[#E5E5E5]">
              <div>
                <p className="text-[11px] tracking-widest uppercase text-[#555555] mb-1">Pitch Score</p>
                <p
                  className="text-[48px] leading-none text-[#0A0A0A]"
                  
                >
                  {stressReport.overallScore}
                  <span className="text-[24px] text-[#555555]">/10</span>
                </p>
              </div>
              <div className="w-px h-16 bg-[#E5E5E5]" />
              <p className="text-[13px] text-[#555555]">
                {stressReport.overallScore >= 8
                  ? "Strong pitch. Minor refinements needed."
                  : stressReport.overallScore >= 6
                  ? "Solid foundation. Address the identified gaps."
                  : "Needs significant sharpening before investor meetings."}
              </p>
            </div>
            <p
              className="text-[20px] leading-relaxed text-[#0A0A0A] italic"
              
            >
              &ldquo;{stressReport.suggestedNarrative}&rdquo;
            </p>
            <p className="text-[11px] tracking-widest uppercase text-[#555555] mt-3">
              Suggested &ldquo;Why Us&rdquo; Narrative
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={exportPDF}
            className="flex-1 bg-[#0A0A0A] text-white py-4 text-[13px] tracking-widest uppercase hover:bg-[#2a2a2a] transition-colors"
          >
            Export as PDF
          </button>
          <button
            onClick={onStartOver}
            className="flex-1 border border-[#E5E5E5] py-4 text-[13px] tracking-widest uppercase text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </section>
  );
}

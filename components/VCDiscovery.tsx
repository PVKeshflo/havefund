"use client";

import { useEffect, useState } from "react";
import { CardSkeleton } from "./Skeleton";
import FetchingNotice from "./FetchingNotice";

interface Investor {
  name: string;
  focus: string;
  stage: string;
  location: string;
  notablePortfolio: string[];
  activeFund: string;
  lastInvestment: string;
  website: string;
}

interface VCDiscoveryProps {
  country: string;
  stage: string;
  industry: string;
  startupSummary: Record<string, string>;
  onComplete: (investors: Investor[]) => void;
}

export default function VCDiscovery({ country, stage, industry, startupSummary, onComplete }: VCDiscoveryProps) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchInvestors() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, stage, industry, startupSummary }),
      });
      const text = await res.text();
      let data: { investors?: Investor[]; error?: string };
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`[${res.status}] ${text.slice(0, 300)}`);
      }
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setInvestors(data.investors || []);
      onComplete(data.investors || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load investors.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchInvestors(); }, [onComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="max-w-2xl mx-auto px-6 py-16 border-t-2 border-[#0A0A0A]">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-[10px] font-black tracking-widest uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] mb-5">
          {[0, 1].map((i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/30 border border-white/50 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/70" />
            </div>
          ))}
          Step 02
        </div>
        <h2 className="text-[46px] font-black leading-[1.05] text-[#0A0A0A] mb-3">
          Email + VC Match
        </h2>
        <p className="text-[15px] text-[#555555] leading-relaxed border-l-4 border-[#DC2626] pl-4">
          Investors actively deploying in your stage, industry, and geography. <span className="font-black text-[#0A0A0A]">Active Fund</span> confirms they have capital to deploy. <span className="font-black text-[#0A0A0A]">Last Deal</span> confirms they are still making investments.
        </p>
      </div>

      {loading && (
        <div className="space-y-4">
          <FetchingNotice
            title="Researching investors for your startup…"
            detail={`Matching ${stage} funds active in ${country} and ${industry} — this takes 15–30 seconds.`}
          />
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {error && !loading && (
        <div className="border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] px-6 py-8 text-center bg-white">
          <p className="text-[14px] text-[#0A0A0A] mb-4">{error}</p>
          <button
            onClick={fetchInvestors}
            className="text-[11px] tracking-widest uppercase font-black border-2 border-[#0A0A0A] px-6 py-3 shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#0A0A0A] transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && investors.length === 0 && (
        <div className="border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] px-6 py-8 text-center bg-white">
          <p className="text-[14px] text-[#555555] mb-4">No investors found for these criteria.</p>
          <button
            onClick={fetchInvestors}
            className="text-[11px] tracking-widest uppercase font-black border-2 border-[#0A0A0A] px-6 py-3 shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#0A0A0A] transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && investors.length > 0 && (
        <div className="space-y-3">
          {investors.map((inv, idx) => (
            <div
              key={inv.name}
              className="border-2 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A] bg-white"
            >
              {/* Card header — lego brick strip */}
              <div className="bg-[#DC2626] px-4 py-2.5 border-b-2 border-[#0A0A0A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-white/25 border border-white/50 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-white/60" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] tracking-widest uppercase font-black text-white">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] tracking-widest uppercase font-black text-white/70 border border-white/30 px-2 py-0.5">
                  {inv.stage}
                </span>
              </div>

              {/* Card body */}
              <div className="p-5 space-y-4">
                {/* Name + location */}
                <div>
                  <h3 className="text-[20px] font-black text-[#0A0A0A] leading-tight">{inv.name}</h3>
                  <p className="text-[12px] text-[#555555] mt-0.5">{inv.location}</p>
                </div>

                {/* Focus */}
                <p className="text-[13px] text-[#0A0A0A] leading-relaxed">{inv.focus}</p>

                {/* Portfolio tags */}
                {inv.notablePortfolio?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {inv.notablePortfolio.map((co) => (
                      <span
                        key={co}
                        className="text-[10px] font-black uppercase tracking-wide text-[#0A0A0A] border-2 border-[#0A0A0A] px-2 py-0.5 shadow-[1px_1px_0px_0px_#0A0A0A]"
                      >
                        {co}
                      </span>
                    ))}
                  </div>
                )}

                {/* Website link */}
                {inv.website && (
                  <a
                    href={inv.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#DC2626] border-2 border-[#DC2626] px-3 py-1.5 shadow-[2px_2px_0px_0px_#DC2626] hover:bg-[#DC2626] hover:text-white transition-all"
                  >
                    {inv.website.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
                  </a>
                )}

                {/* Active fund + last investment */}
                <div className="space-y-2 pt-1">
                  {inv.activeFund && (
                    <div className="flex items-start gap-3 border-2 border-[#0A0A0A] px-3 py-2.5 shadow-[2px_2px_0px_0px_#0A0A0A]">
                      <span className="text-[9px] font-black tracking-widest uppercase text-white bg-[#0A0A0A] px-2 py-1 shrink-0 mt-0.5">
                        Fund
                      </span>
                      <p className="text-[12px] text-[#0A0A0A] leading-snug">{inv.activeFund}</p>
                    </div>
                  )}
                  {inv.lastInvestment && (
                    <div className="flex items-start gap-3 border-2 border-[#DC2626] px-3 py-2.5 shadow-[2px_2px_0px_0px_#DC2626]">
                      <span className="text-[9px] font-black tracking-widest uppercase text-white bg-[#DC2626] px-2 py-1 shrink-0 mt-0.5">
                        Last
                      </span>
                      <p className="text-[12px] text-[#0A0A0A] leading-snug">{inv.lastInvestment}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

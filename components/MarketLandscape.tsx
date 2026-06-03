"use client";

import { useEffect, useState } from "react";
import Skeleton, { SkeletonLine, TableSkeleton } from "./Skeleton";
import FetchingNotice from "./FetchingNotice";

interface MarketData {
  marketSize: { tam: string; sam: string; som: string };
  keyTrends: string[];
  competitors: { name: string; positioning: string; funding: string }[];
  tailwinds: string[];
  risks: string[];
}

interface MarketLandscapeProps {
  industry: string;
  startupSummary: Record<string, string>;
  onComplete: (data: MarketData) => void;
}

export default function MarketLandscape({ industry, startupSummary, onComplete }: MarketLandscapeProps) {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMarket() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, startupSummary }),
      });
      const text = await res.text();
      let json: MarketData & { error?: string };
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`[${res.status}] ${text.slice(0, 300)}`);
      }
      if (!res.ok) throw new Error(json.error || "Unknown error");
      setData(json);
      onComplete(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load market data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMarket(); }, [onComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="max-w-2xl mx-auto px-6 py-16 border-t border-[#E5E5E5]">
      <div className="mb-12">
        <p className="text-[11px] tracking-widest uppercase text-[#555555] mb-3">Step 03</p>
        <h2
          className="text-[42px] leading-[1.1] text-[#0A0A0A] mb-4"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          Market Landscape
        </h2>
        <p className="text-[15px] text-[#555555] leading-relaxed">
          TAM, trends, competition, and the forces shaping your market.
        </p>
      </div>

      {loading && (
        <div className="space-y-12">
          <FetchingNotice
            title="Analysing market landscape…"
            detail={`Researching ${industry} market size, competitors, and trends in ${startupSummary.country || "your region"} — this takes 15–30 seconds.`}
          />
          <div className="grid grid-cols-3 gap-px border border-[#E5E5E5]">
            {["TAM", "SAM", "SOM"].map((label) => (
              <div key={label} className="p-6 border-r border-[#E5E5E5] last:border-0">
                <p className="text-[11px] tracking-widest uppercase text-[#555555] mb-3">{label}</p>
                <SkeletonLine width="70%" className="h-5" />
                <SkeletonLine width="90%" className="h-3 mt-2" />
              </div>
            ))}
          </div>
          <Skeleton lines={5} />
          <TableSkeleton />
          <div className="grid grid-cols-2 gap-8">
            <Skeleton lines={3} />
            <Skeleton lines={3} />
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="border border-[#E5E5E5] px-6 py-8 text-center">
          <p className="text-[14px] text-[#0A0A0A] mb-4">{error}</p>
          <button
            onClick={fetchMarket}
            className="text-[11px] tracking-widest uppercase border border-[#0A0A0A] px-6 py-3 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && data && (
        <div className="space-y-16">
          {/* Market Size */}
          <div>
            <h3
              className="text-[13px] tracking-widest uppercase text-[#555555] mb-6"
            >
              Market Size
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-[#E5E5E5]">
              {[
                { label: "TAM", value: data.marketSize.tam },
                { label: "SAM", value: data.marketSize.sam },
                { label: "SOM", value: data.marketSize.som },
              ].map(({ label, value }) => (
                <div key={label} className="p-6 border-b sm:border-b-0 sm:border-r border-[#E5E5E5] last:border-0">
                  <p className="text-[11px] tracking-widest uppercase text-[#555555] mb-2">{label}</p>
                  <p
                    className="text-[20px] leading-tight text-[#0A0A0A]"
                    style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                  >
                    {value.split(" ")[0]}
                  </p>
                  <p className="text-[12px] text-[#555555] mt-1 leading-snug">
                    {value.split(" ").slice(1).join(" ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Trends */}
          <div>
            <h3
              className="text-[28px] text-[#0A0A0A] mb-6"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              Key Trends
            </h3>
            <ol className="space-y-4">
              {data.keyTrends.map((trend, i) => (
                <li key={i} className="flex gap-6 py-4 border-b border-[#E5E5E5] last:border-0">
                  <span
                    className="text-[32px] leading-none text-[#E5E5E5] shrink-0 w-8"
                    style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[14px] text-[#0A0A0A] leading-relaxed pt-1">{trend}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Competitors */}
          <div>
            <h3
              className="text-[28px] text-[#0A0A0A] mb-6"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              Competitive Landscape
            </h3>
            <div className="border border-[#E5E5E5]">
              <div className="grid grid-cols-3 border-b border-[#E5E5E5] bg-[#F5F5F5]">
                <div className="px-4 py-3 text-[10px] tracking-widest uppercase text-[#555555]">Name</div>
                <div className="px-4 py-3 text-[10px] tracking-widest uppercase text-[#555555] border-l border-[#E5E5E5]">Positioning</div>
                <div className="px-4 py-3 text-[10px] tracking-widest uppercase text-[#555555] border-l border-[#E5E5E5]">Funding</div>
              </div>
              {data.competitors.map((comp, i) => (
                <div key={i} className="grid grid-cols-3 border-b border-[#E5E5E5] last:border-0">
                  <div className="px-4 py-4 text-[13px] font-medium text-[#0A0A0A]">{comp.name}</div>
                  <div className="px-4 py-4 text-[13px] text-[#0A0A0A] border-l border-[#E5E5E5]">{comp.positioning}</div>
                  <div className="px-4 py-4 text-[12px] text-[#555555] border-l border-[#E5E5E5]">{comp.funding}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tailwinds & Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3
                className="text-[22px] text-[#0A0A0A] mb-5"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                Tailwinds
              </h3>
              <ul className="space-y-3">
                {data.tailwinds.map((t, i) => (
                  <li key={i} className="flex gap-3 text-[13px] text-[#0A0A0A] leading-relaxed">
                    <span className="text-[#555555] shrink-0">↑</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3
                className="text-[22px] text-[#0A0A0A] mb-5"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                Risks
              </h3>
              <ul className="space-y-3">
                {data.risks.map((r, i) => (
                  <li key={i} className="flex gap-3 text-[13px] text-[#0A0A0A] leading-relaxed">
                    <span className="text-[#555555] shrink-0">↓</span>
                    {r}
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

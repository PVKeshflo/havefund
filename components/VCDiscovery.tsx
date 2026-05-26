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
  contactHint: string;
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
  const [outreachMap, setOutreachMap] = useState<Record<string, string>>({});
  const [outreachLoading, setOutreachLoading] = useState<Record<string, boolean>>({});
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  async function fetchInvestors() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, stage, industry, startupSummary }),
      });
      const data = await res.json();
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

  async function draftOutreach(investor: Investor) {
    setOutreachLoading((prev) => ({ ...prev, [investor.name]: true }));
    try {
      const res = await fetch("/api/draft-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investor, startupSummary }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setOutreachMap((prev) => ({ ...prev, [investor.name]: data.email }));
    } catch {
      setOutreachMap((prev) => ({ ...prev, [investor.name]: "Failed to generate. Please try again." }));
    } finally {
      setOutreachLoading((prev) => ({ ...prev, [investor.name]: false }));
    }
  }

  async function copyOutreach(name: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [name]: true }));
    setTimeout(() => setCopiedMap((prev) => ({ ...prev, [name]: false })), 2000);
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16 border-t border-[#E5E5E5]">
      <div className="mb-12">
        <p className="text-[11px] tracking-widest uppercase text-[#A0A0A0] mb-3">Step 02</p>
        <h2
          className="text-[42px] leading-[1.1] text-[#0A0A0A] mb-4"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          VC Discovery
        </h2>
        <p className="text-[15px] text-[#A0A0A0] leading-relaxed">
          Investors matched to your stage, industry, and geography — with personalised outreach drafts.
        </p>
      </div>

      {loading && (
        <div>
          <FetchingNotice
            title="Researching investors for your startup…"
            detail={`Matching ${stage} funds active in ${country} and ${industry} — this takes 15–30 seconds.`}
          />
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="border border-[#E5E5E5] px-6 py-8 text-center">
          <p className="text-[14px] text-[#0A0A0A] mb-4">{error}</p>
          <button
            onClick={fetchInvestors}
            className="text-[11px] tracking-widest uppercase border border-[#0A0A0A] px-6 py-3 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && investors.length === 0 && (
        <div className="border border-[#E5E5E5] px-6 py-8 text-center">
          <p className="text-[14px] text-[#A0A0A0]">No investors found for these criteria.</p>
          <button onClick={fetchInvestors} className="mt-4 text-[11px] tracking-widest uppercase underline underline-offset-2">
            Try Again
          </button>
        </div>
      )}

      {!loading && investors.length > 0 && (
        <div className="space-y-px border border-[#E5E5E5]">
          {investors.map((inv) => (
            <div key={inv.name} className="border-b border-[#E5E5E5] last:border-0">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3
                      className="text-[22px] leading-tight text-[#0A0A0A] mb-1"
                      style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                    >
                      {inv.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] tracking-widest uppercase border border-[#E5E5E5] px-2 py-0.5 text-[#A0A0A0]">
                        {inv.stage}
                      </span>
                      <span className="text-[12px] text-[#A0A0A0]">{inv.location}</span>
                    </div>
                  </div>
                  {inv.website && (
                    <a
                      href={inv.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] tracking-widest uppercase text-[#A0A0A0] hover:text-[#0A0A0A] transition-colors shrink-0"
                    >
                      ↗
                    </a>
                  )}
                </div>

                <p className="text-[13px] text-[#0A0A0A] leading-relaxed mb-3">{inv.focus}</p>

                {inv.notablePortfolio?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {inv.notablePortfolio.map((co) => (
                      <span key={co} className="text-[11px] text-[#A0A0A0] bg-[#F5F5F5] px-2 py-0.5">
                        {co}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-[12px] text-[#A0A0A0] italic mb-4">{inv.contactHint}</p>

                <button
                  onClick={() => draftOutreach(inv)}
                  disabled={outreachLoading[inv.name] || !!outreachMap[inv.name]}
                  className="text-[11px] tracking-widest uppercase border border-[#0A0A0A] px-4 py-2 hover:bg-[#0A0A0A] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {outreachLoading[inv.name]
                    ? "Drafting..."
                    : outreachMap[inv.name]
                    ? "Drafted ✓"
                    : "Draft Outreach →"}
                </button>
              </div>

              {outreachMap[inv.name] && (
                <div className="border-t border-[#E5E5E5] bg-[#F5F5F5] p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] tracking-widest uppercase text-[#A0A0A0]">
                      Cold Email Draft
                    </span>
                    <button
                      onClick={() => copyOutreach(inv.name, outreachMap[inv.name])}
                      className="text-[11px] tracking-widest uppercase border border-[#E5E5E5] bg-white px-3 py-1.5 hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] transition-colors"
                    >
                      {copiedMap[inv.name] ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-[13px] leading-relaxed text-[#0A0A0A] whitespace-pre-wrap font-sans">
                    {outreachMap[inv.name]}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

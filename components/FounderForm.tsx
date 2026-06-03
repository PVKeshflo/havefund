"use client";

import { useState } from "react";
import FetchingNotice from "./FetchingNotice";

export interface FounderBrief {
  startupName: string;
  oneLiner: string;
  industry: string;
  country: string;
  stage: string;
  amountRaising: string;
  problem: string;
  solution: string;
  traction: string;
  investorDraft: string;
}

interface FounderFormProps {
  onComplete: (brief: FounderBrief, refinedEmail: string, startupSummary: Record<string, string>) => void;
}

const INDUSTRIES = ["Fintech", "Healthtech", "SaaS", "DeepTech", "Consumer", "Climate", "EdTech", "Other"];
const STAGES = ["Pre-seed", "Seed", "Series A", "Series B+"];

const inputClass =
  "w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-[14px] text-[#0A0A0A] placeholder-[#999999] focus:outline-none focus:border-[#DC2626] transition-colors bg-white";

const labelClass = "block text-[11px] tracking-widest uppercase font-bold text-[#555555] mb-2";

export default function FounderForm({ onComplete }: FounderFormProps) {
  const [form, setForm] = useState<FounderBrief>({
    startupName: "",
    oneLiner: "",
    industry: "SaaS",
    country: "",
    stage: "Seed",
    amountRaising: "",
    problem: "",
    solution: "",
    traction: "",
    investorDraft: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refinedEmail, setRefinedEmail] = useState("");
  const [copied, setCopied] = useState(false);

  function set(field: keyof FounderBrief) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setRefinedEmail(data.refinedEmail);
      onComplete(form, data.refinedEmail, data.startupSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyEmail() {
    await navigator.clipboard.writeText(refinedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-[11px] tracking-widest uppercase font-bold text-[#DC2626] mb-3">Step 01</p>
        <h1 className="text-[46px] font-black leading-[1.05] text-[#0A0A0A] mb-4">
          Founder Brief
        </h1>
        <p className="text-[16px] text-[#555555] leading-relaxed">
          Tell us about your startup. We&apos;ll refine your investor communication and unlock the full analysis suite.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Startup Name</label>
            <input
              className={inputClass}
              placeholder="Acme Inc."
              value={form.startupName}
              onChange={set("startupName")}
              required
            />
          </div>
          <div>
            <label className={labelClass}>One-liner / Tagline</label>
            <input
              className={inputClass}
              placeholder="The Stripe for insurance claims"
              value={form.oneLiner}
              onChange={set("oneLiner")}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Industry</label>
            <select className={inputClass} value={form.industry} onChange={set("industry")}>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Stage</label>
            <select className={inputClass} value={form.stage} onChange={set("stage")}>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Amount Raising</label>
            <input
              className={inputClass}
              placeholder="$2M"
              value={form.amountRaising}
              onChange={set("amountRaising")}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Country of Incorporation</label>
          <input
            className={inputClass}
            placeholder="United States"
            value={form.country}
            onChange={set("country")}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Problem Being Solved</label>
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Describe the specific pain point your startup addresses..."
            value={form.problem}
            onChange={set("problem")}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Solution &amp; Product</label>
          <textarea
            className={inputClass}
            rows={3}
            placeholder="How does your product solve the problem? What's the core mechanism?"
            value={form.solution}
            onChange={set("solution")}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Traction &amp; Key Metrics</label>
          <textarea
            className={inputClass}
            rows={2}
            placeholder="ARR, users, growth rate, notable customers, partnerships..."
            value={form.traction}
            onChange={set("traction")}
          />
        </div>

        <div>
          <label className={labelClass}>Current Investor Email / Post Draft</label>
          <textarea
            className={inputClass}
            rows={5}
            placeholder="Paste your current draft here — we'll sharpen it into something investors will actually respond to."
            value={form.investorDraft}
            onChange={set("investorDraft")}
            required
          />
        </div>

        {error && (
          <div className="border border-[#E5E5E5] rounded-lg px-4 py-3 text-[13px] text-[#0A0A0A] flex items-center justify-between">
            <span>{error}</span>
            <button type="submit" className="text-[11px] tracking-widest uppercase underline underline-offset-2 text-[#DC2626]">
              Retry
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#DC2626] text-white rounded-lg py-4 text-[13px] font-bold tracking-widest uppercase hover:bg-[#b91c1c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Analysing..." : "Analyse & Continue →"}
        </button>

        {loading && (
          <FetchingNotice
            title="Refining your investor communication…"
            detail="We're sharpening your pitch and extracting your startup profile — this takes 10–20 seconds."
          />
        )}
      </form>

      {refinedEmail && (
        <div className="mt-12 border-t border-[#E5E5E5] pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[26px] font-black text-[#0A0A0A]">
              Refined Investor Communication
            </h2>
            <button
              onClick={copyEmail}
              className="text-[11px] tracking-widest uppercase font-bold border border-[#E5E5E5] rounded-lg px-4 py-2 hover:bg-[#F5F5F5] transition-colors"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div className="border border-[#E5E5E5] rounded-lg p-6">
            <pre className="text-[14px] leading-relaxed text-[#0A0A0A] whitespace-pre-wrap font-sans">
              {refinedEmail}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}

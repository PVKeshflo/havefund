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
}

interface FounderFormProps {
  onComplete: (brief: FounderBrief, refinedEmail: string, startupSummary: Record<string, string>) => void;
}

const INDUSTRIES = ["Fintech", "Healthtech", "SaaS", "DeepTech", "Consumer", "Climate", "EdTech", "Other"];
const STAGES = ["Pre-seed", "Seed", "Series A", "Series B+"];
const CHAR_LIMIT = 250;

const inputClass =
  "w-full border-2 border-[#0A0A0A] px-4 py-3 text-[14px] text-[#0A0A0A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#DC2626] transition-all bg-white shadow-[3px_3px_0px_0px_#0A0A0A] focus:shadow-[3px_3px_0px_0px_#DC2626]";

const labelClass = "block text-[10px] tracking-widest uppercase font-black text-[#0A0A0A] mb-2";

interface LimitedTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  placeholder: string;
  required?: boolean;
}

function LimitedTextarea({ value, onChange, rows, placeholder, required }: LimitedTextareaProps) {
  const count = value.length;
  const isOver = count > CHAR_LIMIT;
  const isNear = count > CHAR_LIMIT * 0.85;
  return (
    <div>
      <textarea
        className={`${inputClass} resize-none ${isOver ? "!border-[#DC2626] !shadow-[3px_3px_0px_0px_#DC2626]" : ""}`}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <div className="flex items-center justify-end gap-2 mt-1.5">
        {/* Mini progress bar */}
        <div className="flex-1 h-1 bg-[#E5E5E5] border border-[#0A0A0A] overflow-hidden">
          <div
            className={`h-full transition-all ${isOver ? "bg-[#DC2626]" : isNear ? "bg-[#F59E0B]" : "bg-[#0A0A0A]"}`}
            style={{ width: `${Math.min((count / CHAR_LIMIT) * 100, 100)}%` }}
          />
        </div>
        <p className={`text-[10px] font-black tracking-wider shrink-0 ${
          isOver ? "text-[#DC2626]" : isNear ? "text-[#F59E0B]" : "text-[#555555]"
        }`}>
          {count} / {CHAR_LIMIT}{isOver ? " ✕" : ""}
        </p>
      </div>
    </div>
  );
}

// Lego brick block wrapper
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
      {/* Brick header strip with studs */}
      <div className={`${bg} px-4 py-2.5 border-b-2 border-[#0A0A0A] flex items-center gap-3`}>
        {/* Lego studs */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-white/25 border border-white/50 flex items-center justify-center"
            >
              <div className="w-1 h-1 rounded-full bg-white/60" />
            </div>
          ))}
        </div>
        <span className="text-[10px] tracking-widest uppercase font-black text-white">{label}</span>
      </div>
      <div className="p-5 space-y-5">{children}</div>
    </div>
  );
}

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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refinedEmail, setRefinedEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const isWordLimitExceeded =
    form.problem.length > CHAR_LIMIT ||
    form.solution.length > CHAR_LIMIT ||
    form.traction.length > CHAR_LIMIT;

  function set(field: keyof FounderBrief) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isWordLimitExceeded) return;
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
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-[10px] font-black tracking-widest uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] mb-5">
          {[0, 1].map((i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/30 border border-white/50 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white/70" />
            </div>
          ))}
          Step 01
        </div>
        <h1 className="text-[46px] font-black leading-[1.05] text-[#0A0A0A] mb-3">
          Tell Us More
        </h1>
        <p className="text-[15px] text-[#555555] leading-relaxed border-l-4 border-[#DC2626] pl-4">
          Tell us about your startup. We&apos;ll craft your investor communication and unlock the full analysis suite.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Block 01 — Identity */}
        <BrickBlock accentColor="red" label="Block 01 — Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
        </BrickBlock>

        {/* Block 02 — Details */}
        <BrickBlock accentColor="black" label="Block 02 — Details">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
        </BrickBlock>

        {/* Block 03 — Pitch */}
        <BrickBlock accentColor="red" label="Block 03 — Pitch">
          <div>
            <label className={labelClass}>
              Problem Being Solved
              <span className="ml-2 normal-case font-normal text-[#555555]">(max {CHAR_LIMIT} chars)</span>
            </label>
            <LimitedTextarea
              rows={3}
              placeholder="Describe the specific pain point your startup addresses..."
              value={form.problem}
              onChange={set("problem") as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Solution &amp; Product
              <span className="ml-2 normal-case font-normal text-[#555555]">(max {CHAR_LIMIT} chars)</span>
            </label>
            <LimitedTextarea
              rows={3}
              placeholder="How does your product solve the problem? What's the core mechanism?"
              value={form.solution}
              onChange={set("solution") as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Traction &amp; Key Metrics
              <span className="ml-2 normal-case font-normal text-[#555555]">(max {CHAR_LIMIT} chars)</span>
            </label>
            <LimitedTextarea
              rows={2}
              placeholder="ARR, users, growth rate, notable customers, partnerships..."
              value={form.traction}
              onChange={set("traction") as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
            />
          </div>
        </BrickBlock>

        {isWordLimitExceeded && (
          <div className="border-2 border-[#DC2626] shadow-[3px_3px_0px_0px_#DC2626] px-4 py-3 text-[12px] text-[#DC2626] font-black bg-white tracking-wide uppercase">
            ✕ One or more fields exceed the 250-character limit. Shorten them to continue.
          </div>
        )}

        {error && (
          <div className="border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] px-4 py-3 text-[13px] text-[#0A0A0A] flex items-center justify-between bg-white">
            <span>{error}</span>
            <button
              type="submit"
              className="text-[10px] tracking-widest uppercase font-black text-[#DC2626] border-2 border-[#DC2626] px-3 py-1.5 hover:bg-[#DC2626] hover:text-white transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Lego-style press button */}
        <button
          type="submit"
          disabled={loading || isWordLimitExceeded}
          className="w-full bg-[#DC2626] text-white py-4 text-[13px] font-black tracking-widest uppercase border-2 border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#0A0A0A] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Analysing…" : "Analyse & Continue →"}
        </button>

        {loading && (
          <FetchingNotice
            title="Crafting your investor communication…"
            detail="We're building your pitch and extracting your startup profile — this takes 10–20 seconds."
          />
        )}
      </form>

      {refinedEmail && (
        <div className="mt-10 border-2 border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] bg-white">
          <div className="bg-[#0A0A0A] px-4 py-2.5 border-b-2 border-[#0A0A0A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-white/25 border border-white/50 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white/60" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] tracking-widest uppercase font-black text-white">Investor Communication</span>
            </div>
            <button
              onClick={copyEmail}
              className="text-[10px] tracking-widest uppercase font-black text-white border-2 border-white/40 px-3 py-1 hover:bg-white/10 transition-colors"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <div className="p-6">
            <pre className="text-[14px] leading-relaxed text-[#0A0A0A] whitespace-pre-wrap font-sans">
              {refinedEmail}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}

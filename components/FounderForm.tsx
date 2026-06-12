"use client";

import { useState } from "react";
import FetchingNotice from "./FetchingNotice";

export interface FounderBrief {
  startupName: string;
  founderInfo: string;
  industry: string;
  country: string;
  stage: string;
  currency: string;
  amountRaising: string;
  problemStatement: string;
  problemFrequency: string;
  problemImpact: string;
  problemSufferers: string;
  solutionApproach: string;
  successMetric: string;
  whyNotDoneBefore: string;
  defensibility: string;
  mrr: string;
  cac: string;
  ltv: string;
  retentionRate: string;
  burnRate: string;
  runway: string;
  milestonesAchieved: string;
}

interface FounderFormProps {
  onComplete: (brief: FounderBrief, refinedEmail: string, startupSummary: Record<string, string>) => void;
}

const INDUSTRIES = ["Fintech", "Healthtech", "SaaS", "DeepTech", "Consumer", "Climate", "EdTech", "Other"];
const STAGES = ["Pre-seed", "Seed", "Series A", "Series B+"];
const CURRENCIES = ["USD", "EUR", "GBP", "SGD", "MYR", "AUD", "CAD", "INR", "IDR", "AED", "JPY", "CHF"];
const BLOCK3_LIMIT = 50;

const inputClass =
  "w-full border-2 border-[#0A0A0A] px-4 py-3 text-[14px] text-[#0A0A0A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#DC2626] transition-all bg-white shadow-[3px_3px_0px_0px_#0A0A0A] focus:shadow-[3px_3px_0px_0px_#DC2626]";

const labelClass = "block text-[10px] tracking-widest uppercase font-black text-[#0A0A0A] mb-2";

// Single-line input with configurable hard cap + progress bar
interface LimitedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  limit?: number;
}

function LimitedInput({ value, onChange, placeholder, required, limit = BLOCK3_LIMIT }: LimitedInputProps) {
  const count = value.length;
  const isNear = count >= Math.floor(limit * 0.85);
  const isFull = count === limit;
  return (
    <div>
      <input
        type="text"
        className={`${inputClass} ${isFull ? "!border-[#F59E0B] !shadow-[3px_3px_0px_0px_#F59E0B]" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={limit}
      />
      <div className="flex items-center justify-end gap-2 mt-1.5">
        <div className="flex-1 h-1 bg-[#E5E5E5] border border-[#0A0A0A] overflow-hidden">
          <div
            className={`h-full transition-all ${isFull ? "bg-[#F59E0B]" : isNear ? "bg-[#F59E0B]" : "bg-[#DC2626]"}`}
            style={{ width: `${(count / limit) * 100}%` }}
          />
        </div>
        <p className={`text-[10px] font-black tracking-wider shrink-0 ${isNear ? "text-[#F59E0B]" : "text-[#555555]"}`}>
          {count} / {limit}
        </p>
      </div>
    </div>
  );
}

// Numeric metric input with unit boxes (currency dropdown prefix / months suffix).
// Accepts digits (auto comma-formatted) or NA for metrics not available yet.
function MetricInput({
  value,
  onChange,
  placeholder,
  currency,
  onCurrencyChange,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  currency?: string;
  onCurrencyChange?: (c: string) => void;
  suffix?: string;
}) {
  return (
    <div className="flex shadow-[3px_3px_0px_0px_#0A0A0A] focus-within:shadow-[3px_3px_0px_0px_#DC2626] transition-all">
      {currency !== undefined && (
        <select
          className="border-2 border-r-0 border-[#0A0A0A] bg-[#0A0A0A] text-white px-1.5 text-[11px] font-black tracking-wider shrink-0 focus:outline-none cursor-pointer"
          value={currency}
          onChange={(e) => onCurrencyChange?.(e.target.value)}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
      <input
        type="text"
        className="w-full min-w-0 border-2 border-[#0A0A0A] px-3 py-3 text-[14px] text-[#0A0A0A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#DC2626] bg-white"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={12}
        required
      />
      {suffix && (
        <span className="border-2 border-l-0 border-[#0A0A0A] bg-[#E5E5E5] text-[#0A0A0A] px-2.5 text-[9px] font-black tracking-widest uppercase flex items-center shrink-0">
          {suffix}
        </span>
      )}
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
      <div className={`${bg} px-4 py-2.5 border-b-2 border-[#0A0A0A] flex items-center gap-3`}>
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
    founderInfo: "",
    industry: "SaaS",
    country: "",
    stage: "Seed",
    currency: "USD",
    amountRaising: "",
    problemStatement: "",
    problemFrequency: "",
    problemImpact: "",
    problemSufferers: "",
    solutionApproach: "",
    successMetric: "",
    whyNotDoneBefore: "",
    defensibility: "",
    mrr: "",
    cac: "",
    ltv: "",
    retentionRate: "",
    burnRate: "",
    runway: "",
    milestonesAchieved: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refinedEmail, setRefinedEmail] = useState("");
  const [copied, setCopied] = useState(false);

  function set(field: keyof FounderBrief) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const formatted = digits ? Number(digits).toLocaleString("en-US") : "";
    setForm((prev) => ({ ...prev, amountRaising: formatted }));
  }

  // Metric fields accept full numbers (comma-formatted) or NA — no short forms like 18k
  function setMetric(field: keyof FounderBrief, withCommas: boolean) {
    return (raw: string) => {
      const digits = raw.replace(/\D/g, "");
      const value = digits
        ? withCommas
          ? Number(digits).toLocaleString("en-US")
          : digits
        : raw.trim()
          ? "NA"
          : "";
      setForm((prev) => ({ ...prev, [field]: value }));
    };
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
          Before looking to fundraise or reach out to investors, get the answers to the questions below nailed down and your chances of success will be higher.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Block 01 — Identity */}
        <BrickBlock accentColor="red" label="Block 01 — Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Startup Name</label>
              <LimitedInput
                placeholder="Acme Inc."
                value={form.startupName}
                onChange={set("startupName") as (e: React.ChangeEvent<HTMLInputElement>) => void}
                required
                limit={20}
              />
            </div>
            <div>
              <label className={labelClass}>Founder / Key Person Name &amp; Role</label>
              <LimitedInput
                placeholder="Jane Doe, CEO &amp; Co-founder"
                value={form.founderInfo}
                onChange={set("founderInfo") as (e: React.ChangeEvent<HTMLInputElement>) => void}
                required
                limit={50}
              />
            </div>
          </div>
        </BrickBlock>

        {/* Block 02 — Details */}
        <BrickBlock accentColor="red" label="Block 02 — Details">
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
              <div className="flex gap-2">
                <select
                  className="border-2 border-[#0A0A0A] px-2 py-3 text-[13px] font-black text-[#0A0A0A] bg-white focus:outline-none focus:border-[#DC2626] shadow-[3px_3px_0px_0px_#0A0A0A] focus:shadow-[3px_3px_0px_0px_#DC2626] transition-all shrink-0"
                  value={form.currency}
                  onChange={set("currency")}
                >
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  className={`${inputClass} flex-1`}
                  placeholder="1,000,000"
                  value={form.amountRaising}
                  onChange={handleAmountChange}
                  required
                />
              </div>
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

        {/* Block 03 — Problem */}
        <BrickBlock accentColor="red" label="Block 03 — Problem">
          <div>
            <label className={labelClass}>What problem are you solving?</label>
            <LimitedInput
              placeholder="e.g. SMEs can't access affordable trade finance"
              value={form.problemStatement}
              onChange={set("problemStatement") as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required
            />
          </div>

          <div>
            <label className={labelClass}>How often does this problem happen?</label>
            <LimitedInput
              placeholder="e.g. Every time an invoice is issued — daily"
              value={form.problemFrequency}
              onChange={set("problemFrequency") as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required
            />
          </div>

          <div>
            <label className={labelClass}>What does it cost them? (money, time, or customers lost)</label>
            <LimitedInput
              placeholder="e.g. 30% cash flow gap, avg. $50k lost per quarter"
              value={form.problemImpact}
              onChange={set("problemImpact") as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Who pays or suffers when this happens?</label>
            <LimitedInput
              placeholder="e.g. SME owners, their suppliers, and employees"
              value={form.problemSufferers}
              onChange={set("problemSufferers") as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required
            />
          </div>
        </BrickBlock>

        {/* Block 04 — Solution */}
        <BrickBlock accentColor="red" label="Block 04 — Solution">
          <div>
            <label className={labelClass}>How are you solving it?</label>
            <LimitedInput
              placeholder="e.g. AI-powered invoice financing in under 24 hrs"
              value={form.solutionApproach}
              onChange={set("solutionApproach") as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required
            />
          </div>

          <div>
            <label className={labelClass}>What is the metric for success?</label>
            <LimitedInput
              placeholder="e.g. Time-to-fund under 24 hrs, default rate below 1%"
              value={form.successMetric}
              onChange={set("successMetric") as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Why has it not been done before?</label>
            <LimitedInput
              placeholder="e.g. Required real-time ERP data access — now available"
              value={form.whyNotDoneBefore}
              onChange={set("whyNotDoneBefore") as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Can others with more resources do this better?</label>
            <LimitedInput
              placeholder="e.g. Banks lack speed; Big Tech lacks lending licences"
              value={form.defensibility}
              onChange={set("defensibility") as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required
            />
          </div>
        </BrickBlock>

        {/* Block 05 — Traction */}
        <BrickBlock accentColor="red" label="Block 05 — Traction">
          <p className="text-[11px] text-[#555555] tracking-wide -mt-1">
            Use full numbers, not short form (<span className="font-black text-[#0A0A0A]">18,000</span> not 18k). Put <span className="font-black text-[#0A0A0A]">NA</span> for any metric you don&apos;t have yet. Currency follows Block 02.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>MRR — Monthly Recurring Revenue</label>
              <MetricInput
                placeholder="18,000"
                value={form.mrr}
                onChange={setMetric("mrr", true)}
                currency={form.currency}
                onCurrencyChange={(c) => setForm((prev) => ({ ...prev, currency: c }))}
              />
            </div>
            <div>
              <label className={labelClass}>CAC — Customer Acquisition Cost</label>
              <MetricInput
                placeholder="120"
                value={form.cac}
                onChange={setMetric("cac", true)}
                currency={form.currency}
                onCurrencyChange={(c) => setForm((prev) => ({ ...prev, currency: c }))}
              />
            </div>
            <div>
              <label className={labelClass}>LTV — Lifetime Value</label>
              <MetricInput
                placeholder="960"
                value={form.ltv}
                onChange={setMetric("ltv", true)}
                currency={form.currency}
                onCurrencyChange={(c) => setForm((prev) => ({ ...prev, currency: c }))}
              />
            </div>
            <div>
              <label className={labelClass}>Retention Rate</label>
              <MetricInput
                placeholder="92"
                value={form.retentionRate}
                onChange={setMetric("retentionRate", false)}
                suffix="%"
              />
            </div>
            <div>
              <label className={labelClass}>Burn Rate (per month)</label>
              <MetricInput
                placeholder="30,000"
                value={form.burnRate}
                onChange={setMetric("burnRate", true)}
                currency={form.currency}
                onCurrencyChange={(c) => setForm((prev) => ({ ...prev, currency: c }))}
                suffix="/ mo"
              />
            </div>
            <div>
              <label className={labelClass}>Runway (months)</label>
              <MetricInput
                placeholder="14"
                value={form.runway}
                onChange={setMetric("runway", false)}
                suffix="months"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Milestones Achieved</label>
            <LimitedInput
              placeholder="e.g. 120 paying customers, partnership signed"
              value={form.milestonesAchieved}
              onChange={set("milestonesAchieved") as (e: React.ChangeEvent<HTMLInputElement>) => void}
              required
              limit={80}
            />
          </div>
        </BrickBlock>

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
          disabled={loading}
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

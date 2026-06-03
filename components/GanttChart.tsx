"use client";

import { useState, useEffect } from "react";
import FetchingNotice from "./FetchingNotice";

interface GanttTask {
  name: string;
  startWeek: number;
  durationWeeks: number;
}

interface GanttPhase {
  name: string;
  accent: string;
  tasks: GanttTask[];
}

interface GanttMilestone {
  week: number;
  label: string;
}

interface GanttData {
  title: string;
  totalWeeks: number;
  phases: GanttPhase[];
  milestones: GanttMilestone[];
  keyAdvice: string;
}

interface GanttChartProps {
  startupSummary: Record<string, string>;
  stage: string;
  onStartOver: () => void;
}

// Lego stud dots — reused in headers
function Studs({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-full bg-white/25 border border-white/50 flex items-center justify-center"
        >
          <div className="w-1 h-1 rounded-full bg-white/60" />
        </div>
      ))}
    </div>
  );
}

export default function GanttChart({ startupSummary, stage, onStartOver }: GanttChartProps) {
  const [ganttData, setGanttData] = useState<GanttData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGantt() {
      try {
        const res = await fetch("/api/gantt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startupSummary, stage }),
        });
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`[${res.status}] ${text.slice(0, 300)}`);
        }
        if (!res.ok) throw new Error(data.error || "Unknown error");
        setGanttData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate roadmap.");
      } finally {
        setLoading(false);
      }
    }
    fetchGantt();
  }, [startupSummary, stage]);

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 border-t-2 border-[#0A0A0A]">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-[10px] font-black tracking-widest uppercase px-3 py-2 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] mb-5">
          <Studs count={2} />
          Step 05
        </div>
        <h2 className="text-[46px] font-black leading-[1.05] text-[#0A0A0A] mb-3">
          Your Roadmap
        </h2>
        <p className="text-[15px] text-[#555555] leading-relaxed border-l-4 border-[#DC2626] pl-4">
          A personalised week-by-week fundraising plan built around your startup.
        </p>
      </div>

      {loading && (
        <FetchingNotice
          title="Building your fundraising roadmap…"
          detail="Generating a personalised Gantt chart based on your startup profile — this takes 10–15 seconds."
        />
      )}

      {error && (
        <div className="border-2 border-[#DC2626] shadow-[3px_3px_0px_0px_#DC2626] px-4 py-3 text-[13px] text-[#DC2626] font-black bg-white">
          {error}
        </div>
      )}

      {ganttData && (
        <div className="space-y-4">
          {/* Summary card */}
          <div className="border-2 border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] bg-white">
            <div className="bg-[#0A0A0A] px-4 py-2.5 border-b-2 border-[#0A0A0A] flex items-center gap-3">
              <Studs count={3} />
              <span className="text-[10px] tracking-widest uppercase font-black text-white">Fundraising Plan</span>
            </div>
            <div className="p-5 flex items-start gap-5 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-[22px] font-black text-[#0A0A0A] leading-tight">{ganttData.title}</p>
                {ganttData.keyAdvice && (
                  <p className="mt-3 text-[13px] text-[#555555] border-l-4 border-[#DC2626] pl-3 leading-relaxed italic">
                    {ganttData.keyAdvice}
                  </p>
                )}
              </div>
              <div className="bg-[#DC2626] text-white px-4 py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] text-center shrink-0">
                <p className="text-[28px] font-black leading-none">{ganttData.totalWeeks}</p>
                <p className="text-[9px] font-black tracking-widest uppercase opacity-80 mt-0.5">Weeks</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="border-2 border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] overflow-hidden">
            <div className="overflow-x-auto">
              <div style={{ minWidth: `${Math.max(600, ganttData.totalWeeks * 44 + 176)}px` }}>
                {/* Week header row */}
                <WeekHeader
                  totalWeeks={ganttData.totalWeeks}
                  milestones={ganttData.milestones}
                />

                {/* Phase blocks */}
                {ganttData.phases.map((phase, pi) => (
                  <PhaseRows key={pi} phase={phase} totalWeeks={ganttData.totalWeeks} />
                ))}
              </div>
            </div>
          </div>

          {/* Milestones */}
          {ganttData.milestones.length > 0 && (
            <div className="border-2 border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] bg-white">
              <div className="bg-[#DC2626] px-4 py-2.5 border-b-2 border-[#0A0A0A] flex items-center gap-3">
                <Studs count={3} />
                <span className="text-[10px] tracking-widest uppercase font-black text-white">Key Milestones</span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ganttData.milestones.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 border-2 border-[#0A0A0A] p-3 shadow-[2px_2px_0px_0px_#0A0A0A] bg-white"
                  >
                    <div className="bg-[#DC2626] text-white text-[10px] font-black tracking-widest uppercase px-2 py-1.5 border border-[#0A0A0A] shrink-0 text-center min-w-[40px]">
                      W{m.week}
                    </div>
                    <p className="text-[12px] font-black text-[#0A0A0A] uppercase tracking-wide leading-tight">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-[#0A0A0A] text-white py-4 text-[13px] font-black tracking-widest uppercase border-2 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#555555] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#555555] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              Export PDF
            </button>
            <button
              onClick={onStartOver}
              className="flex-1 bg-white text-[#0A0A0A] py-4 text-[13px] font-black tracking-widest uppercase border-2 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

const TASK_COL_W = 176; // px — must match inline width below

function WeekHeader({
  totalWeeks,
  milestones,
}: {
  totalWeeks: number;
  milestones: GanttMilestone[];
}) {
  const milestoneWeeks = new Set(milestones.map((m) => m.week));
  return (
    <div className="flex border-b-2 border-[#0A0A0A] bg-[#F5F5F5]">
      {/* Task name column */}
      <div
        className="shrink-0 border-r-2 border-[#0A0A0A] px-3 py-2 flex items-center"
        style={{ width: TASK_COL_W }}
      >
        <span className="text-[9px] font-black tracking-widest uppercase text-[#555555]">Task</span>
      </div>
      {/* Week cells */}
      <div className="flex flex-1">
        {Array.from({ length: totalWeeks }, (_, i) => {
          const week = i + 1;
          const isMilestone = milestoneWeeks.has(week);
          return (
            <div
              key={i}
              className={`flex-1 text-center py-2 border-r border-[#DDDDDD] last:border-0 text-[8px] font-black tracking-wider ${
                isMilestone ? "bg-[#DC2626]/10 text-[#DC2626]" : "text-[#888888]"
              }`}
            >
              {week}
              {isMilestone && <div className="w-1 h-1 rounded-full bg-[#DC2626] mx-auto mt-0.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhaseRows({
  phase,
  totalWeeks,
}: {
  phase: GanttPhase;
  totalWeeks: number;
}) {
  const isRed = phase.accent !== "black";
  const headerBg = isRed ? "bg-[#DC2626]" : "bg-[#0A0A0A]";
  const barBg = isRed ? "bg-[#DC2626]" : "bg-[#0A0A0A]";

  return (
    <>
      {/* Phase header spanning full width */}
      <div className={`${headerBg} flex items-center gap-3 px-4 py-2 border-b border-[#0A0A0A]/30`}>
        <Studs count={3} />
        <span className="text-[10px] tracking-widest uppercase font-black text-white">{phase.name}</span>
      </div>

      {/* Task rows */}
      {phase.tasks.map((task, ti) => (
        <div
          key={ti}
          className="flex border-b border-[#E5E5E5] last:border-b-0 bg-white hover:bg-[#FAFAFA] transition-colors"
        >
          {/* Task name */}
          <div
            className="shrink-0 border-r-2 border-[#0A0A0A] px-3 py-3 flex items-center"
            style={{ width: TASK_COL_W }}
          >
            <span className="text-[10px] font-black uppercase tracking-wide text-[#0A0A0A] leading-tight">
              {task.name}
            </span>
          </div>

          {/* Week cells */}
          <div className="flex flex-1">
            {Array.from({ length: totalWeeks }, (_, i) => {
              const week = i + 1;
              const start = task.startWeek;
              const end = start + task.durationWeeks - 1;
              const isActive = week >= start && week <= end;
              const isFirst = week === start;
              const isLast = week === end;

              return (
                <div
                  key={i}
                  className={`flex-1 h-10 border-r border-[#F0F0F0] last:border-0 relative transition-colors ${
                    isActive ? barBg : ""
                  }`}
                >
                  {/* Lego stud on the first active cell */}
                  {isActive && isFirst && (
                    <div className="absolute inset-0 flex items-center justify-start pl-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                        <div className="w-0.5 h-0.5 rounded-full bg-white/50" />
                      </div>
                    </div>
                  )}
                  {/* Hard edge markers */}
                  {isActive && isFirst && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/40" />
                  )}
                  {isActive && isLast && (
                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/40" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

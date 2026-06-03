export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startupSummary, stage } = body;

    const totalWeeksMap: Record<string, number> = {
      "Pre-seed": 8,
      "Seed": 12,
      "Series A": 16,
      "Series B+": 20,
    };
    const totalWeeks = totalWeeksMap[stage] ?? 12;

    const prompt = `You are a startup fundraising strategist. Generate a personalised, realistic fundraising action plan as a Gantt chart for this founder.

STARTUP SUMMARY:
${JSON.stringify(startupSummary, null, 2)}

STAGE: ${stage}
TOTAL WEEKS: ${totalWeeks}

Create 3–4 sequential and overlapping phases (e.g. Preparation → Outreach → Meetings & Due Diligence → Close). Each phase should have 2–4 specific, actionable tasks. Tasks within a phase can overlap. Tailor the tasks specifically to this startup's industry, traction, and raise amount.

Rules:
- All startWeek and durationWeeks values must fit within 1–${totalWeeks}
- startWeek + durationWeeks - 1 must be ≤ ${totalWeeks}
- Phases should alternate accent between "red" and "black"
- Include 2–4 key milestones (specific weeks when something important should be achieved)
- keyAdvice: one sharp, specific sentence for this founder

Return ONLY valid JSON — no prose, no markdown fences:
{
  "title": "X-Week Fundraising Roadmap",
  "totalWeeks": ${totalWeeks},
  "phases": [
    {
      "name": "Phase name",
      "accent": "red",
      "tasks": [
        { "name": "Specific task", "startWeek": 1, "durationWeeks": 2 }
      ]
    }
  ],
  "milestones": [
    { "week": 6, "label": "First term sheet target" }
  ],
  "keyAdvice": "One sharp, specific sentence for this founder."
}`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error("/api/gantt error:", err);
    return NextResponse.json({ error: "Failed to generate roadmap. Please try again." }, { status: 500 });
  }
}

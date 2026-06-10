export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { industry, startupSummary } = await req.json();

    const country = startupSummary.country || "the startup's country";

    const prompt = `You are a market research analyst. Give a concise market landscape for a ${industry} startup in ${country}.

STARTUP:
- Problem: ${startupSummary.problem}
- Solution: ${startupSummary.solution}
- Unique angle: ${startupSummary.uniqueAngle}

Rules:
- TAM/SAM/SOM figures must be for ${country} or its immediate region (not global).
- List exactly 3 competitors active in ${country} or the region.
- Trends, tailwinds, and risks must be specific to ${country}.
- Be concise — each field is one tight sentence with a number where possible.

Return ONLY valid JSON:
{
  "marketSize": {
    "tam": "TAM for ${country}/region with a figure",
    "sam": "SAM with a figure",
    "som": "SOM with a figure"
  },
  "keyTrends": [
    "Trend 1 with data point",
    "Trend 2 with data point",
    "Trend 3 with data point"
  ],
  "competitors": [
    { "name": "Name", "positioning": "One-sentence positioning", "funding": "Stage or amount" },
    { "name": "Name", "positioning": "One-sentence positioning", "funding": "Stage or amount" },
    { "name": "Name", "positioning": "One-sentence positioning", "funding": "Stage or amount" }
  ],
  "tailwinds": [
    "Tailwind 1 specific to ${country}",
    "Tailwind 2 specific to ${country}"
  ],
  "risks": [
    "Risk 1 specific to ${country}",
    "Risk 2 specific to ${country}"
  ]
}`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1800,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error("/api/market error:", err);
    return NextResponse.json({ error: "Failed to fetch market data. Please try again." }, { status: 500 });
  }
}

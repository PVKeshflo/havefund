export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { country, stage, industry, startupSummary } = await req.json();

    const prompt = `You are a venture capital research expert with deep knowledge of the global VC ecosystem. Return 8-12 real venture capital firms that would be a strong fit for this startup.

STARTUP CONTEXT:
- Name: ${startupSummary.name}
- Industry: ${industry}
- Stage: ${stage}
- Country: ${country}
- One-liner: ${startupSummary.oneLiner}
- Unique angle: ${startupSummary.uniqueAngle}

Find VCs that:
1. Invest in ${industry} companies
2. Invest at ${stage} stage
3. Are active in ${country} or invest globally from that region
4. Would genuinely resonate with this startup's thesis

Return ONLY valid JSON with this exact structure:
{
  "investors": [
    {
      "name": "Fund Name",
      "focus": "Investment thesis and focus areas in 1-2 sentences",
      "stage": "Preferred stage(s)",
      "location": "City, Country",
      "notablePortfolio": ["Company 1", "Company 2", "Company 3"],
      "contactHint": "Outreach approach e.g. warm intro preferred / open cold email / active on Twitter",
      "website": "https://..."
    }
  ]
}

Use your knowledge of real VC firms. Be specific and accurate about portfolio companies and focus areas. Include a mix of local/regional and global funds.`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error("/api/investors error:", err);
    return NextResponse.json({ error: "Failed to fetch investor data. Please try again." }, { status: 500 });
  }
}

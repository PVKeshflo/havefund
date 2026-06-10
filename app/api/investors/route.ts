export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { country, stage, industry, startupSummary } = await req.json();

    const prompt = `You are a venture capital research expert with deep, current knowledge of the global VC ecosystem. Return 8-12 real venture capital firms that are a strong fit for this startup.

STARTUP CONTEXT:
- Name: ${startupSummary.name}
- Industry: ${industry}
- Stage: ${stage}
- Country: ${country}
- One-liner: ${startupSummary.oneLiner}
- Unique angle: ${startupSummary.uniqueAngle}

STRICT CRITERIA — only include a VC if ALL of the following are true:
1. They invest in ${industry} companies
2. They invest at ${stage} stage
3. They are geographically active in ${country} or explicitly invest in that region
4. They are CURRENTLY and ACTIVELY deploying capital from an open, live fund as of 2024–2025
5. Their fund has NOT been fully deployed, closed, wound down, or put on hold

HARD EXCLUSIONS — do NOT list any of the following:
- Funds that have finished deploying their latest vehicle (fully deployed)
- Firms that have announced they are winding down or have shut
- Funds older than ~2020 with no follow-on vehicle raised since
- Corporate VCs whose parent company has shut or pivoted away from VC
- Any firm you are not confident is still making new investments today

For each firm you are uncertain about, omit it rather than guess.

Return ONLY valid JSON with this exact structure:
{
  "investors": [
    {
      "name": "Fund Name",
      "focus": "Investment thesis and focus areas in 1-2 sentences",
      "stage": "Preferred stage(s)",
      "location": "City, Country",
      "notablePortfolio": ["Company 1", "Company 2", "Company 3"],
      "activeFund": "Current active fund name, size, and vintage year e.g. Accel XIV ($650M, 2023)",
      "whyMatch": "One sentence explaining why this VC fits this specific founder — reference their stage (${stage}), industry (${industry}), and country (${country}) explicitly e.g. 'Backs ${stage} ${industry} companies in ${country} and has deployed into this exact vertical before.'",
      "website": "https://..."
    }
  ]
}

Use only verified knowledge of real, currently-active VC firms. Be specific and accurate about portfolio companies, active fund details, and recent investments. Include a mix of local/regional and global funds where confident they are still deploying.`;

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

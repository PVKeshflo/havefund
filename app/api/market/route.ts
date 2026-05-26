import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { industry, startupSummary } = await req.json();

    const country = startupSummary.country || "the startup's country";

    const prompt = `You are a market research analyst. Provide a comprehensive market landscape analysis for a ${industry} startup incorporated in ${country}.

STARTUP CONTEXT:
- Name: ${startupSummary.name}
- Country: ${country}
- Problem: ${startupSummary.problem}
- Solution: ${startupSummary.solution}
- Unique angle: ${startupSummary.uniqueAngle}

IMPORTANT: Ground all analysis in ${country} and its immediate region. Specifically:
- Market size figures (TAM/SAM/SOM) should reflect the ${country} market, or the regional market if the country is small. Include global context only as secondary reference.
- Competitors should prioritise players active in ${country} or the region. Include global competitors only if they operate there.
- Trends and tailwinds should reflect regulatory, economic, or adoption dynamics specific to ${country} / the region.
- Risks should include country-specific factors (regulation, infrastructure, market maturity).

Return ONLY valid JSON with this exact structure:
{
  "marketSize": {
    "tam": "Total Addressable Market in ${country}/region with figure and source",
    "sam": "Serviceable Addressable Market with figure",
    "som": "Serviceable Obtainable Market with figure"
  },
  "keyTrends": [
    "Trend 1 with specific data point relevant to ${country}",
    "Trend 2 with specific data point",
    "Trend 3 with specific data point",
    "Trend 4 with specific data point",
    "Trend 5 with specific data point"
  ],
  "competitors": [
    {
      "name": "Competitor name",
      "positioning": "How they position themselves",
      "funding": "Funding stage or amount if known"
    }
  ],
  "tailwinds": [
    "Macro or regional force 1 favoring this startup in ${country}",
    "Macro or regional force 2",
    "Macro or regional force 3"
  ],
  "risks": [
    "Key market or country-specific risk 1",
    "Key market risk 2",
    "Key market risk 3"
  ]
}

Use real data. Be specific with numbers and sources where possible.`;

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
    console.error("/api/market error:", err);
    return NextResponse.json({ error: "Failed to fetch market data. Please try again." }, { status: 500 });
  }
}

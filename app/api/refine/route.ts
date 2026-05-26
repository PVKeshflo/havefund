export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      startupName,
      oneLiner,
      industry,
      country,
      stage,
      amountRaising,
      problem,
      solution,
      traction,
      investorDraft,
    } = body;

    const prompt = `You are an expert startup pitch advisor. Given the following founder brief, do two things:

1. Rewrite the investor email/post into a sharper, more compelling version. Keep it concise, specific, and investor-ready. Lead with traction, be clear about the ask.

2. Extract a structured startup summary for downstream analysis.

FOUNDER BRIEF:
- Startup: ${startupName}
- One-liner: ${oneLiner}
- Industry: ${industry}
- Country: ${country}
- Stage: ${stage}
- Raising: ${amountRaising}
- Problem: ${problem}
- Solution: ${solution}
- Traction: ${traction}

CURRENT DRAFT:
${investorDraft}

Return ONLY valid JSON with this exact structure:
{
  "refinedEmail": "the improved investor email/post as a string",
  "startupSummary": {
    "name": "${startupName}",
    "oneLiner": "concise one-liner",
    "industry": "${industry}",
    "country": "${country}",
    "stage": "${stage}",
    "amountRaising": "${amountRaising}",
    "problem": "crisp problem statement",
    "solution": "crisp solution statement",
    "traction": "key traction highlights",
    "uniqueAngle": "what makes this truly differentiated"
  }
}`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error("/api/refine error:", err);
    return NextResponse.json({ error: "Failed to refine pitch. Please try again." }, { status: 500 });
  }
}

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
      problemStatement,
      problemFrequency,
      problemImpact,
      problemSufferers,
      solutionApproach,
      successMetric,
      whyNotDoneBefore,
      defensibility,
    } = body;

    const prompt = `You are an expert startup pitch advisor. Given the following founder brief, do two things:

1. Write a sharp, compelling investor email/post from scratch. Keep it concise, specific, and investor-ready. Lead with the problem urgency and impact, be clear about the ask. Under 200 words.

2. Extract a structured startup summary for downstream analysis.

FOUNDER BRIEF:
- Startup: ${startupName}
- One-liner: ${oneLiner}
- Industry: ${industry}
- Country: ${country}
- Stage: ${stage}
- Raising: ${amountRaising}
- Problem: ${problemStatement}
- How often it happens: ${problemFrequency}
- Measurable impact: ${problemImpact}
- Who suffers / pays: ${problemSufferers}
- Solution approach: ${solutionApproach}
- Success metric: ${successMetric}
- Why not done before: ${whyNotDoneBefore}
- Defensibility: ${defensibility}

Return ONLY valid JSON with this exact structure:
{
  "refinedEmail": "the investor email/post as a string",
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
    return NextResponse.json({ error: "Failed to craft pitch. Please try again." }, { status: 500 });
  }
}

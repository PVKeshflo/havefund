export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      startupName,
      founderInfo,
      industry,
      country,
      stage,
      currency,
      amountRaising,
      problemStatement,
      problemFrequency,
      problemImpact,
      problemSufferers,
      solutionApproach,
      successMetric,
      whyNotDoneBefore,
      defensibility,
      mrr,
      cac,
      ltv,
      retentionRate,
      burnRate,
      runway,
      milestonesAchieved,
    } = body;

    const prompt = `You are a world-class startup pitch writer known for emails that actually get replies. Given the following founder brief, do two things:

1. Write a punchy, memorable investor email. Follow this exact structure:

   HOOK (1–2 sentences): Open with a striking, specific fact, a surprising number, or a vivid scene that makes the reader feel the pain instantly. Do NOT start with "I" or the company name. Make them stop scrolling.

   PROBLEM + STAKES (2–3 sentences): Briefly explain who suffers, how often, and what it costs them. Be concrete — use the actual numbers from the brief.

   SOLUTION + WHY NOW (2–3 sentences): What you built, why it works, and why the window is open right now (what changed that makes this possible today).

   DEFENSIBILITY (1 sentence): Why you and not someone else with deeper pockets.

   THE ASK (1–2 sentences): Stage, amount raising, what the money does. Be direct.

   Rules:
   - Under 200 words total
   - Zero corporate buzzwords (no "synergy", "disrupt", "leverage", "ecosystem")
   - No boring openers like "I hope this email finds you well" or "We are building X for Y"
   - Vary sentence length — mix punchy short sentences with one longer one for rhythm
   - Write like a human, not a pitch deck
   - Make it feel urgent and specific to THIS startup, not a template

2. Extract a structured startup summary for downstream analysis.

FOUNDER BRIEF:
- Startup: ${startupName}
- Founder / Key Person: ${founderInfo}
- Industry: ${industry}
- Country: ${country}
- Stage: ${stage}
- Raising: ${currency} ${amountRaising}
- Problem: ${problemStatement}
- How often it happens: ${problemFrequency}
- Measurable impact: ${problemImpact}
- Who suffers / pays: ${problemSufferers}
- Solution approach: ${solutionApproach}
- Success metric: ${successMetric}
- Why not done before: ${whyNotDoneBefore}
- Defensibility: ${defensibility}
- MRR: ${mrr} | CAC: ${cac} | LTV: ${ltv} | Retention: ${retentionRate} | Burn: ${burnRate} | Runway: ${runway}
- Milestones achieved: ${milestonesAchieved}

Return ONLY valid JSON with this exact structure:
{
  "refinedEmail": "the investor email/post as a string",
  "startupSummary": {
    "name": "${startupName}",
    "oneLiner": "concise one-liner",
    "industry": "${industry}",
    "country": "${country}",
    "stage": "${stage}",
    "amountRaising": "${currency} ${amountRaising}",
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

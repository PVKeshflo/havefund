export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { investor, startupSummary } = await req.json();

    const prompt = `You are an expert at writing cold investor outreach emails. Write a personalised cold email from the founder of ${startupSummary.name} to ${investor.name}.

STARTUP:
- Name: ${startupSummary.name}
- One-liner: ${startupSummary.oneLiner}
- Stage: ${startupSummary.stage}
- Raising: ${startupSummary.amountRaising}
- Traction: ${startupSummary.traction}
- Unique angle: ${startupSummary.uniqueAngle}

INVESTOR:
- Fund: ${investor.name}
- Focus: ${investor.focus}
- Stage: ${investor.stage}
- Portfolio: ${investor.notablePortfolio?.join(", ")}
- Contact approach: ${investor.contactHint}

Write a cold email that:
1. Opens with a specific reference to ${investor.name}'s portfolio or thesis (shows research)
2. States the ask and stage upfront
3. Explains the opportunity in 2-3 lines — specific, no fluff
4. Includes a clear, low-friction CTA
5. Stays under 200 words total

Return ONLY the email text. No subject line prefix, just the email body.`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const email = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    return NextResponse.json({ email });
  } catch (err) {
    console.error("/api/draft-outreach error:", err);
    return NextResponse.json({ error: "Failed to draft outreach. Please try again." }, { status: 500 });
  }
}

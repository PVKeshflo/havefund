export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";

interface HistoryEntry {
  investorChallenge: string;
  founderResponse: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { round, conversationHistory, startupSummary, founderResponse } = body as {
      round: number;
      conversationHistory: HistoryEntry[];
      startupSummary: {
        name: string;
        problem: string;
        solution: string;
        stage: string;
        traction: string;
        uniqueAngle: string;
      };
      founderResponse?: string;
    };

    if (round === 1) {
      const prompt = `You are a seasoned, skeptical Series A investor known for cutting through hype. You're evaluating this startup for potential investment.

STARTUP:
- Name: ${startupSummary.name}
- Problem: ${startupSummary.problem}
- Solution: ${startupSummary.solution}
- Stage: ${startupSummary.stage}
- Traction: ${startupSummary.traction}
- Unique angle: ${startupSummary.uniqueAngle}

Generate your FIRST tough question. Focus on: why now? Why is this the right timing? Is the market ready? Could a big tech company do this in 6 months?

Be pointed and specific. 2-3 sentences max. Do not be polite or hedge. Return ONLY the question text, no JSON, no preamble.`;

      const message = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      });

      const challenge = message.content[0].type === "text" ? message.content[0].text.trim() : "";
      return NextResponse.json({ challenge });
    }

    if (round === 2) {
      const prompt = `You are a skeptical Series A investor. You asked this opening question:
"${conversationHistory[0].investorChallenge}"

The founder answered:
"${founderResponse}"

Now escalate. Pick the weakest part of their answer and probe it harder. Focus on: defensibility, competitive moat, business model sustainability, or why customers would choose them over alternatives.

Be sharper than round 1. 2-3 sentences max. Return ONLY the question text, no JSON, no preamble.`;

      const message = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      });

      const challenge = message.content[0].type === "text" ? message.content[0].text.trim() : "";
      return NextResponse.json({ challenge });
    }

    if (round === 3) {
      const prompt = `You are a skeptical Series A investor. Here's the full exchange so far:

Round 1 — You: "${conversationHistory[0].investorChallenge}"
Round 1 — Founder: "${conversationHistory[0].founderResponse}"
Round 2 — You: "${conversationHistory[1].investorChallenge}"
Round 2 — Founder: "${founderResponse}"

Now deliver your FINAL and hardest question. This should cut to the core: what makes them truly irreplaceable? If this works, why can't a well-funded competitor copy it in 12 months? What's the unfair advantage?

Make it the toughest question yet. 2-3 sentences. Return ONLY the question text, no JSON, no preamble.`;

      const message = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      });

      const challenge = message.content[0].type === "text" ? message.content[0].text.trim() : "";
      return NextResponse.json({ challenge });
    }

    if (round === 4) {
      const evalPrompt = `You are a seasoned investor evaluating a founder's pitch performance. Review this 3-round stress test exchange:

Round 1 — Investor: "${conversationHistory[0].investorChallenge}"
Round 1 — Founder: "${conversationHistory[0].founderResponse}"

Round 2 — Investor: "${conversationHistory[1].investorChallenge}"
Round 2 — Founder: "${conversationHistory[1].founderResponse}"

Round 3 — Investor: "${conversationHistory[2].investorChallenge}"
Round 3 — Founder: "${founderResponse}"

Evaluate their performance honestly. Return ONLY valid JSON:
{
  "overallScore": 7,
  "strengths": [
    "What they articulated well — be specific",
    "Another strength"
  ],
  "gaps": [
    "Area needing a sharper answer — be specific",
    "Another gap"
  ],
  "suggestedNarrative": "A refined 2-3 sentence why-us statement drawn from the founder's best answers. Ready to use in a pitch."
}`;

      const message = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1000,
        messages: [{ role: "user", content: evalPrompt }],
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");

      const data = JSON.parse(jsonMatch[0]);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid round number" }, { status: 400 });
  } catch (err) {
    console.error("/api/stress-test error:", err);
    return NextResponse.json({ error: "Stress test failed. Please try again." }, { status: 500 });
  }
}

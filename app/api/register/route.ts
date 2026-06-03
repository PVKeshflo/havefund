export const maxDuration = 10;

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, startupName, startupSummary } = await req.json();

    // Log registration — extend this with a database write or email trigger later
    console.log("[register] New interest:", {
      email,
      startup: startupName,
      industry: startupSummary?.industry,
      stage: startupSummary?.stage,
      country: startupSummary?.country,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/register error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}

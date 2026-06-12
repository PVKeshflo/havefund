export const maxDuration = 10;

import { NextRequest, NextResponse } from "next/server";
import { saveSubmission } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { email, startupName, startupSummary } = await req.json();

    await saveSubmission("registrations", {
      email,
      startupName,
      industry: startupSummary?.industry ?? "",
      stage: startupSummary?.stage ?? "",
      country: startupSummary?.country ?? "",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/register error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}

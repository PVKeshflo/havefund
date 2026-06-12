export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { listSubmissions, toCsv } from "@/lib/store";

const BRIEF_COLUMNS = [
  "submittedAt",
  "startupName",
  "founderInfo",
  "industry",
  "country",
  "stage",
  "currency",
  "amountRaising",
  "problemStatement",
  "problemFrequency",
  "problemImpact",
  "problemSufferers",
  "solutionApproach",
  "successMetric",
  "whyNotDoneBefore",
  "defensibility",
  "mrr",
  "cac",
  "ltv",
  "retentionRate",
  "burnRate",
  "runway",
  "milestonesAchieved",
];

const REGISTRATION_COLUMNS = ["submittedAt", "email", "startupName", "industry", "stage", "country"];

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.ADMIN_EXPORT_KEY || key !== process.env.ADMIN_EXPORT_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type") === "registrations" ? "registrations" : "briefs";

  try {
    const records = await listSubmissions(type);
    const columns = type === "registrations" ? REGISTRATION_COLUMNS : BRIEF_COLUMNS;
    const csv = toCsv(records, columns);
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="gohavefund-${type}-${date}.csv"`,
      },
    });
  } catch (err) {
    console.error("/api/export error:", err);
    return NextResponse.json({ error: "Export failed." }, { status: 500 });
  }
}

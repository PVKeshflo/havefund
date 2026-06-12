export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { listSubmissions, toCsv } from "@/lib/store";

const COLUMNS = [
  "submittedAt",
  "type",
  "email",
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

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.ADMIN_EXPORT_KEY || key !== process.env.ADMIN_EXPORT_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [briefs, registrations] = await Promise.all([
      listSubmissions("briefs"),
      listSubmissions("registrations"),
    ]);

    const records: Record<string, unknown>[] = [
      ...briefs.map((r) => ({ ...r, type: "Founder Brief" })),
      ...registrations.map((r) => ({ ...r, type: "Email Registration" })),
    ];
    records.sort((a, b) => String(a.submittedAt ?? "").localeCompare(String(b.submittedAt ?? "")));

    const csv = toCsv(records, COLUMNS);
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="gohavefund-submissions-${date}.csv"`,
      },
    });
  } catch (err) {
    console.error("/api/export error:", err);
    return NextResponse.json({ error: "Export failed." }, { status: 500 });
  }
}

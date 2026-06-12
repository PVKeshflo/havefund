import { promises as fs } from "fs";
import path from "path";

export type SubmissionKind = "briefs" | "registrations";

// Uses Vercel Blob in production (BLOB_READ_WRITE_TOKEN set automatically
// when a Blob store is connected to the project). Falls back to a local
// .data/ folder during development so no setup is needed to test.
function hasBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function localDir(kind: SubmissionKind) {
  return path.join(process.cwd(), ".data", kind);
}

export async function saveSubmission(kind: SubmissionKind, data: Record<string, unknown>) {
  const submittedAt = new Date().toISOString();
  const record = { submittedAt, ...data };
  const filename = `${submittedAt.replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 8)}.json`;

  if (hasBlob()) {
    const { put } = await import("@vercel/blob");
    await put(`submissions/${kind}/${filename}`, JSON.stringify(record), {
      access: "public",
      contentType: "application/json",
    });
  } else {
    const dir = localDir(kind);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), JSON.stringify(record), "utf8");
  }
}

export async function listSubmissions(kind: SubmissionKind): Promise<Record<string, unknown>[]> {
  const records: Record<string, unknown>[] = [];

  if (hasBlob()) {
    const { list } = await import("@vercel/blob");
    let cursor: string | undefined;
    do {
      const res = await list({ prefix: `submissions/${kind}/`, cursor, limit: 1000 });
      const texts = await Promise.all(res.blobs.map((b) => fetch(b.url).then((r) => r.text())));
      for (const text of texts) {
        try {
          records.push(JSON.parse(text));
        } catch {
          // skip corrupt record
        }
      }
      cursor = res.hasMore ? res.cursor : undefined;
    } while (cursor);
  } else {
    let files: string[] = [];
    try {
      files = await fs.readdir(localDir(kind));
    } catch {
      return []; // no submissions yet
    }
    for (const file of files.filter((f) => f.endsWith(".json"))) {
      try {
        records.push(JSON.parse(await fs.readFile(path.join(localDir(kind), file), "utf8")));
      } catch {
        // skip corrupt record
      }
    }
  }

  records.sort((a, b) => String(a.submittedAt ?? "").localeCompare(String(b.submittedAt ?? "")));
  return records;
}

const BOM = String.fromCharCode(0xfeff); // so Excel opens the CSV with correct encoding

export function toCsv(records: Record<string, unknown>[], columns: string[]): string {
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.join(",");
  const rows = records.map((r) => columns.map((c) => escape(r[c])).join(","));
  return BOM + [header, ...rows].join("\r\n");
}

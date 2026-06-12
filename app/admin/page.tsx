"use client";

import { useState } from "react";

function Studs({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-3 h-3 rounded-full bg-white/25 border border-white/50 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-white/60" />
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [key, setKey] = useState("");

  function download() {
    window.location.href = `/api/export?key=${encodeURIComponent(key)}`;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-xl mx-auto px-6 py-20">
        <h1 className="text-[40px] font-black leading-tight text-[#0A0A0A] mb-2">
          GoHave<span className="text-[#DC2626]">Fund</span> Admin
        </h1>
        <p className="text-[14px] text-[#555555] mb-10 border-l-4 border-[#DC2626] pl-4">
          Download all submissions as CSV — opens directly in Excel.
        </p>

        <div className="border-2 border-[#0A0A0A] shadow-[5px_5px_0px_0px_#0A0A0A] bg-white">
          <div className="bg-[#0A0A0A] px-4 py-2.5 border-b-2 border-[#0A0A0A] flex items-center gap-3">
            <Studs />
            <span className="text-[10px] tracking-widest uppercase font-black text-white">Export Data</span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase font-black text-[#0A0A0A] mb-2">
                Admin Key
              </label>
              <input
                type="password"
                placeholder="Enter admin key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full border-2 border-[#0A0A0A] px-4 py-3 text-[14px] text-[#0A0A0A] placeholder-[#AAAAAA] focus:outline-none focus:border-[#DC2626] bg-white shadow-[3px_3px_0px_0px_#0A0A0A] focus:shadow-[3px_3px_0px_0px_#DC2626] transition-all"
              />
            </div>

            <button
              onClick={download}
              disabled={!key}
              className="w-full bg-[#DC2626] text-white py-4 text-[13px] font-black tracking-widest uppercase border-2 border-[#0A0A0A] shadow-[4px_4px_0px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Download All Submissions (CSV) ↓
            </button>
            <p className="text-[12px] text-[#555555] leading-relaxed">
              One file with every founder brief and email registration, newest last. The <span className="font-black text-[#0A0A0A]">type</span> column tells them apart.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

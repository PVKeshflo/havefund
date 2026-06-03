"use client";

interface FetchingNoticeProps {
  title: string;
  detail: string;
}

export default function FetchingNotice({ title, detail }: FetchingNoticeProps) {
  return (
    <div className="border-2 border-[#0A0A0A] shadow-[3px_3px_0px_0px_#0A0A0A] bg-white overflow-hidden">
      {/* Stud loader bar */}
      <div className="flex border-b-2 border-[#0A0A0A]">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2 border-r border-[#0A0A0A] last:border-r-0 bg-[#DC2626] animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <div className="flex items-start gap-4 px-5 py-4">
        {/* Animated lego stud */}
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <div className="w-4 h-4 border-2 border-[#0A0A0A] bg-[#DC2626] flex items-center justify-center animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>
        </div>
        <div>
          <p className="text-[13px] font-black text-[#0A0A0A] leading-snug tracking-wide">{title}</p>
          <p className="text-[12px] text-[#555555] mt-0.5 leading-snug">{detail}</p>
        </div>
      </div>
    </div>
  );
}

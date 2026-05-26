"use client";

interface FetchingNoticeProps {
  title: string;
  detail: string;
}

export default function FetchingNotice({ title, detail }: FetchingNoticeProps) {
  return (
    <div className="flex items-start gap-4 border border-[#E5E5E5] px-5 py-4 mb-8">
      {/* Animated pulse dot */}
      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
        <span className="absolute inline-flex h-3 w-3 rounded-full bg-[#0A0A0A] opacity-20 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0A0A0A]" />
      </div>
      <div>
        <p className="text-[13px] font-medium text-[#0A0A0A] leading-snug">{title}</p>
        <p className="text-[12px] text-[#A0A0A0] mt-0.5 leading-snug">{detail}</p>
      </div>
    </div>
  );
}

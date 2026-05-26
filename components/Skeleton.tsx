"use client";

interface SkeletonProps {
  lines?: number;
  className?: string;
}

export function SkeletonLine({ width = "100%", className = "" }: { width?: string; className?: string }) {
  return (
    <div
      className={`h-4 bg-[#F0F0F0] rounded animate-pulse ${className}`}
      style={{ width }}
    />
  );
}

export default function Skeleton({ lines = 4, className = "" }: SkeletonProps) {
  const widths = ["100%", "92%", "85%", "95%", "78%", "88%", "100%", "82%"];
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={widths[i % widths.length]} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-[#E5E5E5] p-6 space-y-4">
      <SkeletonLine width="60%" className="h-6" />
      <SkeletonLine width="40%" className="h-3" />
      <Skeleton lines={3} />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="border border-[#E5E5E5]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-6 px-6 py-4 border-b border-[#E5E5E5] last:border-0">
          <SkeletonLine width="25%" className="h-4" />
          <SkeletonLine width="45%" className="h-4" />
          <SkeletonLine width="20%" className="h-4" />
        </div>
      ))}
    </div>
  );
}

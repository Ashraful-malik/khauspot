"use client";

export default function CardSkeleton() {
  return [1, 2, 3, 4, 5].map((i) => (
    <CardSkeletonBody key={i} delay={i * 100} />
  ));
}

function CardSkeletonBody({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Pin icon */}
      <Sk className="w-3 h-3 rounded-full shrink-0" />

      {/* Text block */}
      <div className="flex-1 flex flex-col gap-1.5">
        <Sk className="h-3.5 w-[65%]" />
        <Sk className="h-2.5 w-[28%]" />
        <div className="flex items-center gap-1.5 mt-0.5">
          <Sk className="w-2.5 h-2.5 rounded-full" />
          <Sk className="h-2.5 w-[40%]" />
        </div>
      </div>

      {/* Distance block */}
      <div className="flex flex-col gap-1.5 items-end shrink-0">
        <Sk className="h-3 w-16" />
        <Sk className="h-2.5 w-20" />
      </div>
    </div>
  );
}
function Sk({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[600px_100%] rounded ${className}`}
    />
  );
}

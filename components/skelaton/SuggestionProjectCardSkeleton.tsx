function SuggestionProjectCardSkeleton() {
  return (
    <div
      className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        p-4
       
      "
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}

export default SuggestionProjectCardSkeleton;

function Skeleton() {
  return (
    <div className="bg-white rounded-xl shadow-xs border p-4 space-y-4 animate-pulse ">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-5 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>

      {/* Map Link */}
      <div className="h-4 w-1/3 bg-gray-200 rounded" />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <div className="h-9 w-24 bg-gray-200 rounded-lg" />
        <div className="h-9 w-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

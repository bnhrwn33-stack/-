export default function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden glass">
      <div className="aspect-video skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 rounded skeleton" />
        <div className="h-3 w-1/3 rounded skeleton" />
        <div className="h-3 w-full rounded skeleton" />
        <div className="flex gap-2 pt-1">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-7 w-7 rounded skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

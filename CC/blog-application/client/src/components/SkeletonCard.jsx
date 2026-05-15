export default function SkeletonCard({ featured = false }) {
  return (
    <div className={`card ${featured ? 'md:flex' : ''}`}>
      <div className={`skeleton ${featured ? 'md:w-2/5 shrink-0 h-56' : 'aspect-[16/9]'}`} />
      <div className="p-5 flex-1">
        <div className="flex gap-2 mb-3">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="skeleton h-6 w-full mb-2 rounded" />
        <div className="skeleton h-6 w-3/4 mb-4 rounded" />
        <div className="skeleton h-4 w-full mb-2 rounded" />
        <div className="skeleton h-4 w-5/6 mb-4 rounded" />
        <div className="flex justify-between mt-4">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

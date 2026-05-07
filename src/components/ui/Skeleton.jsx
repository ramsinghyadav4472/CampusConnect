// Skeleton components for loading states
export const SkeletonBox = ({ className = '' }) => (
  <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
);

export const BookCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-card">
    <SkeletonBox className="h-48 rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-3 w-1/2" />
      <div className="flex gap-2">
        <SkeletonBox className="h-5 w-16 rounded-full" />
        <SkeletonBox className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <SkeletonBox className="w-16 h-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <SkeletonBox className="h-5 w-48" />
        <SkeletonBox className="h-4 w-64" />
      </div>
    </div>
    <SkeletonBox className="h-32 w-full" />
  </div>
);

export const TableRowSkeleton = ({ cols = 4 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <SkeletonBox className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export default BookCardSkeleton;

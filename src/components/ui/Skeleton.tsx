import { cn } from './Card';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn("animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg", className)} />
);

export const PostSkeleton = () => (
  <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl space-y-4">
    <div className="flex gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-32 h-2" />
      </div>
    </div>
    <Skeleton className="w-full h-12" />
    <div className="flex gap-2">
      <Skeleton className="w-12 h-4" />
      <Skeleton className="w-12 h-4" />
    </div>
  </div>
);

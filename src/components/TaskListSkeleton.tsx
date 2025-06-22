'use client';

import { cn } from '@/utils/cn';

const SkeletonItem = () => (
  <div className="animate-pulse bg-gray-200 rounded" />
);

const TaskItemSkeleton = () => (
  <li className="group p-4 transition-colors hover:bg-gray-50">
    <div className="flex items-start gap-3 w-full">
      {/* Left side - Checkbox, Star, and Task Info */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-3 mt-1">
          {/* Checkbox skeleton */}
          <div className="h-4 w-4 rounded border-2 border-gray-300 bg-gray-100 flex-shrink-0" />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0 p-2">
          <div className="space-y-1">
            {/* Title skeleton */}
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
            {/* Description skeleton */}
            <div className="space-y-1">
              <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
            </div>
            {/* Sub-task progress skeleton */}
            <div className="flex items-center gap-2 mt-2">
              <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Actions and Status */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Action buttons skeleton */}
        <div className="flex items-center gap-1">
          <div className="h-8 w-8 bg-gray-100 rounded-md animate-pulse" />
        </div>

        {/* Status badges skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Date and more menu skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-100 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  </li>
);

const TaskListSkeleton = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Gmail-style Select Bar Skeleton */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 min-h-[60px]">
          <div className="flex items-center gap-3">
            {/* Checkbox skeleton */}
            <div className="h-4 w-4 rounded border-2 border-gray-300 bg-gray-100" />
          </div>

          {/* Right side skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-32 bg-gray-100 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Gmail-style Integrated Tabs Skeleton */}
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="relative flex items-center gap-2 px-6 py-4 border-b-2 border-transparent"
              >
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-6 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </nav>
        </div>

        {/* Tasks List Skeleton */}
        <ul className="divide-y divide-gray-200">
          {Array.from({ length: 6 }).map((_, index) => (
            <TaskItemSkeleton key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskListSkeleton;
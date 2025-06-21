import {
  Archive,
  Clock,
  MoreVertical,
  Star,
  Trash,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { cn } from '@/utils/cn';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

const tasks = [
  {
    id: 1,
    title: 'Design the new landing page',
    description: 'Mockups needs to be created in Figma.',
    status: 'In Progress',
    priority: 'High',
    date: 'Mar 3, 2024',
    isStarred: true,
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description: 'Using Clerk for authentication.',
    status: 'Todo',
    priority: 'Medium',
    date: 'Mar 2, 2024',
    isStarred: false,
  },
  {
    id: 3,
    title: 'Deploy the application to Vercel',
    description: 'Setup CI/CD pipeline.',
    status: 'Done',
    priority: 'Low',
    date: 'Mar 1, 2024',
    isStarred: false,
  },
];

const priorityClasses: { [key: string]: string } = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const statusClasses: { [key: string]: string } = {
  'In Progress': 'bg-blue-100 text-blue-800',
  'Todo': 'bg-gray-200 text-gray-800',
  'Done': 'bg-purple-100 text-purple-800',
};

export default function Dashboard() {
  return (
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
      {tasks.map(task => (
        <li
          key={task.id}
          className="group flex items-center justify-between p-4 transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center gap-4 flex-1">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            <button type="button">
              <Star
                className={cn(
                  'h-5 w-5',
                  task.isStarred
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 group-hover:text-yellow-400',
                )}
              />
            </button>
            <Link
              href={`/dashboard/task/${task.id}`}
              className="flex items-center gap-4 flex-1 hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors"
            >
              <div className="w-64">
                <p className="truncate font-medium text-gray-900">
                  {task.title}
                </p>
              </div>
              <p className="truncate text-sm text-gray-500">
                {task.description}
              </p>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                className="rounded-md p-2 hover:bg-gray-200"
              >
                <Archive className="h-4 w-4 text-gray-600" />
              </button>
              <button
                type="button"
                className="rounded-md p-2 hover:bg-gray-200"
              >
                <Trash className="h-4 w-4 text-gray-600" />
              </button>
              <button
                type="button"
                className="rounded-md p-2 hover:bg-gray-200"
              >
                <Clock className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="flex w-48 justify-end gap-2">
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-xs font-medium',
                  statusClasses[task.status],
                )}
              >
                {task.status}
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-xs font-medium',
                  priorityClasses[task.priority],
                )}
              >
                {task.priority}
              </span>
            </div>
            <p className="w-24 text-right text-sm text-gray-500">
              {task.date}
            </p>
            <button
              type="button"
              className="rounded-md p-2 hover:bg-gray-200"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

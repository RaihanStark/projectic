'use client';

import type { Task } from '@/utils/taskUtils';
import {
  Archive,
  Clock,
  MoreVertical,
  Star,
  Trash,
} from 'lucide-react';
import Link from 'next/link';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { deleteTask, fetchTasks, formatDate, getStatusDisplayName, getUrgencyDisplayName, toggleTaskStar } from '@/utils/taskUtils';

const priorityClasses: { [key: string]: string } = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const statusClasses: { [key: string]: string } = {
  'todo': 'bg-gray-200 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'done': 'bg-purple-100 text-purple-800',
  'cancelled': 'bg-red-100 text-red-800',
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Expose refresh function to parent components
  useEffect(() => {
    // @ts-expect-error: Adding refreshTasks to window for dashboard refresh
    window.refreshTasks = loadTasks;
    return () => {
      // @ts-expect-error: Removing refreshTasks from window for dashboard refresh
      delete window.refreshTasks;
    };
  }, [loadTasks]);

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleStar = async (id: number, currentStarred: boolean) => {
    try {
      const updatedTask = await toggleTaskStar(id, !currentStarred);
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task,
      ));
    } catch (err) {
      console.error('Error toggling star:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-gray-500">No tasks found. Create your first task!</div>
        <button
          type="button"
          onClick={async () => {
            try {
              const response = await fetch('/dashboard/api/seed', { method: 'POST' });
              if (response.ok) {
                loadTasks();
              }
            } catch (err) {
              console.error('Error seeding data:', err);
            }
          }}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
        >
          Load Sample Data
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
        {tasks.map(task => (
          <li
            key={task.id}
            className="group p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-start gap-3 w-full">
              {/* Left side - Checkbox, Star, and Task Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 flex-shrink-0"
                  />
                  <button
                    type="button"
                    onClick={() => handleToggleStar(task.id, task.isStarred)}
                    className="flex-shrink-0"
                  >
                    <Star
                      className={cn(
                        'h-5 w-5',
                        task.isStarred
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 group-hover:text-yellow-400',
                      )}
                    />
                  </button>
                </div>
                
                {/* Task Content */}
                <Link
                  href={`/dashboard/task/${task.id}`}
                  className="flex-1 min-w-0 hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {task.description || 'No description'}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Right side - Actions and Status */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Action buttons */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-gray-200"
                  >
                    <Archive className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-gray-200"
                    onClick={() => handleDeleteTask(task.id)}
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

                {/* Status badges */}
                <div className="flex gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap',
                      statusClasses[task.status],
                    )}
                  >
                    {getStatusDisplayName(task.status)}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap',
                      priorityClasses[task.urgency],
                    )}
                  >
                    {getUrgencyDisplayName(task.urgency)}
                  </span>
                </div>

                {/* Date and more menu */}
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(task.deadline)}
                  </p>
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-gray-200"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

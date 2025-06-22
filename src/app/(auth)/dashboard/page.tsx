'use client';

import type { Task } from '@/utils/taskUtils';
import Link from 'next/link';
import {
  MoreVertical,
  Trash,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { deleteTask, fetchTasks, formatDate, getStatusDisplayName, getUrgencyDisplayName } from '@/utils/taskUtils';

// Portal-based hover tooltip component
const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible && typeof window !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            transform: 'translateX(-50%) translateY(-100%)',
            zIndex: 9999,
          }}
          className="px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none"
        >
          {text}
        </div>,
        document.body,
      )}
    </>
  );
};

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
  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'in-progress' | 'done' | 'cancelled'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId: number | null; taskTitle: string }>({
    isOpen: false,
    taskId: null,
    taskTitle: '',
  });

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
      // @ts-expect-error: Accessing updateTaskCount on window for task count updates
      if (window.updateTaskCount) {
        // @ts-expect-error: Accessing updateTaskCount on window for task count updates
        window.updateTaskCount(fetchedTasks.length);
      }
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

  const handleDeleteTask = (id: number, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      taskId: id,
      taskTitle: title,
    });
  };

  const confirmDeleteTask = async () => {
    if (!deleteConfirm.taskId) {
      return;
    }

    try {
      await deleteTask(deleteConfirm.taskId);
      const updatedTasks = tasks.filter(task => task.id !== deleteConfirm.taskId);
      setTasks(updatedTasks);
      // @ts-expect-error: Accessing updateTaskCount on window for task count updates
      if (window.updateTaskCount) {
        // @ts-expect-error: Accessing updateTaskCount on window for task count updates
        window.updateTaskCount(updatedTasks.length);
      }
      setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' });
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const cancelDeleteTask = () => {
    setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' });
  };

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  // Get counts for each tab
  const tabCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    cancelled: tasks.filter(t => t.status === 'cancelled').length,
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
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Gmail-style Integrated Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            {[
              { key: 'all', label: 'All Tasks', count: tabCounts.all },
              { key: 'todo', label: 'Todo', count: tabCounts.todo },
              { key: 'in-progress', label: 'In Progress', count: tabCounts['in-progress'] },
              { key: 'done', label: 'Done', count: tabCounts.done },
              { key: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={cn(
                  'relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2',
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tasks List */}
        <ul className="divide-y divide-gray-200">
        {filteredTasks.length === 0 ? (
          <li className="p-8 text-center text-gray-500">
            <div className="text-sm">
              {activeTab === 'all' 
                ? 'No tasks found'
                : `No ${activeTab.replace('-', ' ')} tasks`
              }
            </div>
          </li>
        ) : (
          filteredTasks.map(task => (
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
                  <Tooltip text="Delete task">
                    <button
                      type="button"
                      className="rounded-md p-2 hover:bg-gray-200"
                      onClick={() => handleDeleteTask(task.id, task.title)}
                    >
                      <Trash className="h-4 w-4 text-gray-600" />
                    </button>
                  </Tooltip>
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
          ))
        )}
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Task
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "
              {deleteConfirm.taskTitle}
              "? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={cancelDeleteTask}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

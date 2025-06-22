'use client';

import type { Task } from '@/utils/taskUtils';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle,
  Circle,
  Clock,
  MoreVertical,
  Trash,
  XCircle,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { bulkDeleteTasks, bulkUpdateTaskStatus, deleteTask, fetchTasks, fetchSubTaskCounts, formatDate, getStatusDisplayName, getUrgencyDisplayName } from '@/utils/taskUtils';
import { truncateMarkdown } from '@/utils/markdown';
import Dropdown, { type DropdownOption } from '@/components/Dropdown';
import toast from 'react-hot-toast';

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

const statusConfig = {
  'todo': {
    label: 'Todo',
    icon: Circle,
    iconClassName: 'text-gray-500',
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    iconClassName: 'text-blue-500',
  },
  'done': {
    label: 'Done',
    icon: CheckCircle,
    iconClassName: 'text-green-500',
  },
  'cancelled': {
    label: 'Cancelled',
    icon: XCircle,
    iconClassName: 'text-red-500',
  },
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'in-progress' | 'done' | 'cancelled'>('all');
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId: number | null; taskTitle: string }>({
    isOpen: false,
    taskId: null,
    taskTitle: '',
  });
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState<{ isOpen: boolean; taskIds: number[]; taskTitles: string[] }>({
    isOpen: false,
    taskIds: [],
    taskTitles: [],
  });
  const [bulkUpdateLoading, setBulkUpdateLoading] = useState(false);

  // Status dropdown options for bulk update
  const statusOptions: DropdownOption[] = Object.entries(statusConfig).map(([key, config]) => ({
    value: key,
    label: config.label,
    icon: config.icon,
    iconClassName: config.iconClassName,
  }));

  // Urgency filter state and options
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const urgencyOptions: DropdownOption[] = [
    { value: 'all', label: 'All Urgencies', icon: AlertTriangle, iconClassName: 'text-gray-500' },
    { value: 'low', label: 'Low', icon: AlertTriangle, iconClassName: 'text-green-500' },
    { value: 'medium', label: 'Medium', icon: AlertTriangle, iconClassName: 'text-yellow-500' },
    { value: 'high', label: 'High', icon: AlertTriangle, iconClassName: 'text-orange-500' },
    { value: 'critical', label: 'Critical', icon: AlertTriangle, iconClassName: 'text-red-500' },
  ];

  // Sub-task counts state
  const [subTaskCounts, setSubTaskCounts] = useState<{ [taskId: number]: { completed: number; total: number } }>({});

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedTasks, subTaskCountsData] = await Promise.all([
        fetchTasks(),
        fetchSubTaskCounts()
      ]);
      setTasks(fetchedTasks);
      setSubTaskCounts(subTaskCountsData);
      // @ts-expect-error: Accessing updateTaskCount on window for task count updates
      if (window.updateTaskCount) {
        // @ts-expect-error: Accessing updateTaskCount on window for task count updates
        window.updateTaskCount(fetchedTasks.length);
      }
    } catch (err) {
      setError('Failed to load tasks');
      toast.error('Failed to load tasks');
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
      toast.success(`Task "${deleteConfirm.taskTitle}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  const cancelDeleteTask = () => {
    setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' });
  };

  // Filter and sort tasks based on active tab and urgency filter
  const filteredTasks = tasks
    .filter(task => {
      // Filter by status tab
      if (activeTab !== 'all' && task.status !== activeTab) return false;
      // Filter by urgency
      if (urgencyFilter !== 'all' && task.urgency !== urgencyFilter) return false;
      return true;
    })
    .sort((a, b) => {
      // For "All Tasks" tab, move done tasks to bottom
      if (activeTab === 'all') {
        if (a.status === 'done' && b.status !== 'done') return 1;
        if (a.status !== 'done' && b.status === 'done') return -1;
      }
      // Keep original order for same status
      return 0;
    });

  // Get counts for each tab
  const tabCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    cancelled: tasks.filter(t => t.status === 'cancelled').length,
  };

  // Bulk action handlers
  const handleSelectTask = (taskId: number, checked: boolean) => {
    const newSelected = new Set(selectedTasks);
    if (checked) {
      newSelected.add(taskId);
    } else {
      newSelected.delete(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(new Set(filteredTasks.map(task => task.id)));
    } else {
      setSelectedTasks(new Set());
    }
  };

  const handleBulkDelete = () => {
    const taskIds = Array.from(selectedTasks);
    const taskTitles = tasks
      .filter(task => taskIds.includes(task.id))
      .map(task => task.title);
    
    setBulkDeleteConfirm({
      isOpen: true,
      taskIds,
      taskTitles,
    });
  };

  const confirmBulkDelete = async () => {
    if (bulkDeleteConfirm.taskIds.length === 0) {
      return;
    }

    try {
      await bulkDeleteTasks(bulkDeleteConfirm.taskIds);
      const updatedTasks = tasks.filter(task => !bulkDeleteConfirm.taskIds.includes(task.id));
      setTasks(updatedTasks);
      // @ts-expect-error: Accessing updateTaskCount on window for task count updates
      if (window.updateTaskCount) {
        // @ts-expect-error: Accessing updateTaskCount on window for task count updates
        window.updateTaskCount(updatedTasks.length);
      }
      setSelectedTasks(new Set());
      setBulkDeleteConfirm({ isOpen: false, taskIds: [], taskTitles: [] });
      toast.success(`${bulkDeleteConfirm.taskIds.length} task${bulkDeleteConfirm.taskIds.length > 1 ? 's' : ''} deleted successfully`);
    } catch (err) {
      console.error('Error bulk deleting tasks:', err);
      toast.error('Failed to delete tasks');
    }
  };

  const cancelBulkDelete = () => {
    setBulkDeleteConfirm({ isOpen: false, taskIds: [], taskTitles: [] });
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    const taskIds = Array.from(selectedTasks);
    
    setBulkUpdateLoading(true);
    try {
      const updatedTasks = await bulkUpdateTaskStatus(taskIds, newStatus);
      
      // Update the tasks in state
      setTasks(prevTasks => 
        prevTasks.map(task => {
          const updatedTask = updatedTasks.find(updated => updated.id === task.id);
          return updatedTask || task;
        })
      );
      
      // Clear selections after successful update
      setSelectedTasks(new Set());
      toast.success(`${taskIds.length} task${taskIds.length > 1 ? 's' : ''} updated to ${getStatusDisplayName(newStatus as Task['status'])}`);
    } catch (err) {
      console.error('Error bulk updating task status:', err);
      toast.error('Failed to update task status');
    } finally {
      setBulkUpdateLoading(false);
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
                toast.success('Sample tasks loaded successfully');
              } else {
                toast.error('Failed to load sample data');
              }
            } catch (err) {
              console.error('Error seeding data:', err);
              toast.error('Failed to load sample data');
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
        {/* Gmail-style Select Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 min-h-[60px]">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filteredTasks.length > 0 && selectedTasks.size === filteredTasks.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {selectedTasks.size > 0 && (
              <>
                {/* Status Update Dropdown */}
                <Dropdown
                  value=""
                  onChange={(value) => {
                    if (value) {
                      handleBulkStatusUpdate(value);
                    }
                  }}
                  options={statusOptions}
                  disabled={bulkUpdateLoading}
                  placeholder={bulkUpdateLoading ? 'Updating...' : 'Change status'}
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete selected"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Right side - Selection Count OR Urgency Filter */}
          {selectedTasks.size > 0 ? (
            <div className="text-sm text-gray-600">
              {selectedTasks.size} of {filteredTasks.length} selected
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Dropdown
                value={urgencyFilter}
                onChange={(value) => {
                  setUrgencyFilter(value);
                  setSelectedTasks(new Set()); // Clear selections when filtering
                }}
                options={urgencyOptions}
                size="sm"
                anchor="auto"
                className="border-gray-300 hover:bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

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
                onClick={() => {
                  setActiveTab(tab.key as typeof activeTab);
                  setSelectedTasks(new Set()); // Clear selections when switching tabs
                  setUrgencyFilter('all'); // Reset urgency filter when switching tabs
                }}
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
            className={cn(
              "group p-4 transition-colors hover:bg-gray-50",
              task.status === 'done' && "opacity-60 bg-gray-50/50"
            )}
          >
            <div className="flex items-start gap-3 w-full">
              {/* Left side - Checkbox, Star, and Task Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="checkbox"
                    checked={selectedTasks.has(task.id)}
                    onChange={(e) => handleSelectTask(task.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                </div>

                {/* Task Content */}
                <Link
                  href={`/dashboard/task/${task.id}`}
                  className="flex-1 min-w-0 hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors"
                >
                  <div className="space-y-1">
                    <p className={cn(
                      "font-medium line-clamp-1",
                      task.status === 'done' 
                        ? "text-gray-500 line-through" 
                        : "text-gray-900"
                    )}>
                      {task.title}
                    </p>
                    <p className={cn(
                      "text-sm line-clamp-2",
                      task.status === 'done' 
                        ? "text-gray-400" 
                        : "text-gray-500"
                    )}>
                      {task.description ? truncateMarkdown(task.description, 120) : 'No description'}
                    </p>
                    {/* Sub-task progress indicator */}
                    {subTaskCounts[task.id] && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className={cn(
                          "h-3 w-3",
                          task.status === 'done' ? "text-gray-400" : "text-green-500"
                        )} />
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-16 h-1.5 rounded-full",
                            task.status === 'done' ? "bg-gray-200" : "bg-gray-200"
                          )}>
                            <div 
                              className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                task.status === 'done' ? "bg-gray-400" : "bg-green-500"
                              )}
                              style={{ 
                                width: `${subTaskCounts[task.id].total > 0 ? (subTaskCounts[task.id].completed / subTaskCounts[task.id].total) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className={cn(
                            "text-xs font-medium",
                            task.status === 'done' ? "text-gray-400" : "text-gray-600"
                          )}>
                            {subTaskCounts[task.id].completed}/{subTaskCounts[task.id].total} subtasks
                          </span>
                        </div>
                      </div>
                    )}
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
                  <p className={cn(
                    "text-sm whitespace-nowrap",
                    task.status === 'done' ? "text-gray-400" : "text-gray-500"
                  )}>
                    {formatDate(task.deadline)}
                  </p>
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-gray-200"
                  >
                    <MoreVertical className={cn(
                      "h-4 w-4",
                      task.status === 'done' ? "text-gray-400" : "text-gray-600"
                    )} />
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

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete {bulkDeleteConfirm.taskIds.length} Task{bulkDeleteConfirm.taskIds.length > 1 ? 's' : ''}
            </h3>
            <div className="text-gray-600 mb-6">
              <p className="mb-3">Are you sure you want to delete these tasks? This action cannot be undone.</p>
              <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                <ul className="text-sm space-y-1">
                  {bulkDeleteConfirm.taskTitles.map((title, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 font-mono text-xs mt-0.5">•</span>
                      <span className="text-gray-700">{title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={cancelBulkDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBulkDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete {bulkDeleteConfirm.taskIds.length} Task{bulkDeleteConfirm.taskIds.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import type { DropdownOption } from './Dropdown';
import type { SubTask, UpdateTaskData } from '@/utils/taskUtils';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Pencil,
  Plus,
  Tag,
  Trash2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useTaskStore } from '@/stores/taskStore';
import { cn } from '@/utils/cn';
import { createSubTask, deleteSubTask, fetchSubTasks, updateSubTask, updateTask } from '@/utils/taskUtils';
import Dropdown from './Dropdown';
import MarkdownEditor from './MarkdownEditor';

type TaskDetailProps = {
  id: number;
  title: string;
  description: string;
  label: string;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadline: string | null;
};

const statusConfig = {
  'todo': {
    label: 'Todo',
    icon: Circle,
    className: 'bg-gray-100 text-gray-800',
    iconClassName: 'text-gray-500',
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    className: 'bg-blue-100 text-blue-800',
    iconClassName: 'text-blue-500',
  },
  'done': {
    label: 'Done',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800',
    iconClassName: 'text-green-500',
  },
  'cancelled': {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-red-100 text-red-800',
    iconClassName: 'text-red-500',
  },
};

const urgencyConfig = {
  low: {
    label: 'Low',
    className: 'bg-green-100 text-green-800',
    icon: AlertTriangle,
    iconClassName: 'text-green-500',
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-800',
    icon: AlertTriangle,
    iconClassName: 'text-yellow-500',
  },
  high: {
    label: 'High',
    className: 'bg-orange-100 text-orange-800',
    icon: AlertTriangle,
    iconClassName: 'text-orange-500',
  },
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-800',
    icon: AlertTriangle,
    iconClassName: 'text-red-500',
  },
};

const TaskDetail = (props: TaskDetailProps) => {
  // Zustand store
  const { updateTask: updateTaskInStore } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(props);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sub-tasks state
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [subTasksLoading, setSubTasksLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (newStatus: 'todo' | 'in-progress' | 'done' | 'cancelled') => {
    setTask(prev => ({ ...prev, status: newStatus }));
  };

  const handleUrgencyChange = (newUrgency: 'low' | 'medium' | 'high' | 'critical') => {
    setTask(prev => ({ ...prev, urgency: newUrgency }));
  };

  // Load sub-tasks
  const loadSubTasks = useCallback(async () => {
    try {
      setSubTasksLoading(true);
      const fetchedSubTasks = await fetchSubTasks(task.id);
      setSubTasks(fetchedSubTasks);
    } catch (err) {
      console.error('Error loading sub-tasks:', err);
      setError('Failed to load sub-tasks');
      toast.error('Failed to load sub-tasks');
    } finally {
      setSubTasksLoading(false);
    }
  }, [task.id]);

  // Load sub-tasks on component mount
  useEffect(() => {
    loadSubTasks();
  }, [loadSubTasks]);

  // Sub-task functions
  const handleSubTaskToggle = async (id: number) => {
    const subTask = subTasks.find(st => st.id === id);
    if (!subTask) {
      return;
    }

    const newCompletedState = !subTask.completed;

    // Optimistic update - immediately update UI
    const updatedSubTasks = subTasks.map(st =>
      st.id === id ? { ...st, completed: newCompletedState } : st,
    );
    setSubTasks(updatedSubTasks);

    // Update task in store with new subtasks
    updateTaskInStore(task.id, { ...task, subtasks: updatedSubTasks });

    toast.success(`Sub-task ${newCompletedState ? 'completed' : 'marked as incomplete'}`);

    try {
      await updateSubTask(task.id, id, {
        completed: newCompletedState,
      });
    } catch (err) {
      // Rollback optimistic update on error
      setSubTasks(prev => prev.map(st =>
        st.id === id ? { ...st, completed: !newCompletedState } : st,
      ));

      // Rollback task in store
      updateTaskInStore(task.id, { ...task, subtasks: subTasks });

      console.error('Error updating sub-task:', err);
      setError('Failed to update sub-task');
      toast.error('Failed to update sub-task. Changes reverted.');
    }
  };

  const handleAddSubTask = async () => {
    if (!newSubTaskTitle.trim()) {
      return;
    }

    try {
      const newSubTask = await createSubTask(task.id, {
        title: newSubTaskTitle.trim(),
      });
      const updatedSubTasks = [...subTasks, newSubTask];
      setSubTasks(updatedSubTasks);
      setNewSubTaskTitle('');

      // Update task in store with new subtasks
      updateTaskInStore(task.id, { ...task, subtasks: updatedSubTasks });

      toast.success('Sub-task added successfully');
    } catch (err) {
      console.error('Error creating sub-task:', err);
      setError('Failed to create sub-task');
      toast.error('Failed to create sub-task');
    }
  };

  const handleDeleteSubTask = async (id: number) => {
    // Store the sub-task for potential rollback
    const subTaskToDelete = subTasks.find(st => st.id === id);
    if (!subTaskToDelete) {
      return;
    }

    // Optimistic update - immediately remove from UI
    const updatedSubTasks = subTasks.filter(subTask => subTask.id !== id);
    setSubTasks(updatedSubTasks);

    // Update task in store with new subtasks
    updateTaskInStore(task.id, { ...task, subtasks: updatedSubTasks });

    toast.success('Sub-task deleted successfully');

    try {
      await deleteSubTask(task.id, id);
    } catch (err) {
      // Rollback on error - restore the deleted sub-task
      const newSubTasks = [...subTasks.filter(st => st.id !== id), subTaskToDelete];
      // Re-sort by creation date to maintain original order
      const sortedSubTasks = newSubTasks.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      setSubTasks(sortedSubTasks);

      // Rollback task in store
      updateTaskInStore(task.id, { ...task, subtasks: sortedSubTasks });

      console.error('Error deleting sub-task:', err);
      setError('Failed to delete sub-task');
      toast.error('Failed to delete sub-task. Restored sub-task.');
    }
  };

  const completedSubTasks = subTasks.filter(st => st.completed).length;
  const totalSubTasks = subTasks.length;

  // Convert config objects to dropdown options
  const statusOptions: DropdownOption[] = Object.entries(statusConfig).map(([key, config]) => ({
    value: key,
    label: config.label,
    icon: config.icon,
    iconClassName: config.iconClassName,
  }));

  const urgencyOptions: DropdownOption[] = Object.entries(urgencyConfig).map(([key, config]) => ({
    value: key,
    label: config.label,
    icon: config.icon,
    iconClassName: config.iconClassName,
  }));

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // Form validation
    if (!task.title.trim()) {
      toast.error('Task title is required');
      setLoading(false);
      return;
    }

    try {
      const updateData: UpdateTaskData = {
        title: task.title,
        description: task.description || undefined,
        label: task.label || undefined,
        status: task.status,
        urgency: task.urgency,
        deadline: task.deadline ? task.deadline : undefined,
      };

      await updateTask(task.id, updateData);
      updateTaskInStore(task.id, task);
      setIsEditing(false);
      toast.success('Task updated successfully');
    } catch (err) {
      setError('Failed to update task. Please try again.');
      toast.error('Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTask(props);
    setIsEditing(false);
    setError(null);
  };

  const { title, description, label, status, urgency, deadline } = task;

  const statusInfo = statusConfig[status];
  const urgencyInfo = urgencyConfig[urgency];
  const StatusIcon = statusInfo.icon;
  const UrgencyIcon = urgencyInfo.icon;

  const inputStyles
    = 'w-full rounded-md border-gray-300 bg-gray-50 p-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500';
  const smallInputStyles
    = 'rounded-md border-gray-300 bg-gray-50 p-1 text-sm text-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500';

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full px-6 py-6">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              {error}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 hover:bg-gray-100 rounded-md px-3 py-2 -ml-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Link>
            <div className="flex items-center gap-2">
              {isEditing
                ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading
                          ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Saving...
                              </>
                            )
                          : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Save Changes
                              </>
                            )}
                      </button>
                    </>
                  )
                : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Task
                    </button>
                  )}
            </div>
          </div>
        </div>

        {/* Task Title */}
        <div className="mb-8">
          {isEditing
            ? (
                <input
                  name="title"
                  value={title}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Enter task title..."
                  className={cn(
                    'w-full border-0 bg-transparent p-0 text-4xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0',
                    loading && 'opacity-50',
                  )}
                />
              )
            : (
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">{title}</h1>
              )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Pencil className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>
              </div>
              {isEditing
                ? (
                    <MarkdownEditor
                      value={description}
                      onChange={value => setTask(prev => ({ ...prev, description: value }))}
                      placeholder="Add a description for this task..."
                      disabled={loading}
                      height={300}
                      className={cn(loading && 'opacity-50')}
                    />
                  )
                : (
                    <div className="prose prose-gray max-w-none">
                      {description ? (
                        <MarkdownEditor
                          value={description}
                          onChange={() => {}} // Read-only in view mode
                          preview="preview"
                          height={200}
                        />
                      ) : (
                        <p className="text-gray-400 italic">No description provided</p>
                      )}
                    </div>
                  )}
            </div>

            {/* Sub-tasks Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Sub-tasks
                  </h2>
                  {totalSubTasks > 0 && (
                    <span className="text-sm text-gray-500">
                      (
                      {completedSubTasks}
                      /
                      {totalSubTasks}
                      {' '}
                      completed)
                    </span>
                  )}
                </div>
                {totalSubTasks > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedSubTasks / totalSubTasks) * 100}%` }}
                      >
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {Math.round((completedSubTasks / totalSubTasks) * 100)}
                      %
                    </span>
                  </div>
                )}
              </div>

              {/* Add new sub-task */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubTaskTitle}
                    onChange={e => setNewSubTaskTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSubTask()}
                    placeholder="Add a sub-task..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddSubTask}
                    disabled={!newSubTaskTitle.trim()}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Sub-tasks list */}
              <div className="space-y-2">
                {subTasks.length === 0
                  ? (
                      <div className="text-center py-8 text-gray-400">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No sub-tasks yet. Add one above to get started!</p>
                      </div>
                    )
                  : (
                      subTasks.map(subTask => (
                        <div
                          key={subTask.id}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border transition-all group hover:bg-gray-50',
                            subTask.completed
                              ? 'border-green-200 bg-green-50/50'
                              : 'border-gray-200 bg-white',
                          )}
                        >
                          <button
                            onClick={() => handleSubTaskToggle(subTask.id)}
                            className={cn(
                              'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                              subTask.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-400',
                            )}
                          >
                            {subTask.completed && <CheckCircle className="h-3 w-3" />}
                          </button>
                          <span
                            className={cn(
                              'flex-1 text-sm',
                              subTask.completed
                                ? 'text-gray-500 line-through'
                                : 'text-gray-900',
                            )}
                          >
                            {subTask.title}
                          </span>
                          <button
                            onClick={() => handleDeleteSubTask(subTask.id)}
                            className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-all rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
              </div>
            </div>
          </div>

          {/* Right Column - Task Details */}
          <div className="space-y-6">
            {/* Status & Priority Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Status & Priority
              </h3>
              <div className="space-y-4">
                {isEditing
                  ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <Dropdown
                            value={status}
                            onChange={value => handleStatusChange(value as 'todo' | 'in-progress' | 'done' | 'cancelled')}
                            options={statusOptions}
                            disabled={loading}
                            size="sm"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                          </label>
                          <Dropdown
                            value={urgency}
                            onChange={value => handleUrgencyChange(value as 'low' | 'medium' | 'high' | 'critical')}
                            options={urgencyOptions}
                            disabled={loading}
                            size="sm"
                            className="w-full"
                          />
                        </div>
                      </>
                    )
                  : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-sm font-medium',
                              statusInfo.className,
                            )}
                          >
                            <StatusIcon
                              className={cn('h-4 w-4', statusInfo.iconClassName)}
                            />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Priority</span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-sm font-medium',
                              urgencyInfo.className,
                            )}
                          >
                            <UrgencyIcon
                              className={cn('h-4 w-4', urgencyInfo.iconClassName)}
                            />
                            {urgencyInfo.label}
                          </span>
                        </div>
                      </>
                    )}
              </div>
            </div>

            {/* Task Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Task Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Label</span>
                  </div>
                  {isEditing
                    ? (
                        <input
                          name="label"
                          value={label}
                          onChange={handleInputChange}
                          disabled={loading}
                          placeholder="Add label..."
                          className={cn(
                            'text-sm border border-gray-300 rounded-md px-3 py-1 text-right w-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
                            loading && 'opacity-50',
                          )}
                        />
                      )
                    : (
                        <span className="text-sm font-medium text-gray-900">
                          {label || 'No label'}
                        </span>
                      )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Due Date</span>
                  </div>
                  {isEditing
                    ? (
                        <input
                          type="date"
                          name="deadline"
                          value={deadline || ''}
                          onChange={handleInputChange}
                          disabled={loading}
                          className={cn(
                            'text-sm border border-gray-300 rounded-md px-3 py-1 text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
                            loading && 'opacity-50',
                          )}
                        />
                      )
                    : (
                        <span className="text-sm font-medium text-gray-900">
                          {deadline
                            ? new Date(deadline).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'No due date'}
                        </span>
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TaskDetail;

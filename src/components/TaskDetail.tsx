'use client';

import type { UpdateTaskData } from '@/utils/taskUtils';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Pencil,
  Tag,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import Dropdown, { type DropdownOption } from './Dropdown';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { updateTask } from '@/utils/taskUtils';

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
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(props);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update task. Please try again.');
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
                        {loading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Saving...
                          </>
                        ) : (
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
                    loading && 'opacity-50'
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
          <div className="lg:col-span-2 space-y-8">
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
                    <textarea
                      name="description"
                      value={description}
                      onChange={handleInputChange}
                      disabled={loading}
                      placeholder="Add a description for this task..."
                      className={cn(
                        'w-full border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none transition-all',
                        loading && 'opacity-50'
                      )}
                      rows={6}
                    />
                  )
                : (
                    <div className="prose prose-gray max-w-none">
                      {description ? (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
                      ) : (
                        <p className="text-gray-400 italic">No description provided</p>
                      )}
                    </div>
                  )}
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
                            onChange={(value) => handleStatusChange(value as 'todo' | 'in-progress' | 'done' | 'cancelled')}
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
                            onChange={(value) => handleUrgencyChange(value as 'low' | 'medium' | 'high' | 'critical')}
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
                            loading && 'opacity-50'
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
                            loading && 'opacity-50'
                          )}
                        />
                      )
                    : (
                        <span className="text-sm font-medium text-gray-900">
                          {deadline ? new Date(deadline).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'No due date'}
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

'use client';

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
import { useState } from 'react';

import { cn } from '@/utils/cn';

type TaskDetailProps = {
  title: string;
  description: string;
  label: string;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTask(props);
    setIsEditing(false);
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
    <div className="relative rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="absolute right-8 top-8 flex items-center gap-2">
        {isEditing
          ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </>
            )
          : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
      </div>
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        {isEditing
          ? (
              <input
                name="title"
                value={title}
                onChange={handleInputChange}
                className={cn(inputStyles, 'mb-3 text-3xl font-semibold')}
              />
            )
          : (
              <h1 className="mb-3 text-3xl font-semibold text-gray-900">{title}</h1>
            )}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            {isEditing
              ? (
                  <input
                    name="label"
                    value={label}
                    onChange={handleInputChange}
                    className={smallInputStyles}
                  />
                )
              : (
                  <span className="text-sm text-gray-600">{label}</span>
                )}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            {isEditing
              ? (
                  <input
                    name="deadline"
                    value={deadline}
                    onChange={handleInputChange}
                    className={smallInputStyles}
                  />
                )
              : (
                  <span className="text-sm text-gray-600">
                    Due:
                    {deadline}
                  </span>
                )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="mb-3 text-base font-semibold text-gray-800">
          Description
        </h2>
        {isEditing
          ? (
              <textarea
                name="description"
                value={description}
                onChange={handleInputChange}
                className={cn(inputStyles, 'leading-relaxed')}
                rows={5}
              />
            )
          : (
              <p className="leading-relaxed text-gray-700">{description}</p>
            )}
      </div>

      {/* Status and Urgency */}
      <div className="flex flex-wrap items-center gap-4">
        {isEditing
          ? (
              <>
                <select
                  name="status"
                  value={status}
                  onChange={handleInputChange}
                  className={cn(smallInputStyles, 'appearance-none')}
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
                <select
                  name="urgency"
                  value={urgency}
                  onChange={handleInputChange}
                  className={cn(smallInputStyles, 'appearance-none')}
                >
                  {Object.entries(urgencyConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </>
            )
          : (
              <>
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
              </>
            )}
      </div>
    </div>
  );
};

export default TaskDetail;

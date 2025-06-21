'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Archive,
  MoreVertical,
  Star,
  Clock,
  Trash,
  Plus,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDate, getStatusDisplayName, getUrgencyDisplayName } from '@/utils/taskUtils';

// Mock project data
const mockProjects = {
  1: {
    id: 1,
    name: 'Work Website',
    description: 'Website redesign and development project',
    color: '#3b82f6',
    totalTasks: 10,
    completedTasks: 8,
    createdAt: '2024-12-01',
  },
  2: {
    id: 2,
    name: 'Personal',
    description: 'Personal tasks and daily activities',
    color: '#10b981',
    totalTasks: 8,
    completedTasks: 2,
    createdAt: '2024-12-10',
  },
  3: {
    id: 3,
    name: 'Mobile App',
    description: 'Complete redesign of mobile application',
    color: '#f59e0b',
    totalTasks: 4,
    completedTasks: 0,
    createdAt: '2024-12-15',
  },
};

// Mock tasks for each project
const mockProjectTasks = {
  1: [
    {
      id: 1,
      title: 'Fix login bug',
      description: 'Bug fix needed for authentication system',
      status: 'in-progress',
      urgency: 'high',
      deadline: '2024-12-25',
      isStarred: true,
    },
    {
      id: 2,
      title: 'Research competitors',
      description: 'Analyze competitor websites and features',
      status: 'done',
      urgency: 'medium',
      deadline: '2024-12-20',
      isStarred: true,
    },
    {
      id: 3,
      title: 'Create wireframes',
      description: 'Design initial page layouts and user flows',
      status: 'todo',
      urgency: 'high',
      deadline: '2024-12-28',
      isStarred: false,
    },
  ],
  2: [
    {
      id: 4,
      title: 'Plan vacation',
      description: 'Research destinations and book flights',
      status: 'todo',
      urgency: 'medium',
      deadline: '2025-01-15',
      isStarred: false,
    },
    {
      id: 5,
      title: 'Fix car',
      description: 'Schedule maintenance appointment',
      status: 'in-progress',
      urgency: 'low',
      deadline: '2024-12-30',
      isStarred: false,
    },
  ],
  3: [
    {
      id: 6,
      title: 'Design mobile mockups',
      description: 'Create initial wireframes for mobile app',
      status: 'todo',
      urgency: 'high',
      deadline: '2024-12-30',
      isStarred: false,
    },
  ],
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

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = parseInt(id);
  
  const [project] = useState(mockProjects[projectId as keyof typeof mockProjects]);
  const [tasks, setTasks] = useState(mockProjectTasks[projectId as keyof typeof mockProjectTasks] || []);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Project not found</div>
      </div>
    );
  }

  const handleToggleStar = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isStarred: !task.isStarred } : task
    ));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="w-full">
      {/* Project Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className="w-6 h-6 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{project.name}</h1>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-4 w-80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {completedTasks}/{totalTasks} completed
                  </span>
                  <span className="text-sm text-gray-500">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: project.color,
                      width: `${(completedTasks / totalTasks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
            <button
              type="button"
              className="rounded-md p-2 hover:bg-gray-100 transition-colors"
              title="Edit Project"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
            <button
              type="button"
              className="rounded-md p-2 hover:bg-gray-100 transition-colors"
              title="Archive Project"
            >
              <Archive className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length > 0 ? (
        <div className="w-full overflow-hidden">
          <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
            {tasks.map(task => (
              <li
                key={task.id}
                className="group p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-3 mt-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        className="h-4 w-4 rounded border-gray-300 flex-shrink-0"
                        onChange={() => {}}
                      />
                      <button
                        type="button"
                        onClick={() => handleToggleStar(task.id)}
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

                  <div className="flex items-center gap-3 flex-shrink-0">
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
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border border-gray-200 rounded-lg bg-white">
          <div className="text-gray-400 mb-4">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-4">Add your first task to this project</p>
          <button
            type="button"
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      )}

      {/* New Task Modal Placeholder */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Task to {project.name}</h2>
            <p className="text-gray-600 mb-4">Task creation modal will be implemented here</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
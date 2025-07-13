'use client';

import type { FormEvent } from 'react';
import type { CreateTaskData } from '@/utils/taskUtils';
import { Circle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useProjectStore } from '@/stores/projectStore';
import { useTaskStore } from '@/stores/taskStore';
import { createTask } from '@/utils/taskUtils';
import MarkdownEditor from './MarkdownEditor';

type NewTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  selectedProjectId?: number;
};

const NewTaskModal = ({ isOpen, onClose, onSubmit, selectedProjectId }: NewTaskModalProps) => {
  // Zustand stores
  const { addTask } = useTaskStore();
  const {
    projects,
    setProjects,
    loading: projectsLoading,
    error: projectsError,
    setLoading: setProjectsLoading,
    setError: setProjectsError,
    getActiveProjects,
  } = useProjectStore();

  const [task, setTask] = useState({
    title: '',
    description: '',
    label: '',
    projectId: selectedProjectId || '', // No default project - make it optional
    status: 'todo',
    urgency: 'medium',
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects when modal opens
  useEffect(() => {
    if (isOpen && projects.length === 0) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const response = await fetch('/dashboard/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError('Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value === '' ? '' : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Form validation
    if (!task.title.trim()) {
      toast.error('Task title is required');
      setLoading(false);
      return;
    }

    try {
      const taskData: CreateTaskData = {
        title: task.title,
        description: task.description || undefined,
        label: task.label || undefined,
        projectId: task.projectId ? Number(task.projectId) : undefined,
        status: task.status as any,
        urgency: task.urgency as any,
        deadline: task.deadline || undefined,
      };

      const newTask = await createTask(taskData);
      addTask(newTask);
      onSubmit(newTask);
      onClose();
      toast.success(`Task "${task.title}" created successfully`);

      // Reset form
      setTask({
        title: '',
        description: '',
        label: '',
        projectId: selectedProjectId || '',
        status: 'todo',
        urgency: 'medium',
        deadline: '',
      });
    } catch (err) {
      setError('Failed to create task. Please try again.');
      toast.error('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const inputStyles
    = 'w-full rounded-md border-gray-300 bg-gray-50 p-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500';
  const labelStyles = 'mb-1 block text-sm font-medium text-gray-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          Create a New Task
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className={labelStyles}>
              Task Title
            </label>
            <input
              id="title"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              className={inputStyles}
              placeholder="e.g., Design the new landing page"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelStyles}>
              Description
            </label>
            <MarkdownEditor
              value={task.description}
              onChange={value => setTask(prev => ({ ...prev, description: value }))}
              placeholder="Add a more detailed description..."
              disabled={loading}
              height={200}
            />
          </div>

          {/* Project Selection */}
          <div>
            <label htmlFor="projectId" className={labelStyles}>
              Project (Optional)
            </label>
            <select
              id="projectId"
              name="projectId"
              value={task.projectId}
              onChange={handleInputChange}
              className={inputStyles}
              disabled={loading || projectsLoading}
            >
              <option value="">No Project</option>
              {projectsLoading
                ? (
                    <option disabled>Loading projects...</option>
                  )
                : (
                    getActiveProjects().map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))
                  )}
            </select>
            {/* Visual Project Indicator */}
            {task.projectId && (
              <div className="mt-2 flex items-center gap-2">
                <Circle
                  className="h-3 w-3"
                  style={{
                    color: getActiveProjects().find(p => p.id === Number(task.projectId))?.color,
                    fill: getActiveProjects().find(p => p.id === Number(task.projectId))?.color,
                  }}
                />
                <span className="text-xs text-gray-500">
                  Task will be added to
                  {' '}
                  {getActiveProjects().find(p => p.id === Number(task.projectId))?.name}
                </span>
              </div>
            )}
            {!task.projectId && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  Task will not be assigned to any project
                </span>
              </div>
            )}
            {projectsError && (
              <div className="mt-2 text-xs text-red-600">
                {projectsError}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="label" className={labelStyles}>
                Label
              </label>
              <input
                id="label"
                name="label"
                value={task.label}
                onChange={handleInputChange}
                className={inputStyles}
                placeholder="e.g., Frontend"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="deadline" className={labelStyles}>
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={task.deadline}
                onChange={handleInputChange}
                className={inputStyles}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="status" className={labelStyles}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={task.status}
                onChange={handleInputChange}
                className={inputStyles}
                disabled={loading}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label htmlFor="urgency" className={labelStyles}>
                Urgency
              </label>
              <select
                id="urgency"
                name="urgency"
                value={task.urgency}
                onChange={handleInputChange}
                className={inputStyles}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-200 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;

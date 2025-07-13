'use client';

import { Circle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Project = {
  id: number;
  name: string;
  description: string | null;
  color: string;
};

type NewProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: any) => void;
  editProject?: Project | null; // Optional project to edit
};

// Predefined color palette for projects
const projectColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
];

const NewProjectModal = ({ isOpen, onClose, onSubmit, editProject }: NewProjectModalProps) => {
  const [project, setProject] = useState({
    name: '',
    description: '',
    color: projectColors[0].value,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when editing a project
  useEffect(() => {
    if (editProject) {
      setProject({
        name: editProject.name,
        description: editProject.description || '',
        color: editProject.color,
      });
    } else {
      // Reset form when creating new project
      setProject({
        name: '',
        description: '',
        color: projectColors[0].value,
      });
    }
    setError(null);
  }, [editProject, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color: string) => {
    setProject(prev => ({ ...prev, color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project.name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isEditing = !!editProject;
      const url = isEditing
        ? `/dashboard/api/projects/${editProject.id}`
        : '/dashboard/api/projects';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: project.name.trim(),
          description: project.description.trim() || null,
          color: project.color,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} project`);
      }

      const resultProject = await response.json();
      onSubmit(resultProject);
      onClose();

      // Reset form only if creating new project
      if (!isEditing) {
        setProject({
          name: '',
          description: '',
          color: projectColors[0].value,
        });
      }
    } catch (err) {
      const action = editProject ? 'update' : 'create';
      setError(err instanceof Error ? err.message : `Failed to ${action} project. Please try again.`);
      console.error(`Error ${action}ing project:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const inputStyles = 'w-full rounded-md border-gray-300 bg-gray-50 p-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500';
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
          {editProject ? 'Edit Project' : 'Create New Project'}
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelStyles}>
              Project Name
            </label>
            <input
              id="name"
              name="name"
              value={project.name}
              onChange={handleInputChange}
              className={inputStyles}
              placeholder="e.g., Website Redesign"
              required
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelStyles}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleInputChange}
              className={inputStyles}
              placeholder="Brief description of the project..."
              rows={3}
              disabled={loading}
              maxLength={500}
            />
          </div>

          <div>
            <label className={labelStyles}>
              Project Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {projectColors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorSelect(color.value)}
                  className={`flex items-center gap-2 rounded-lg p-3 border-2 transition-all ${
                    project.color === color.value
                      ? 'border-gray-400 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <Circle
                    className="h-4 w-4"
                    style={{ color: color.value, fill: color.value }}
                  />
                  <span className="text-sm font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
            <div className="flex items-center gap-3">
              <Circle
                className="h-4 w-4"
                style={{ color: project.color, fill: project.color }}
              />
              <div>
                <p className="font-medium text-gray-900">
                  {project.name || 'Project Name'}
                </p>
                <p className="text-sm text-gray-500">
                  {project.description || 'Project description will appear here'}
                </p>
              </div>
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
              disabled={loading || !project.name.trim()}
            >
              {loading
                ? (editProject ? 'Updating...' : 'Creating...')
                : (editProject ? 'Update Project' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;

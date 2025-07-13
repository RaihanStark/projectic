'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  MoreVertical,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import NewProjectModal from '@/components/NewProjectModal';
import { useProjectStore } from '@/stores/projectStore';

type Project = {
  id: number;
  name: string;
  description: string | null;
  color: string;
  updatedAt: Date;
  createdAt: Date;
  totalTasks?: number;
  completedTasks?: number;
  overdueTasks?: number;
  dueTodayTasks?: number;
};

export default function ProjectsPage() {
  const { projects, setProjects, loading, error, setLoading, setError } = useProjectStore();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/dashboard/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (newProject: any) => {
    await fetchProjects();
    toast.success('Project created successfully');
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowNewProjectModal(true);
  };

  const handleUpdateProject = async (updatedProject: any) => {
    await fetchProjects();
    toast.success('Project updated successfully');
    setEditingProject(null);
  };

  const handleCloseModal = () => {
    setShowNewProjectModal(false);
    setEditingProject(null);
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getProgressBarWidth = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const formatLastActivity = (updatedAt: Date) => {
    try {
      return formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  const activeProjects = projects;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchProjects}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600">Organize your tasks by project</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="w-full overflow-hidden">
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
          {activeProjects.map(project => (
            <li
              key={project.id}
              className="group p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-start gap-3 w-full">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex items-center gap-3 mt-1">
                    {/* Project Color Indicator */}
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                  </div>

                  <Link
                    href={`/dashboard/project/${project.id}`}
                    className="flex-1 min-w-0 hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {project.description || 'No description'}
                      </p>

                      {/* Progress and Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <span className="font-medium">
                          {project.completedTasks || 0}
                          /
                          {project.totalTasks || 0}
                          {' '}
                          tasks
                        </span>
                        {project.overdueTasks && project.overdueTasks > 0 && (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            <span>
                              {project.overdueTasks}
                              {' '}
                              overdue
                            </span>
                          </div>
                        )}
                        {project.dueTodayTasks && project.dueTodayTasks > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-orange-500" />
                            <span>
                              {project.dueTodayTasks}
                              {' '}
                              due today
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Project Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      className="rounded-md p-2 hover:bg-gray-200"
                      title="Edit Project"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  {/* More menu */}
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-md p-2 hover:bg-gray-200"
                      title="More Options"
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

      {/* Empty State */}
      {activeProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Create your first project to get started</p>
          <button
            type="button"
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        </div>
      )}

      {/* New/Edit Project Modal */}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={handleCloseModal}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        editProject={editingProject}
      />
    </div>
  );
}

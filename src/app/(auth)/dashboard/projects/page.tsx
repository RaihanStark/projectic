'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Archive,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  MoreVertical,
  Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import NewProjectModal from '@/components/NewProjectModal';
import { useProjectStore } from '@/stores/projectStore';

type Project = {
  id: number;
  name: string;
  description: string | null;
  color: string;
  isArchived: boolean;
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

  const handleArchiveProject = async (projectId: number) => {
    try {
      const response = await fetch(`/dashboard/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isArchived: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to archive project');
      }

      await fetchProjects();
      toast.success('Project archived successfully');
    } catch (error) {
      console.error('Error archiving project:', error);
      toast.error('Failed to archive project');
    }
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

  const activeProjects = projects.filter(p => !p.isArchived);

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

      <div className="grid gap-4">
        {activeProjects.map(project => (
          <div
            key={project.id}
            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Project Color Indicator */}
                <div
                  className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {project.completedTasks || 0}
                        /
                        {project.totalTasks || 0}
                        {' '}
                        tasks completed
                      </span>
                      <span className="text-sm text-gray-500">
                        {getProgressPercentage(project.completedTasks || 0, project.totalTasks || 0)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: project.color,
                          width: `${getProgressBarWidth(project.completedTasks || 0, project.totalTasks || 0)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {project.overdueTasks && project.overdueTasks > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>
                          {project.overdueTasks}
                          {' '}
                          overdue
                        </span>
                      </div>
                    )}
                    {project.dueTodayTasks && project.dueTodayTasks > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>
                          {project.dueTodayTasks}
                          {' '}
                          due today
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Updated
                        {formatLastActivity(project.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="rounded-md p-2 hover:bg-gray-100 transition-colors"
                  title="Edit Project"
                  onClick={() => handleEditProject(project)}
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="rounded-md p-2 hover:bg-gray-100 transition-colors"
                  title="Archive Project"
                  onClick={() => handleArchiveProject(project.id)}
                >
                  <Archive className="h-4 w-4 text-gray-600" />
                </button>
                <div className="relative">
                  <button
                    type="button"
                    className="rounded-md p-2 hover:bg-gray-100 transition-colors"
                    title="More Options"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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

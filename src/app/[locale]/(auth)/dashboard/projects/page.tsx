'use client';

import { useState } from 'react';
import {
  MoreVertical,
  Plus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Archive,
  Edit,
  Trash,
  Star,
} from 'lucide-react';

// Mock project data for UI display
const mockProjects = [
  {
    id: 1,
    name: 'Work Website',
    description: 'Website redesign and development project',
    color: '#3b82f6',
    totalTasks: 10,
    completedTasks: 8,
    overdueTasks: 2,
    dueTodayTasks: 3,
    lastActivity: '2 hours ago',
    isStarred: true,
  },
  {
    id: 2,
    name: 'Personal',
    description: 'Personal tasks and daily activities',
    color: '#10b981',
    totalTasks: 8,
    completedTasks: 2,
    overdueTasks: 0,
    dueTodayTasks: 1,
    lastActivity: 'yesterday',
    isStarred: false,
  },
  {
    id: 3,
    name: 'Mobile App',
    description: 'Complete redesign of mobile application',
    color: '#f59e0b',
    totalTasks: 4,
    completedTasks: 0,
    overdueTasks: 0,
    dueTodayTasks: 0,
    lastActivity: '3 days ago',
    isStarred: false,
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const handleStarProject = (projectId: number) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, isStarred: !project.isStarred }
        : project
    ));
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getProgressBarWidth = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

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
        {projects.map((project) => (
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {project.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleStarProject(project.id)}
                      className="flex-shrink-0"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          project.isStarred
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {project.completedTasks}/{project.totalTasks} tasks completed
                      </span>
                      <span className="text-sm text-gray-500">
                        {getProgressPercentage(project.completedTasks, project.totalTasks)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: project.color,
                          width: `${getProgressBarWidth(project.completedTasks, project.totalTasks)}%`,
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Project Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {project.overdueTasks > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>{project.overdueTasks} overdue</span>
                      </div>
                    )}
                    {project.dueTodayTasks > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>{project.dueTodayTasks} due today</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {project.lastActivity}</span>
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
      {projects.length === 0 && (
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

      {/* New Project Modal Placeholder */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <p className="text-gray-600 mb-4">Project creation modal will be implemented here</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
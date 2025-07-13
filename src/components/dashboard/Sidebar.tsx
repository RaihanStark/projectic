'use client';

import {
  Circle,
  Folder,
  FolderOpen,
  Home,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useProjectStore } from '@/stores/projectStore';

type SidebarProps = {
  onNewTaskClick: () => void;
  onNewProjectClick?: () => void;
  taskCount?: number;
};

const Sidebar = ({ onNewTaskClick, onNewProjectClick, taskCount }: SidebarProps) => {
  const pathname = usePathname();
  const { projects, getActiveProjects, setProjects } = useProjectStore();
  const activeProjects = getActiveProjects();

  useEffect(() => {
    // Fetch projects if not already loaded
    const fetchProjects = async () => {
      try {
        const response = await fetch('/dashboard/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (projects.length === 0) {
      fetchProjects();
    }
  }, [projects.length, setProjects]);

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Folder className="h-6 w-6" />
          <span>Projectic</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-4 py-4 text-sm font-medium">
          <div className="px-2 py-2">
            <button
              type="button"
              onClick={onNewTaskClick}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname === '/dashboard'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Home className="h-4 w-4" />
            All Tasks
            <span className="ml-auto flex h-6 w-9 items-center justify-center rounded-full bg-gray-200 text-xs">
              {taskCount}
            </span>
          </Link>
          <Link
            href="/dashboard/projects"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname === '/dashboard/projects'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FolderOpen className="h-4 w-4" />
            My Projects
            <span className="ml-auto flex h-6 w-9 items-center justify-center rounded-full bg-gray-200 text-xs">
              {activeProjects.length}
            </span>
          </Link>
        </nav>

        {/* Projects Section */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2 px-3">
            <h3 className="text-xs font-semibold uppercase text-gray-500">
              Projects
            </h3>
            <button
              type="button"
              onClick={onNewProjectClick}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Add Project"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <nav className="grid items-start text-sm font-medium space-y-1">
            {activeProjects.map(project => (
              <Link
                key={project.id}
                href={`/dashboard/project/${project.id}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === `/dashboard/project/${project.id}`
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title={project.name}
              >
                <Circle
                  className="h-4 w-4 flex-shrink-0"
                  style={{
                    color: project.color,
                    fill: project.color,
                  }}
                />
                <span className="flex-1 truncate min-w-0">
                  {project.name.length > 19 ? `${project.name.substring(0, 19)}...` : project.name}
                </span>
                <span className="flex h-5 w-6 items-center justify-center rounded-full bg-gray-200 text-xs flex-shrink-0">
                  {project.totalTasks || 0}
                </span>
              </Link>
            ))}
            {activeProjects.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">No projects yet</p>
            )}
          </nav>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;

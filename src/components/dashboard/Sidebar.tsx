'use client';

import {
  Circle,
  Folder,
  Home,
  Plus,
  FolderOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type SidebarProps = {
  onNewTaskClick: () => void;
  onNewProjectClick?: () => void;
  taskCount?: number;
};

// Mock project data for UI display
const mockProjects = [
  { id: 1, name: 'Work Website', color: '#3b82f6', taskCount: 8 },
  { id: 2, name: 'Personal', color: '#10b981', taskCount: 12 },
  { id: 3, name: 'Mobile App', color: '#f59e0b', taskCount: 4 },
];

const Sidebar = ({ onNewTaskClick, onNewProjectClick, taskCount }: SidebarProps) => {
  const [currentPath, setCurrentPath] = useState('/dashboard');

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
              currentPath === '/dashboard' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setCurrentPath('/dashboard')}
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
              currentPath === '/dashboard/projects' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setCurrentPath('/dashboard/projects')}
          >
            <FolderOpen className="h-4 w-4" />
            My Projects
            <span className="ml-auto flex h-6 w-9 items-center justify-center rounded-full bg-gray-200 text-xs">
              3
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
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/project/${project.id}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  currentPath === `/dashboard/project/${project.id}` 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setCurrentPath(`/dashboard/project/${project.id}`)}
              >
                <Circle 
                  className="h-4 w-4" 
                  style={{ 
                    color: project.color, 
                    fill: project.color 
                  }} 
                />
                <span className="flex-1 truncate">{project.name}</span>
                <span className="flex h-5 w-6 items-center justify-center rounded-full bg-gray-200 text-xs">
                  {project.taskCount}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Labels Section */}
        <div className="px-4 mt-6">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500">
            Labels
          </h3>
          <nav className="grid items-start text-sm font-medium">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Circle className="h-4 w-4 fill-red-500 text-red-500" />
              Important
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Circle className="h-4 w-4 fill-green-500 text-green-500" />
              Updates
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

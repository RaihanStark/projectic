'use client';

import {
  Circle,
  Folder,
  Home,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

type SidebarProps = {
  onNewTaskClick: () => void;
  taskCount?: number;
};

const Sidebar = ({ onNewTaskClick, taskCount = 0 }: SidebarProps) => {
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
            className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900"
          >
            <Home className="h-4 w-4" />
            All Tasks
            <span className="ml-auto flex h-6 w-9 items-center justify-center rounded-full bg-gray-200 text-xs">
              {taskCount}
            </span>
          </Link>
        </nav>
        <div className="px-4">
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

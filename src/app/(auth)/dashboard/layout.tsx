'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import NewTaskModal from '@/components/NewTaskModal';
import NewProjectModal from '@/components/NewProjectModal';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [taskCount, setTaskCount] = useState(0);

  // TODO: use zustand later
  useEffect(() => {
    // @ts-expect-error: Adding updateTaskCount to window for task count updates
    window.updateTaskCount = (count: number) => setTaskCount(count);
    return () => {
      // @ts-expect-error: Removing updateTaskCount from window
      delete window.updateTaskCount;
    };
  }, []);

  const handleCreateTask = () => {
    // @ts-expect-error: Accessing refreshTasks on window for dashboard refresh
    if (window.refreshTasks) {
      // @ts-expect-error: Accessing refreshTasks on window for dashboard refresh
      window.refreshTasks();
    }
  };

  const handleCreateProject = (project: any) => {
    console.log('New project created:', project);
    // In real app, this would update the projects list
  };

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[auto_1fr]">
        <Sidebar 
          onNewTaskClick={() => setTaskModalOpen(true)}
          onNewProjectClick={() => setProjectModalOpen(true)}
          taskCount={taskCount}
        />
        <div className="flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto bg-gray-50 p-4">
            {children}
          </main>
        </div>
      </div>
      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
      <NewProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </>
  );
}

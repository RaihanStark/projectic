'use client';

import type { Task } from '@/utils/taskUtils';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import TaskDetail from '@/components/TaskDetail';
import { fetchTask } from '@/utils/taskUtils';

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const { id } = await params;
        const taskData = await fetchTask(Number.parseInt(id));
        setTask(taskData);
      } catch (err) {
        console.error('Error loading task:', err);
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading task...</div>
      </div>
    );
  }

  if (error || !task) {
    notFound();
  }

  return (
    <TaskDetail
      id={task.id}
      title={task.title}
      description={task.description || ''}
      label={task.label || ''}
      status={task.status}
      urgency={task.urgency}
      deadline={task.deadline ? task.deadline.toISOString().split('T')[0] || '' : ''}
    />
  );
}

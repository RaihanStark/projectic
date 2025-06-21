export type Task = {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  label: string | null;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadline: Date | string | null;
  isStarred: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  label?: string;
  status?: 'todo' | 'in-progress' | 'done' | 'cancelled';
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  isStarred?: boolean;
};

export type UpdateTaskData = {} & Partial<CreateTaskData>;

const API_BASE = '/dashboard/api/tasks';

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
}

export async function fetchTask(id: number): Promise<Task> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
  return response.json();
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  return response.json();
}

export async function updateTask(id: number, taskData: UpdateTaskData): Promise<Task> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}

export async function toggleTaskStar(id: number, isStarred: boolean): Promise<Task> {
  return updateTask(id, { isStarred });
}

export function formatDate(date: Date | string | null): string {
  if (!date) {
    return '';
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function getStatusDisplayName(status: Task['status']): string {
  const statusMap = {
    'todo': 'Todo',
    'in-progress': 'In Progress',
    'done': 'Done',
    'cancelled': 'Cancelled',
  };
  return statusMap[status];
}

export function getUrgencyDisplayName(urgency: Task['urgency']): string {
  const urgencyMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return urgencyMap[urgency];
}

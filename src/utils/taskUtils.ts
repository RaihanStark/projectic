// Sub-task types
export type SubTask = {
  id: number;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Task = {
  id: number;
  userId: number;
  projectId: number | null;
  title: string;
  description: string | null;
  label: string | null;
  status: 'todo' | 'in-progress' | 'done' | 'cancelled';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadline: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  subtasks?: SubTask[];
  project?: {
    id: number;
    name: string;
    color: string;
  } | null;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  label?: string;
  projectId?: number | null;
  status?: 'todo' | 'in-progress' | 'done' | 'cancelled';
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
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

export async function bulkDeleteTasks(taskIds: number[]): Promise<void> {
  const response = await fetch(`${API_BASE}/bulk-delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to delete tasks');
  }
}

export async function bulkUpdateTaskStatus(taskIds: number[], status: string): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/bulk-update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskIds, status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update tasks');
  }
  const data = await response.json();
  return data.updatedTasks;
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

export type CreateSubTaskData = {
  title: string;
};

export type UpdateSubTaskData = {
  title?: string;
  completed?: boolean;
};

// Sub-task API functions
export async function fetchSubTasks(taskId: number): Promise<SubTask[]> {
  const response = await fetch(`${API_BASE}/${taskId}/subtasks`);
  if (!response.ok) {
    throw new Error('Failed to fetch sub-tasks');
  }
  const data = await response.json();
  return data.subTasks;
}

export async function createSubTask(taskId: number, subTaskData: CreateSubTaskData): Promise<SubTask> {
  const response = await fetch(`${API_BASE}/${taskId}/subtasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subTaskData),
  });
  if (!response.ok) {
    throw new Error('Failed to create sub-task');
  }
  const data = await response.json();
  return data.subTask;
}

export async function updateSubTask(taskId: number, subTaskId: number, subTaskData: UpdateSubTaskData): Promise<SubTask> {
  const response = await fetch(`${API_BASE}/${taskId}/subtasks/${subTaskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subTaskData),
  });
  if (!response.ok) {
    throw new Error('Failed to update sub-task');
  }
  const data = await response.json();
  return data.subTask;
}

export async function deleteSubTask(taskId: number, subTaskId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${taskId}/subtasks/${subTaskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete sub-task');
  }
}


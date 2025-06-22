import { create } from 'zustand';
import type { Task } from '@/utils/taskUtils';

export interface SubTaskCount {
  completed: number;
  total: number;
}

interface TaskState {
  // Task data
  tasks: Task[];
  subTaskCounts: { [taskId: number]: SubTaskCount };
  loading: boolean;
  error: string | null;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  deleteTask: (taskId: number) => void;
  deleteTasks: (taskIds: number[]) => void;
  
  // Sub-task counts
  setSubTaskCounts: (counts: { [taskId: number]: SubTaskCount }) => void;
  updateSubTaskCount: (taskId: number, completed: number, total: number) => void;
  removeSubTaskCount: (taskId: number) => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Task count for sidebar
  getTaskCount: () => number;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: [],
  subTaskCounts: {},
  loading: false,
  error: null,
  
  // Task actions
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),
  
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    )
  })),
  
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== taskId)
  })),
  
  deleteTasks: (taskIds) => set((state) => ({
    tasks: state.tasks.filter(task => !taskIds.includes(task.id))
  })),
  
  // Sub-task count actions
  setSubTaskCounts: (counts) => set({ subTaskCounts: counts }),
  
  updateSubTaskCount: (taskId, completed, total) => set((state) => {
    if (total === 0) {
      // Remove the task from sub-task counts when no sub-tasks exist
      const { [taskId]: removed, ...rest } = state.subTaskCounts;
      return { subTaskCounts: rest };
    }
    return {
      subTaskCounts: {
        ...state.subTaskCounts,
        [taskId]: { completed, total }
      }
    };
  }),
  
  removeSubTaskCount: (taskId) => set((state) => {
    const { [taskId]: removed, ...rest } = state.subTaskCounts;
    return { subTaskCounts: rest };
  }),
  
  // Loading state actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Computed values
  getTaskCount: () => get().tasks.length,
}));
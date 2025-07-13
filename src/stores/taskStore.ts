import type { Task } from '@/utils/taskUtils';
import { create } from 'zustand';

export type SubTaskCount = {
  completed: number;
  total: number;
};

type TaskState = {
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
};

export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: [],
  subTaskCounts: {},
  loading: false,
  error: null,

  // Task actions
  setTasks: (tasks) => {
    // Calculate subtask counts when setting tasks
    const counts: { [taskId: number]: SubTaskCount } = {};
    tasks.forEach((task) => {
      if (task.subtasks && task.subtasks.length > 0) {
        counts[task.id] = {
          completed: task.subtasks.filter(st => st.completed).length,
          total: task.subtasks.length,
        };
      }
    });
    set({ tasks, subTaskCounts: counts });
  },

  addTask: task => set((state) => {
    const newCounts = { ...state.subTaskCounts };
    if (task.subtasks && task.subtasks.length > 0) {
      newCounts[task.id] = {
        completed: task.subtasks.filter(st => st.completed).length,
        total: task.subtasks.length,
      };
    }
    return {
      tasks: [...state.tasks, task],
      subTaskCounts: newCounts,
    };
  }),

  updateTask: (taskId, updates) => set((state) => {
    const updatedTasks = state.tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task,
    );

    // Recalculate subtask counts if the updated task has subtasks
    const updatedTask = updatedTasks.find(t => t.id === taskId);
    const newCounts = { ...state.subTaskCounts };

    if (updatedTask?.subtasks) {
      if (updatedTask.subtasks.length > 0) {
        newCounts[taskId] = {
          completed: updatedTask.subtasks.filter(st => st.completed).length,
          total: updatedTask.subtasks.length,
        };
      } else {
        delete newCounts[taskId];
      }
    }

    return {
      tasks: updatedTasks,
      subTaskCounts: newCounts,
    };
  }),

  deleteTask: taskId => set((state) => {
    const newCounts = { ...state.subTaskCounts };
    delete newCounts[taskId];
    return {
      tasks: state.tasks.filter(task => task.id !== taskId),
      subTaskCounts: newCounts,
    };
  }),

  deleteTasks: taskIds => set((state) => {
    const newCounts = { ...state.subTaskCounts };
    taskIds.forEach(id => delete newCounts[id]);
    return {
      tasks: state.tasks.filter(task => !taskIds.includes(task.id)),
      subTaskCounts: newCounts,
    };
  }),

  // Sub-task count actions
  setSubTaskCounts: counts => set({ subTaskCounts: counts }),

  updateSubTaskCount: (taskId, completed, total) => set((state) => {
    if (total === 0) {
      // Remove the task from sub-task counts when no sub-tasks exist
      const { [taskId]: removed, ...rest } = state.subTaskCounts;
      return { subTaskCounts: rest };
    }
    return {
      subTaskCounts: {
        ...state.subTaskCounts,
        [taskId]: { completed, total },
      },
    };
  }),

  removeSubTaskCount: taskId => set((state) => {
    const { [taskId]: removed, ...rest } = state.subTaskCounts;
    return { subTaskCounts: rest };
  }),

  // Loading state actions
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),

  // Computed values
  getTaskCount: () => get().tasks.length,
}));

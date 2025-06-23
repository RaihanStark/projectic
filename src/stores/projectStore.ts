import { create } from 'zustand';

export interface Project {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  color: string;
  isArchived: boolean;
  updatedAt: Date;
  createdAt: Date;
  // Computed properties
  totalTasks?: number;
  completedTasks?: number;
  overdueTasks?: number;
  dueTodayTasks?: number;
}

interface ProjectState {
  // Project data
  projects: Project[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: number, updates: Partial<Project>) => void;
  deleteProject: (projectId: number) => void;
  archiveProject: (projectId: number) => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getProjectById: (projectId: number) => Project | undefined;
  getActiveProjects: () => Project[];
  getArchivedProjects: () => Project[];
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  loading: false,
  error: null,
  
  // Project actions
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),
  
  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    )
  })),
  
  deleteProject: (projectId) => set((state) => ({
    projects: state.projects.filter(project => project.id !== projectId)
  })),
  
  archiveProject: (projectId) => set((state) => ({
    projects: state.projects.map(project => 
      project.id === projectId ? { ...project, isArchived: true } : project
    )
  })),
  
  // Loading state actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Getters
  getProjectById: (projectId) => get().projects.find(p => p.id === projectId),
  getActiveProjects: () => get().projects.filter(p => !p.isArchived),
  getArchivedProjects: () => get().projects.filter(p => p.isArchived),
}));
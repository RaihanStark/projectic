import { create } from 'zustand';

export interface Document {
  id: number;
  title: string;
  emoji?: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  folder?: string;
  shareId?: string;
  isPublic?: boolean;
}

interface DocumentState {
  // Document data
  documents: Document[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (documentId: number, updates: Partial<Document>) => void;
  deleteDocument: (documentId: number) => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Document count for sidebar
  getDocumentCount: () => number;
  
  // Get document by ID
  getDocumentById: (id: number) => Document | undefined;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  // Initial state
  documents: [],
  loading: false,
  error: null,
  
  // Document actions
  setDocuments: (documents) => set({ documents }),
  
  addDocument: (document) => set((state) => ({
    documents: [document, ...state.documents]
  })),
  
  updateDocument: (documentId, updates) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === documentId ? { ...doc, ...updates } : doc
    )
  })),
  
  deleteDocument: (documentId) => set((state) => ({
    documents: state.documents.filter(doc => doc.id !== documentId)
  })),
  
  // Loading state actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Computed values
  getDocumentCount: () => get().documents.length,
  getDocumentById: (id) => get().documents.find(doc => doc.id === id),
}));
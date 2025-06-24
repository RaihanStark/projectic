'use client';

import type { Document } from '@/stores/documentStore';
import {
  ArrowLeft,
  Clock,
  Copy,
  Download,
  FileText,
  FolderOpen,
  MoreVertical,
  Plus,
  Search,
  Share2,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import MarkdownEditor from '@/components/MarkdownEditor';
import { useDocumentStore } from '@/stores/documentStore';
import { cn } from '@/utils/cn';

export default function DocumentsPage() {
  // Zustand store
  const {
    documents,
    loading,
    error,
    setDocuments,
    addDocument,
    setLoading,
    setError,
  } = useDocumentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showPreview, setShowPreview] = useState(false);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocEmoji, setNewDocEmoji] = useState('📄');
  const [newDocFolder, setNewDocFolder] = useState('General');

  const filteredDocuments = (documents || []).filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    || (doc.content || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const commonEmojis = ['📄', '📝', '📚', '🎯', '💡', '🚀', '🗺️', '🎨', '💻', '📊', '✅', '⚡'];
  const folders = ['General', 'Planning', 'Meetings', 'Documentation', 'Design', 'Development'];

  // Generate UUID v4
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Fetch documents from API
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/dashboard/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const documents = await response.json();
      setDocuments(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents');
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setDocuments, setError]);

  // Load documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCreateDocument = async () => {
    if (!newDocTitle.trim()) {
      return;
    }

    try {
      const response = await fetch('/dashboard/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newDocTitle,
          emoji: newDocEmoji,
          content: `# ${newDocTitle}\n\n`,
          folder: newDocFolder,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const newDoc = await response.json();

      addDocument(newDoc);
      setShowNewDocModal(false);
      setNewDocTitle('');
      setNewDocEmoji('📄');
      setNewDocFolder('General');

      toast.success('Document created successfully');

      // Navigate to the new document editor
      window.location.href = `/dashboard/documents/${newDoc.id}`;
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    }
  };

  const formatDate = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today';
    }
    if (days === 1) {
      return 'Yesterday';
    }
    if (days < 7) {
      return `${days} days ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <div
      className={cn(
        'group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md',
        selectedDoc?.id === doc.id && 'ring-2 ring-blue-500',
      )}
      onClick={() => {
        setSelectedDoc(doc);
        setShowPreview(true);
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{doc.emoji || '📄'}</span>
          <h3 className="font-medium text-gray-900">{doc.title}</h3>
        </div>
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            className="rounded p-1 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              // Show menu
            }}
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
        {doc.content.replace(/[#*`]/g, '').substring(0, 150)}
        ...
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {doc.folder && (
            <span className="flex items-center gap-1">
              <FolderOpen className="h-3 w-3" />
              {doc.folder}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(doc.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            </div>
            <button
              type="button"
              onClick={() => setShowNewDocModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600"
            >
              <Plus className="h-4 w-4" />
              New Document
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded p-2',
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded p-2',
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600',
                )}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Documents List/Grid */}
        <div className="py-6">
          {loading
            ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
                  <p className="text-gray-600">Loading documents...</p>
                </div>
              )
            : filteredDocuments.length === 0
              ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="mb-4 h-12 w-12 text-gray-300" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">No documents found</h3>
                    <p className="mb-4 text-sm text-gray-500">
                      {searchQuery ? 'Try adjusting your search' : 'Create your first document to get started'}
                    </p>
                    {!searchQuery && (
                      <button
                        type="button"
                        onClick={() => setShowNewDocModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600"
                      >
                        <Plus className="h-4 w-4" />
                        Create Document
                      </button>
                    )}
                  </div>
                )
              : (
                  <div className={cn(
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                      : 'space-y-4',
                  )}
                  >
                    {filteredDocuments.map(doc => (
                      <DocumentCard key={doc.id} doc={doc} />
                    ))}
                  </div>
                )}
        </div>
      </div>

      {/* Preview Sidebar Backdrop */}
      {showPreview && (
        <div
          className="fixed inset-0 z-40 bg-black/20 transition-opacity"
          onClick={() => setShowPreview(false)}
        />
      )}

      {/* Preview Sidebar */}
      <div className={cn(
        'fixed right-0 top-0 z-50 h-full w-full sm:w-96 md:w-120 border-l border-gray-200 bg-white shadow-xl transition-transform duration-300',
        showPreview && selectedDoc ? 'translate-x-0' : 'translate-x-full',
      )}
      >
        {selectedDoc && (
          <div className="flex h-full flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedDoc.emoji || '📄'}</span>
                <h2 className="font-semibold text-gray-900">{selectedDoc.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded p-2 hover:bg-gray-100"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="rounded p-2 hover:bg-gray-100"
                  title="Download"
                >
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="rounded p-2 hover:bg-gray-100"
                  title="Share"
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="rounded p-2 hover:bg-gray-100"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="rounded p-2 hover:bg-gray-100"
                >
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <MarkdownEditor
                value={selectedDoc.content}
                onChange={() => {}}
                preview="preview"
                height={600}
              />
            </div>

            {/* Preview Footer */}
            <div className="border-t border-gray-200 px-6 py-3 text-sm text-gray-500">
              <div className="flex items-center justify-between">
                <span>
                  Last updated
                  {formatDate(selectedDoc.updatedAt)}
                </span>
                <Link
                  href={`/dashboard/documents/${selectedDoc.id}`}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Open Editor →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Document Modal */}
      {showNewDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowNewDocModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Create New Document</h2>

            {/* Emoji Picker */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Choose an icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {commonEmojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewDocEmoji(emoji)}
                    className={cn(
                      'rounded-lg p-3 text-2xl transition-all hover:scale-110',
                      newDocEmoji === emoji
                        ? 'bg-blue-100 ring-2 ring-blue-500'
                        : 'hover:bg-gray-100',
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-6">
              <label htmlFor="doc-title" className="mb-2 block text-sm font-medium text-gray-700">
                Document Title
              </label>
              <input
                id="doc-title"
                type="text"
                value={newDocTitle}
                onChange={e => setNewDocTitle(e.target.value)}
                placeholder="Enter document title..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Folder Selection */}
            <div className="mb-6">
              <label htmlFor="doc-folder" className="mb-2 block text-sm font-medium text-gray-700">
                Folder
              </label>
              <select
                id="doc-folder"
                value={newDocFolder}
                onChange={e => setNewDocFolder(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {folders.map(folder => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowNewDocModal(false);
                  setNewDocTitle('');
                  setNewDocEmoji('📄');
                  setNewDocFolder('General');
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateDocument}
                disabled={!newDocTitle.trim()}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium text-white',
                  newDocTitle.trim()
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-300 cursor-not-allowed',
                )}
              >
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

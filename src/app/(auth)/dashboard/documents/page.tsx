'use client';

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
import { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import { cn } from '@/utils/cn';

type Document = {
  id: number;
  title: string;
  emoji?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  folder?: string;
};

// Mock data for UI demonstration
const mockDocuments: Document[] = [
  {
    id: 1,
    title: 'Project Roadmap',
    emoji: '🗺️',
    content: '# Project Roadmap\n\n## Q1 Goals\n- Launch MVP\n- User feedback integration\n\n## Q2 Goals\n- Scale to 1000 users\n- Add premium features',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    folder: 'Planning',
  },
  {
    id: 2,
    title: 'Meeting Notes - Jan 22',
    emoji: '📝',
    content: '# Meeting Notes\n\n**Date:** January 22, 2024\n**Attendees:** Team leads\n\n## Action Items\n- [ ] Review design mockups\n- [ ] Update API documentation',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    folder: 'Meetings',
  },
  {
    id: 3,
    title: 'API Documentation',
    emoji: '📚',
    content: '# API Documentation\n\n## Authentication\n```json\n{\n  "token": "Bearer xxx"\n}\n```\n\n## Endpoints\n- GET /api/users\n- POST /api/tasks',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    folder: 'Documentation',
  },
  {
    id: 4,
    title: 'Design System Guidelines',
    emoji: '🎨',
    content: '# Design System\n\n## Colors\n- Primary: #3B82F6\n- Secondary: #10B981\n\n## Typography\n- Headings: Inter\n- Body: System UI',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    folder: 'Design',
  },
];

export default function DocumentsPage() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showPreview, setShowPreview] = useState(false);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    || doc.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (date: Date) => {
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
          {filteredDocuments.length === 0
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
    </div>
  );
}

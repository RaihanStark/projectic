'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FileText,
  Clock,
  FolderOpen,
  Share2,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';
import { cn } from '@/utils/cn';

interface Document {
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

export default function ShareDocumentPage() {
  const params = useParams();
  const shareId = params.id as string;
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/share/${shareId}`);
        
        if (response.status === 404) {
          setError('Document not found');
          return;
        }
        
        if (response.status === 403) {
          setError('This document is not publicly shared');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }
        
        const doc = await response.json();
        setDocument(doc);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mx-auto" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-300 mx-auto" />
          <h1 className="mb-2 text-xl font-semibold text-gray-900">{error}</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Shared Document</span>
              </div>
            </div>
            
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Open in Projectic
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Document Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          {/* Document Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <span className="text-5xl">{document.emoji}</span>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900">
                  {document.title}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FolderOpen className="h-4 w-4" />
                    {document.folder}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Last updated {new Date(document.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Content - Read Only */}
          <div className="prose prose-lg max-w-none">
            <MarkdownEditor
              value={document.content}
              onChange={() => {}} // Read-only
              preview="preview"
              height={600}
            />
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Created with{' '}
                <Link href="/" className="font-medium text-blue-600 hover:text-blue-700">
                  Projectic
                </Link>
              </span>
              <span>
                Share ID: {document.shareId?.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
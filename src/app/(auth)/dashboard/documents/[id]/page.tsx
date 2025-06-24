'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  MoreVertical,
  Download,
  Copy,
  Trash2,
  Share2,
  Link as LinkIcon,
  Globe,
  FileText,
  Clock,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { useDocumentStore } from '@/stores/documentStore';
import type { Document } from '@/stores/documentStore';


export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = Number(params.id);
  
  // Zustand store
  const {
    getDocumentById,
    updateDocument: updateDocumentInStore,
    deleteDocument: deleteDocumentFromStore,
    setLoading: setStoreLoading,
    setError: setStoreError,
  } = useDocumentStore();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Common emojis for quick selection
  const commonEmojis = ['📄', '📝', '📚', '🎯', '💡', '🚀', '🗺️', '🎨', '💻', '📊', '✅', '⚡'];

  // Fetch document from store or API
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        
        // Try to get from store first
        const storeDoc = getDocumentById(documentId);
        if (storeDoc) {
          setDocument(storeDoc);
          setIsPublic(storeDoc.isPublic || false);
          setLastSaved(new Date(storeDoc.updatedAt));
          
          // Generate share link
          if (typeof window !== 'undefined' && storeDoc.shareId) {
            const baseUrl = window.location.origin;
            setShareLink(`${baseUrl}/share/${storeDoc.shareId}`);
          }
          setLoading(false);
          return;
        }
        
        // If not in store, fetch from API
        const response = await fetch(`/dashboard/api/documents/${documentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }
        const doc = await response.json();
        
        setDocument(doc);
        setIsPublic(doc.isPublic || false);
        setLastSaved(new Date(doc.updatedAt));
        
        // Generate share link
        if (typeof window !== 'undefined' && doc.shareId) {
          const baseUrl = window.location.origin;
          setShareLink(`${baseUrl}/share/${doc.shareId}`);
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        toast.error('Failed to load document');
        router.push('/dashboard/documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, router, getDocumentById]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [document, hasUnsavedChanges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [document]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocument(prev => ({ ...prev, title: e.target.value }));
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (content: string) => {
    setDocument(prev => ({ ...prev, content }));
    setHasUnsavedChanges(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    setDocument(prev => ({ ...prev, emoji }));
    setShowEmojiPicker(false);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!document || !hasUnsavedChanges) return;
    
    setIsSaving(true);
    
    try {
      const response = await fetch(`/dashboard/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: document.title,
          emoji: document.emoji,
          content: document.content,
          folder: document.folder,
          isPublic: isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      const updatedDoc = await response.json();
      
      setDocument(updatedDoc);
      setLastSaved(new Date(updatedDoc.updatedAt));
      setHasUnsavedChanges(false);
      
      // Update the store
      updateDocumentInStore(documentId, updatedDoc);
      
      toast.success('Document saved');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`/dashboard/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      // Update the store
      deleteDocumentFromStore(documentId);
      
      toast.success('Document deleted');
      router.push('/dashboard/documents');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleTogglePublic = () => {
    setIsPublic(!isPublic);
    toast.success(isPublic ? 'Document is now private' : 'Document is now public');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mx-auto" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-300 mx-auto" />
          <h1 className="mb-2 text-xl font-semibold text-gray-900">Document not found</h1>
          <Link
            href="/dashboard/documents"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/documents"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Documents</span>
          </Link>
          
          <div className="h-4 w-px bg-gray-300" />
          
          {/* Save Status */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                <span>Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Clock className="h-4 w-4" />
                <span>Unsaved changes</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              hasUnsavedChanges
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <div className="relative group">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg group-hover:block">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <hr className="my-1" />
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Emoji and Title */}
          <div className="mb-8 flex items-start gap-4">
            {/* Emoji Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-5xl transition-transform hover:scale-110"
              >
                {document.emoji}
              </button>
              
              {showEmojiPicker && (
                <div className="absolute left-0 top-full z-10 mt-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                  <div className="grid grid-cols-6 gap-2">
                    {commonEmojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-2xl transition-transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div className="flex-1">
              <input
                ref={titleInputRef}
                type="text"
                value={document.title}
                onChange={handleTitleChange}
                placeholder="Untitled Document"
                className="w-full border-none bg-transparent text-4xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {document.folder}
                </span>
                <span>•</span>
                <span>Created {new Date(document.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="prose prose-lg max-w-none">
            <MarkdownEditor
              value={document.content}
              onChange={handleContentChange}
              placeholder="Start writing..."
              height={600}
              preview="live"
              className="min-h-[600px]"
            />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowShareModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Share Document</h2>
            
            {/* Public Access Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Public Access</p>
                    <p className="text-sm text-gray-500">Anyone with the link can view</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePublic}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    isPublic ? "bg-blue-500" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      isPublic ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Share Link */}
            {isPublic && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Copy
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Anyone with this link can view the document
                </p>
              </div>
            )}

            {/* Warning for Private Documents */}
            {!isPublic && (
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  This document is currently private. Enable public access to generate a shareable link.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
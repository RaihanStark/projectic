'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  preview?: 'live' | 'edit' | 'preview';
  height?: number;
};

const MarkdownEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Enter your text here...', 
  disabled = false,
  className,
  preview = 'live',
  height = 200
}: MarkdownEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show a loading placeholder during SSR
  if (!isMounted) {
    return (
      <div 
        className={`border border-gray-300 rounded-lg p-4 bg-gray-50 ${className || ''}`}
        style={{ height }}
      >
        <div className="text-gray-400 text-sm">{placeholder}</div>
      </div>
    );
  }

  const isReadOnly = preview === 'preview';

  return (
    <div className={className}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview={preview}
        height={height}
        data-color-mode="light"
        visibleDragBar={false}
        hideToolbar={isReadOnly}
        textareaProps={{
          placeholder,
          disabled,
          style: {
            fontSize: 14,
            lineHeight: 1.5,
            fontFamily: 'inherit',
          },
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
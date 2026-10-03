import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write detailed content here...',
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-[220px] max-h-[500px] overflow-y-auto p-4 text-sm text-[#0f172a] focus:outline-none leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-level-1 focus-within:border-[#2563eb] transition-all">
      {/* Editor Toolbar */}
      <div className="flex items-center flex-wrap gap-1 p-2 bg-[#f8fafc] border-b border-[#e2e8f0]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-1.5 rounded-md text-[#475569] hover:bg-[#e2e8f0] transition-colors',
            editor.isActive('bold') && 'bg-white text-[#2563eb] shadow-sm font-bold'
          )}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-1.5 rounded-md text-[#475569] hover:bg-[#e2e8f0] transition-colors',
            editor.isActive('italic') && 'bg-white text-[#2563eb] shadow-sm'
          )}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-[#cbd5e1] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            'p-1.5 rounded-md text-[#475569] hover:bg-[#e2e8f0] transition-colors',
            editor.isActive('heading', { level: 1 }) && 'bg-white text-[#2563eb] shadow-sm'
          )}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'p-1.5 rounded-md text-[#475569] hover:bg-[#e2e8f0] transition-colors',
            editor.isActive('heading', { level: 2 }) && 'bg-white text-[#2563eb] shadow-sm'
          )}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            'p-1.5 rounded-md text-[#475569] hover:bg-[#e2e8f0] transition-colors',
            editor.isActive('heading', { level: 3 }) && 'bg-white text-[#2563eb] shadow-sm'
          )}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-[#cbd5e1] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-1.5 rounded-md text-[#475569] hover:bg-[#e2e8f0] transition-colors',
            editor.isActive('bulletList') && 'bg-white text-[#2563eb] shadow-sm'
          )}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-1.5 rounded-md text-[#475569] hover:bg-[#e2e8f0] transition-colors',
            editor.isActive('orderedList') && 'bg-white text-[#2563eb] shadow-sm'
          )}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            'p-1.5 rounded-md text-[#475569] hover:bg-[#e2e8f0] transition-colors',
            editor.isActive('blockquote') && 'bg-white text-[#2563eb] shadow-sm'
          )}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            'p-1.5 rounded-md text-[#475569] hover:bg-[#e2e8f0] transition-colors',
            editor.isActive('codeBlock') && 'bg-white text-[#2563eb] shadow-sm'
          )}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded-md text-[#94a3b8] hover:text-[#0f172a] disabled:opacity-30"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded-md text-[#94a3b8] hover:text-[#0f172a] disabled:opacity-30"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
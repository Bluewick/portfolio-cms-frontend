import React, { useRef, useEffect } from 'react';
import { 
  Code2, 
  Table, 
  GitFork, 
  Quote, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered,
  Sparkles
} from 'lucide-react';

export function CodeEditor({ 
  value = '', 
  onChange, 
  contentType = 'html',
  placeholder = 'Start writing your technical essay...' 
}) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Sync line numbers count
  const linesCount = Math.max(1, value.split('\n').length);

  // Sync vertical scroll between textarea and line numbers gutter
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle Tab key for clean code indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const { selectionStart, selectionEnd } = textarea;

      const newValue =
        value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);

      onChange(newValue);

      // Restore cursor position after state update
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      }, 0);
    }
  };

  // Helper to insert snippet templates at cursor position
  const insertSnippet = (snippet) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    const replacement = snippet.replace('{{content}}', selected || 'Your content here');
    const updated = value.substring(0, start) + replacement + value.substring(end);

    onChange(updated);
    textarea.focus();
  };

  return (
    <div className="flex flex-col h-full bg-[#141416] border border-[#2B2A27] rounded-xl overflow-hidden shadow-sm">
      {/* Quick Snippet Inserter Toolbar */}
      <div className="flex items-center flex-wrap gap-1 px-3 py-2 bg-[#1C1C1F] border-b border-[#2B2A27] text-stone-300">
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 mr-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Snippets</span>
        </span>

        {/* Heading */}
        <button
          type="button"
          onClick={() =>
            contentType === 'html'
              ? insertSnippet('<h2>{{content}}</h2>\n')
              : insertSnippet('## {{content}}\n')
          }
          className="p-1.5 rounded hover:bg-[#2B2A27] hover:text-white text-xs font-mono transition-colors"
          title="Insert Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            contentType === 'html'
              ? insertSnippet('<h3>{{content}}</h3>\n')
              : insertSnippet('### {{content}}\n')
          }
          className="p-1.5 rounded hover:bg-[#2B2A27] hover:text-white text-xs font-mono transition-colors"
          title="Insert Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-[#2B2A27] mx-1" />

        {/* Code Block */}
        <button
          type="button"
          onClick={() =>
            contentType === 'html'
              ? insertSnippet(
                  '<pre><code class="language-javascript">\nrouter.get("/api/endpoint", (req, res) => {\n  // Code here\n});\n</code></pre>\n'
                )
              : insertSnippet(
                  '```javascript\nrouter.get("/api/endpoint", (req, res) => {\n  // Code here\n});\n```\n'
                )
          }
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#2B2A27] hover:text-white text-xs font-mono transition-colors"
          title="Insert Syntax Highlighted Code Block"
        >
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Code Block</span>
        </button>

        {/* Architecture Diagram */}
        <button
          type="button"
          onClick={() =>
            contentType === 'html'
              ? insertSnippet(
                  '<pre><code>Request\n   ↓\nController\n   ↓\nService\n   ↓\nModel\n</code></pre>\n'
                )
              : insertSnippet(
                  '```text\nRequest\n   ↓\nController\n   ↓\nService\n   ↓\nModel\n```\n'
                )
          }
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#2B2A27] hover:text-white text-xs font-mono transition-colors"
          title="Insert ASCII Architecture Diagram"
        >
          <GitFork className="w-3.5 h-3.5 text-amber-400" />
          <span>Architecture Flow</span>
        </button>

        {/* Table */}
        <button
          type="button"
          onClick={() =>
            contentType === 'html'
              ? insertSnippet(
                  '<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Responsibility</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Controller</td>\n      <td>HTTP Request & Response</td>\n    </tr>\n    <tr>\n      <td>Service</td>\n      <td>Business Logic</td>\n    </tr>\n  </tbody>\n</table>\n'
                )
              : insertSnippet(
                  '| Layer | Responsibility |\n| :--- | :--- |\n| Controller | HTTP Request & Response |\n| Service | Business Logic |\n\n'
                )
          }
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#2B2A27] hover:text-white text-xs font-mono transition-colors"
          title="Insert Responsive Table"
        >
          <Table className="w-3.5 h-3.5 text-emerald-400" />
          <span>Table</span>
        </button>

        {/* Lead paragraph / Quote */}
        <button
          type="button"
          onClick={() =>
            contentType === 'html'
              ? insertSnippet('<p class="lead">\n  {{content}}\n</p>\n')
              : insertSnippet('> {{content}}\n')
          }
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#2B2A27] hover:text-white text-xs font-mono transition-colors"
          title="Insert Lead Introductory Paragraph"
        >
          <Quote className="w-3.5 h-3.5 text-purple-400" />
          <span>Lead Intro</span>
        </button>
      </div>

      {/* Editor Body with Gutter & Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 py-4 bg-[#111113] border-r border-[#2B2A27] select-none overflow-hidden text-right pr-3 font-mono text-xs text-[#52525B] leading-[1.65]"
        >
          {Array.from({ length: linesCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>

        {/* Code Input Canvas */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          spellCheck={false}
          className="flex-1 w-full h-full p-4 bg-[#141416] text-[#E7E2DA] font-mono text-xs sm:text-sm leading-[1.65] resize-none focus:outline-none overflow-y-auto selection:bg-[#34343A]"
        />
      </div>

      {/* Bottom Status bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1C1C1F] border-t border-[#2B2A27] text-[11px] font-mono text-stone-400">
        <span>Format: <strong className="text-white uppercase">{contentType}</strong></span>
        <span>{linesCount} lines • {value.length} characters</span>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

interface CodeBlockProps {
  language?: string;
  value: string;
  inline?: boolean;
}

/**
 * CodeBlock Component
 * Syntax highlighted code with copy button
 */
export default function CodeBlock({ language, value, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-white/10 text-violet-300 font-mono text-sm border border-white/10">
        {value}
      </code>
    );
  }

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/30 transition-all duration-300">
      {/* Language label and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs font-mono text-white/60 uppercase">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || "text"}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
          }}
          codeTagProps={{
            style: {
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            },
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

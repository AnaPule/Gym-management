import React, { useState, useRef, useEffect } from 'react';

interface AiAssistantPanelProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_PROMPTS = [
  'What are your opening hours?',
  'How do I book a class?',
  'What membership plans do you offer?',
];

const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, minimized]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    try {
      // TODO: replace with real API call to /api/v1/ai/chat
      await new Promise((r) => setTimeout(r, 700));
      const reply: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          "I'm not connected yet — once the backend is wired up I'll answer questions about classes, memberships, and gym policies.",
      };
      setMessages((m) => [...m, reply]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="AI assistant"
      aria-hidden={!open}
      className={`
        fixed bottom-24 right-6 z-40
        w-[360px] max-w-[calc(100vw-3rem)]
        ${minimized ? 'h-auto' : 'h-[480px] max-h-[calc(100vh-8rem)]'}
        bg-zinc-925 border border-zinc-800 rounded-2xl
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]
        flex flex-col overflow-hidden
        transition-all duration-200 ease-out
        ${open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none'
        }
      `}
    >
      {/* Header */}
      <header className="h-14 px-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="h-7 w-7 shrink-0 rounded-full bg-crimson-700 border border-crimson-600 flex items-center justify-center text-white text-[11px] font-semibold">
            S
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white leading-none truncate">Team Stars Assistant</p>
            <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Ask me anything about the gym</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setMinimized((v) => !v)}
            aria-label={minimized ? 'Expand' : 'Minimize'}
            className="h-7 w-7 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-850 flex items-center justify-center transition-colors"
          >
            {minimized ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="h-7 w-7 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-850 flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {!minimized && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3 pt-1">
                <p className="text-[11px] text-zinc-500 text-center">Start with one of these</p>
                <div className="space-y-1.5">
                  {STARTER_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => send(p)}
                      className="w-full text-left text-[11px] px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-crimson-700 hover:text-white text-zinc-300 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[85%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed
                    ${m.role === 'user'
                      ? 'bg-crimson-700 text-white rounded-br-md'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-md'
                    }
                  `}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-md px-3 py-2">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <footer className="border-t border-zinc-800 p-2.5 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question…"
                rows={1}
                disabled={sending}
                className="
                  flex-1 resize-none
                  bg-zinc-950 border border-zinc-800 rounded-xl
                  px-3 py-2 text-[11px] text-white
                  placeholder:text-zinc-600
                  outline-none focus:border-crimson-600
                  max-h-24
                "
              />
              <button
                type="button"
                onClick={() => send(input)}
                disabled={!input.trim() || sending}
                className="
                  h-8 w-8 shrink-0 rounded-full
                  bg-crimson-700 border border-crimson-600 text-white
                  flex items-center justify-center
                  hover:bg-crimson-600
                  active:scale-95 transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
                aria-label="Send"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default AiAssistantPanel;
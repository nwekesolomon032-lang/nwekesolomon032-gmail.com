import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Layers,
  MessageSquare,
  Minimize2,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import {useStudio} from '../context/StudioContext';
import {SolmonixMonogram} from './SolmonixLogo';
import {
  AiActionType,
  AiChatMessage,
  AiProjectCard,
  AiResponseMeta,
} from '../types/studio';

const SESSION_STORAGE_KEY = 'solmonix_ai_conversation_v1';

const WELCOME_MESSAGE: AiChatMessage = {
  id: 'welcome',
  role: 'assistant',
  createdAt: new Date().toISOString(),
  content:
    "Hello! Welcome to SOLMONIX STUDIO. I'm your AI creative assistant. I can help you explore our services, discover our work, understand how we can help your business, and guide you through starting a project. What would you like to know?",
};

const SUGGESTED_QUESTIONS = [
  'What does SOLMONIX STUDIO do?',
  'What services do you offer?',
  'Can I see your previous work?',
  'How can you help my business?',
  'How do I start a project?',
  'What makes your agency different?',
];

function SolmonixAiMark({className = 'h-5 w-5'}: {className?: string}) {
  return <SolmonixMonogram variant="metallic" size="100%" className={className} />;
}

function renderInlineFormatting(
  text: string,
  onInternalNavigate?: (path: string) => void
): React.ReactNode[] {
  const tokenRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const href = linkMatch[2].trim();
      if (href.startsWith('/') && onInternalNavigate) {
        return (
          <a
            key={i}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              onInternalNavigate(href);
            }}
            className="font-medium text-[#4D8EFF] underline decoration-[#1769FF]/50 underline-offset-2 hover:text-white"
          >
            {label}
          </a>
        );
      }
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#4D8EFF] underline decoration-[#1769FF]/50 underline-offset-2 hover:text-white"
        >
          {label}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function FormattedAiMessage({
  content,
  onInternalNavigate,
}: {
  content: string;
  onInternalNavigate: (path: string) => void;
}) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`${keyPrefix}-ul`} className="my-2 space-y-1.5 pl-4">
        {listItems.map((item, idx) => (
          <li key={idx} className="relative pl-2 text-[13px] leading-relaxed text-[#E2E6ED]">
            <span
              aria-hidden="true"
              className="absolute -left-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[#1769FF]"
            />
            {renderInlineFormatting(item, onInternalNavigate)}
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushList(`b-${idx}`);
      return;
    }

    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    const numberedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (bulletMatch) {
      listItems.push(bulletMatch[1]);
      return;
    }
    if (numberedMatch) {
      listItems.push(numberedMatch[1]);
      return;
    }

    flushList(`p-${idx}`);
    blocks.push(
      <p key={`p-${idx}`} className="text-[13.5px] leading-relaxed text-[#E2E6ED] [&+p]:mt-2">
        {renderInlineFormatting(trimmed, onInternalNavigate)}
      </p>
    );
  });

  flushList('end');
  return <div className="space-y-1.5">{blocks}</div>;
}

function AiProjectPreviewCard({
  project,
  onOpenProject,
}: {
  project: AiProjectCard;
  onOpenProject: (slug: string) => void;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="group overflow-hidden rounded-xl border border-[rgba(23,105,255,0.28)] bg-[#070B19] transition-colors hover:border-[#1769FF]">
      <div className="flex gap-3 p-2.5">
        <div
          onClick={() => onOpenProject(project.slug)}
          className="relative h-16 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-[rgba(191,195,202,0.16)] bg-[#05060D]"
        >
          {project.coverImageUrl && !imgErr ? (
            <img
              src={project.coverImageUrl}
              alt={project.title}
              referrerPolicy="no-referrer"
              onError={() => setImgErr(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0B1228] text-[#1769FF]">
              <Layers className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-wider text-[#4D8EFF] uppercase">
            {project.category}
          </p>
          <h4 className="mt-0.5 truncate font-display text-xs font-semibold text-white">
            {project.title}
          </h4>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#BFC3CA]/85">
            {project.shortDescription}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[rgba(191,195,202,0.1)] bg-[#050814] px-3 py-1.5">
        <button
          type="button"
          onClick={() => onOpenProject(project.slug)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white transition-colors hover:text-[#4D8EFF]"
        >
          <span>View Project</span>
          <ArrowRight className="h-3 w-3 text-[#1769FF]" aria-hidden="true" />
        </button>
        {project.liveWebsiteUrl && (
          <a
            href={project.liveWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-[#BFC3CA] hover:text-white"
          >
            <span>Live</span>
            <ExternalLink className="h-2.5 w-2.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}

export function SolmonixAiWidget() {
  const {navigate, settings} = useStudio();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnreadHint, setHasUnreadHint] = useState(true);
  const [messages, setMessages] = useState<AiChatMessage[]>(() => {
    try {
      const saved = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AiChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return [WELCOME_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages.slice(-24)));
    } catch {
      // ignore storage quota errors
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized, isStreaming]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setHasUnreadHint(false);
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnreadHint(false);
  };

  const handleReset = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setLastFailedPrompt(null);
    const freshWelcome: AiChatMessage = {
      ...WELCOME_MESSAGE,
      id: `welcome-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMessages([freshWelcome]);
  };

  const handleActionClick = (action: AiActionType, meta?: AiResponseMeta) => {
    const isSmallScreen = window.innerWidth < 640;
    if (isSmallScreen) {
      setIsMinimized(true);
    }

    if (action === 'start_project') {
      navigate('/start-a-project', {
        preselectedService: meta?.suggestedService,
      });
      return;
    }
    if (action === 'explore_services') {
      navigate('/services');
      return;
    }
    if (action === 'view_portfolio') {
      navigate('/projects');
      return;
    }
    if (action === 'contact_agency') {
      navigate('/contact');
    }
  };

  const handleOpenProject = (slug: string) => {
    if (window.innerWidth < 640) {
      setIsMinimized(true);
    }
    navigate(`/projects/${slug}`);
  };

  const sendMessage = useCallback(
    async (rawText: string) => {
      const promptText = rawText.trim();
      if (!promptText || isStreaming) return;

      setInput('');
      setLastFailedPrompt(null);

      const userMsg: AiChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: promptText,
        createdAt: new Date().toISOString(),
      };

      const assistantMsgId = `ai-${Date.now() + 1}`;
      const assistantPlaceholder: AiChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      };

      const historySnapshot = messages
        .filter((m) => !m.isError && m.id !== 'welcome' && !m.id.startsWith('welcome-'))
        .map((m) => ({role: m.role, content: m.content}));

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch('/api/ai/chat/stream', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            message: promptText,
            history: historySnapshot,
          }),
          signal: controller.signal,
        });

        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('text/event-stream') || !res.body) {
          let errMsg = 'SOLMONIX AI is temporarily unavailable. Please try again shortly.';
          try {
            const errJson = (await res.json()) as {message?: string};
            if (errJson?.message) errMsg = errJson.message;
          } catch {
            // fallback generic error
          }
          setLastFailedPrompt(promptText);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? {...m, content: errMsg, isError: true} : m
            )
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let currentEvent = 'message';

        while (true) {
          const {done, value} = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, {stream: true});
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';

          for (const frame of parts) {
            const lines = frame.split('\n');
            let eventName = currentEvent;
            const dataLines: string[] = [];

            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventName = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                dataLines.push(line.slice(5).trim());
              }
            }

            if (dataLines.length === 0) continue;
            const rawData = dataLines.join('\n');

            try {
              const parsed = JSON.parse(rawData) as {
                text?: string;
                message?: string;
              } & Partial<AiResponseMeta>;

              if (eventName === 'chunk' && typeof parsed.text === 'string') {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {...m, content: m.content + parsed.text}
                      : m
                  )
                );
              } else if (eventName === 'meta') {
                const meta: AiResponseMeta = {
                  projects: Array.isArray(parsed.projects) ? parsed.projects : [],
                  actions: Array.isArray(parsed.actions) ? parsed.actions : [],
                  suggestedService: parsed.suggestedService,
                  whatsappHref: parsed.whatsappHref,
                };
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? {...m, meta} : m))
                );
              } else if (eventName === 'error') {
                setLastFailedPrompt(promptText);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content:
                            parsed.message ||
                            'Unable to complete this response. Please try again.',
                          isError: true,
                        }
                      : m
                  )
                );
              }
            } catch {
              // ignore malformed SSE frame
            }
            currentEvent = 'message';
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setLastFailedPrompt(promptText);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content:
                    'Connection interrupted while reaching SOLMONIX AI. Please check your connection and try again.',
                  isError: true,
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages]
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const showSuggestedQuestions = messages.length <= 1 && !isStreaming;

  const whatsappFallbackHref = settings.contact.whatsappNumber
    ? `https://wa.me/${settings.contact.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        'Hello SOLMONIX STUDIO, I would like to discuss a project.'
      )}`
    : undefined;

  // Closed floating launcher button
  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open SOLMONIX AI creative assistant"
          className="group relative flex items-center gap-3 rounded-full border border-[rgba(23,105,255,0.55)] bg-[#080D25]/95 px-4 py-3 text-white shadow-[0_14px_40px_-8px_rgba(23,105,255,0.65)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4D8EFF] hover:bg-[#0B1336] hover:shadow-[0_18px_46px_-6px_rgba(23,105,255,0.85)]"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-0.5 rounded-full bg-[#1769FF]/20 blur-md transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#05060D] p-1 text-white ring-1 ring-[#1769FF]/70">
            <SolmonixAiMark className="h-full w-full" />
            {hasUnreadHint && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#4D8EFF] ring-2 ring-[#080D25]"
              />
            )}
          </span>
          <span className="relative flex flex-col items-start pr-1 text-left">
            <span className="font-display text-xs font-semibold tracking-wide text-white">
              SOLMONIX AI
            </span>
            <span className="text-[10px] leading-tight text-[#BFC3CA]">
              Ask Creative Assistant
            </span>
          </span>
        </button>
      </div>
    );
  }

  // Minimized docked pill bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
        <div className="flex items-center gap-2 rounded-full border border-[rgba(23,105,255,0.5)] bg-[#080D25]/95 p-1.5 pl-3 shadow-[0_14px_38px_-8px_rgba(23,105,255,0.6)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 pr-2 text-left"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#05060D] p-1 text-white ring-1 ring-[#1769FF]/70">
              <SolmonixAiMark className="h-full w-full" />
            </span>
            <div>
              <p className="font-display text-xs font-semibold text-white">SOLMONIX AI</p>
              <p className="text-[10px] text-[#BFC3CA]">
                {isStreaming ? 'Replying...' : 'Resume conversation'}
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close SOLMONIX AI"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#BFC3CA] transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      role="dialog"
      aria-label="SOLMONIX AI Creative Assistant"
      className="fixed inset-x-3 bottom-3 top-16 z-40 flex flex-col overflow-hidden rounded-2xl border border-[rgba(23,105,255,0.42)] bg-[#060913]/98 shadow-[0_28px_80px_-16px_rgba(0,0,0,0.85),0_0_48px_-14px_rgba(23,105,255,0.42)] backdrop-blur-xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(640px,calc(100vh-5.5rem))] sm:w-[415px]"
    >
      {/* Header */}
      <header className="relative flex shrink-0 items-center justify-between gap-3 border-b border-[rgba(191,195,202,0.14)] bg-gradient-to-r from-[#080D25] via-[#0B1230] to-[#080D25] px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#05060D] p-1 text-white shadow-[0_0_20px_rgba(23,105,255,0.45)] ring-1 ring-[#1769FF]/65">
            <SolmonixAiMark className="h-full w-full" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-display text-sm font-semibold tracking-wide text-white">
                SOLMONIX AI
              </h2>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
            </div>
            <p className="truncate text-[11px] text-[#BFC3CA]">
              Your intelligent creative assistant
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleReset}
            title="Reset conversation"
            aria-label="Reset conversation"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#BFC3CA] transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            title="Minimize assistant"
            aria-label="Minimize SOLMONIX AI"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#BFC3CA] transition-colors hover:bg-white/10 hover:text-white"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            title="Close assistant"
            aria-label="Close SOLMONIX AI"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#BFC3CA] transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Conversation History */}
      <div
        ref={scrollContainerRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isThinkingPlaceholder =
            !isUser && isStreaming && msg.content.length === 0 && !msg.isError;

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#1769FF] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white shadow-sm">
                  {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[rgba(23,105,255,0.4)] bg-[#080D25] text-[#4D8EFF]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1 space-y-2.5">
                <div
                  className={`rounded-2xl rounded-tl-sm border px-3.5 py-3 ${
                    msg.isError
                      ? 'border-red-500/40 bg-red-950/30 text-red-100'
                      : 'border-[rgba(191,195,202,0.14)] bg-[#0B1020]'
                  }`}
                >
                  {isThinkingPlaceholder ? (
                    <div className="flex items-center gap-2 py-0.5 text-xs text-[#BFC3CA]">
                      <span className="inline-flex items-center gap-1" aria-hidden="true">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1769FF] [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1769FF] [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1769FF]" />
                      </span>
                      <span>SOLMONIX AI is thinking...</span>
                    </div>
                  ) : msg.isError ? (
                    <div className="space-y-2 text-xs leading-relaxed text-red-200">
                      <p>{msg.content}</p>
                      {lastFailedPrompt && (
                        <button
                          type="button"
                          onClick={() => void sendMessage(lastFailedPrompt)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-red-400/40 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-red-500/20"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <FormattedAiMessage
                      content={msg.content}
                      onInternalNavigate={(path) => {
                        if (window.innerWidth < 640) {
                          setIsMinimized(true);
                        }
                        navigate(path);
                      }}
                    />
                  )}
                </div>

                {/* Verified Published Portfolio Cards */}
                {msg.meta && msg.meta.projects.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold tracking-wider text-[#BFC3CA]/75 uppercase">
                      Published Portfolio Projects
                    </p>
                    <div className="space-y-2">
                      {msg.meta.projects.map((proj) => (
                        <AiProjectPreviewCard
                          key={proj.id}
                          project={proj}
                          onOpenProject={handleOpenProject}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Contextual Lead-Gen & Navigation Actions */}
                {msg.meta && msg.meta.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {msg.meta.actions.map((action) => {
                      if (action === 'whatsapp_agency') {
                        const href = msg.meta?.whatsappHref || whatsappFallbackHref;
                        if (!href) return null;
                        return (
                          <a
                            key={action}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5 text-xs font-medium text-emerald-200 transition-colors hover:border-emerald-400 hover:text-white"
                          >
                            <MessageSquare className="h-3 w-3" aria-hidden="true" />
                            <span>WhatsApp the Agency</span>
                          </a>
                        );
                      }

                      const labelMap: Record<Exclude<AiActionType, 'whatsapp_agency'>, string> = {
                        start_project: 'Start a Project',
                        explore_services: 'Explore Our Services',
                        view_portfolio: 'View Our Portfolio',
                        contact_agency: 'Contact the Agency',
                      };

                      const isPrimary = action === 'start_project';

                      return (
                        <button
                          key={action}
                          type="button"
                          onClick={() => handleActionClick(action, msg.meta)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                            isPrimary
                              ? 'bg-[#1769FF] text-white hover:bg-[#2F7BFF]'
                              : 'border border-[rgba(191,195,202,0.22)] bg-[#0B1020] text-white hover:border-[#1769FF]'
                          }`}
                        >
                          <span>{labelMap[action]}</span>
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Clickable Suggested Questions */}
        {showSuggestedQuestions && (
          <div className="pt-1">
            <p className="mb-2 text-[11px] font-semibold tracking-wider text-[#BFC3CA]/75 uppercase">
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void sendMessage(q)}
                  className="rounded-lg border border-[rgba(23,105,255,0.32)] bg-[#080D25]/90 px-3 py-1.5 text-left text-xs text-[#E2E6ED] transition-colors hover:border-[#1769FF] hover:bg-[#1769FF]/15 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={handleFormSubmit}
        className="shrink-0 border-t border-[rgba(191,195,202,0.14)] bg-[#080D25]/90 p-3"
      >
        <div className="flex items-end gap-2 rounded-xl border border-[rgba(191,195,202,0.2)] bg-[#05070E] p-1.5 pl-3 focus-within:border-[#1769FF]">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={1500}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder="Ask about services, projects, process, or starting a project..."
            aria-label="Message SOLMONIX AI"
            className="max-h-28 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-xs leading-relaxed text-white placeholder-[#BFC3CA]/55 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            aria-label="Send message"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1769FF] text-white transition-colors hover:bg-[#2F7BFF] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-[#BFC3CA]/60">
          <span>Powered by SOLMONIX AI</span>
          <button
            type="button"
            onClick={() => handleActionClick('start_project')}
            className="font-medium text-[#4D8EFF] hover:text-white"
          >
            Start a Project &rarr;
          </button>
        </div>
      </form>
    </section>
  );
}

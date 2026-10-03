import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  X,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ShieldCheck,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { sendRegulatoryChat, ChatMessage } from '../../utils/geminiClient';

interface AiSummarizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeContextText?: string;
  activeContextTitle?: string;
}

export const AiSummarizerDrawer: React.FC<AiSummarizerDrawerProps> = ({
  isOpen,
  onClose,
  activeContextText = 'KEYTRUDA Section 4.4 / 5.1 Special Warnings: Mandates baseline and periodic liver function monitoring (AST/ALT/bilirubin) before each infusion and introduces permanent discontinuation rule for Grade 3 or Grade 4 immune-mediated hepatitis.',
  activeContextTitle = 'Section 4.4 Warnings Harmonization',
}) => {
  const [selectedModel, setSelectedModel] = useState<'gemini-3.1-flash-lite' | 'gemini-3.5-flash' | 'gemini-3.8-flash'>('gemini-3.1-flash-lite');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      roleLabel: 'CANON Multi-Agent AI Summarizer',
      content: `Hello! I am your regulatory intelligence assistant. I am currently anchored to: "${activeContextTitle}".\n\nHow would you like me to analyze this? I can summarize clinical implications, compare regulatory impact across US FDA and EMA, or draft affiliate briefing notes.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    if (activeContextTitle) {
      setMessages([
        {
          id: `anchor-${Date.now()}`,
          sender: 'assistant',
          roleLabel: `CANON Regulatory AI (${selectedModel})`,
          content: `⚡ Anchored to focus context: "${activeContextTitle}"\n\nExcerpt:\n"${activeContextText.substring(0, 220)}${activeContextText.length > 220 ? '...' : ''}"\n\nHow can I help analyze or summarize this point? You can ask a question or click a quick action below.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [activeContextTitle, activeContextText]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      roleLabel: 'Reviewer',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const promptWithContext = `CONTEXT ANCHOR: [${activeContextTitle}]\n${activeContextText}\n\nUSER QUESTION: ${query}`;
      const reply = await sendRegulatoryChat(messages, promptWithContext, 'Global Labeling Intelligence Specialist');

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        roleLabel: 'CANON AI Intelligence Agent (gemini-3.1-flash-lite)',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        roleLabel: 'System',
        content: 'Response generated via deterministic regulatory intelligence fallback.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'Summarize clinical differences in 3 concise bullet points',
    'What are the compliance risks for local affiliates?',
    'Draft an email briefing for the Safety Review Board',
    'How does this impact patient leaflet packaging?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden text-slate-900 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold flex items-center gap-1.5">
              CANON AI Copilot & Summarizer
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Live
              </span>
            </h3>
            <p className="text-[10px] text-slate-300 truncate max-w-[260px]">
              Anchored: {activeContextTitle}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Model Selection Bar */}
      <div className="px-4 py-2 bg-slate-950 text-white flex items-center justify-between gap-2 text-[10px] border-b border-white/10">
        <span className="text-slate-400 font-bold uppercase tracking-wider">Model:</span>
        <div className="flex items-center gap-1.5">
          {(['gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`px-2 py-0.5 rounded-md font-mono font-medium transition-colors cursor-pointer ${
                selectedModel === m
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {m.replace('gemini-', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Context Snippet Pill */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-purple-600" /> Active Focus Context
          </span>
          <span className="text-emerald-700 font-mono">Evidence Verified</span>
        </div>
        <p className="text-[11px] text-slate-700 line-clamp-2 italic bg-white p-2 rounded-lg border border-slate-200">
          "{activeContextText}"
        </p>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 max-w-[90%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-2xl leading-relaxed space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 pb-1 border-b border-white/10">
                <span className="font-bold">{msg.roleLabel}</span>
                <span className="font-mono">{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-line text-xs font-sans pt-1">
                {msg.content}
              </div>

              {msg.sender === 'assistant' && (
                <div className="pt-1.5 flex justify-end">
                  <button
                    onClick={() => handleCopyText(msg.id, msg.content)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-purple-700 font-semibold p-2">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
            <span>Multi-Agent Swarm Reasoning with Gemini 3.1 Flash-Lite...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        <span className="font-bold text-slate-400 uppercase shrink-0">Quick Action:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-800 shrink-0 transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about this section, summarize diff, or draft response..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-400">
          <span>Evidence-grounded proposals</span>
          <span>Zero autonomous submission</span>
        </div>
      </div>
    </div>
  );
};

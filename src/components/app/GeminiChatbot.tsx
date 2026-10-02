import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  ShieldCheck,
  RefreshCw,
  Zap,
  HelpCircle,
  FileText
} from 'lucide-react';
import { sendRegulatoryChat, ChatMessage } from '../../utils/geminiClient';

export const GeminiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      roleLabel: 'CANON Regulatory Intelligence Assistant',
      content:
        'Welcome to PRAMANEX CANON Regulatory Intelligence. I am configured with specialized regulatory labeling domain instructions. How can I assist with Core CCDS harmonization, FDA SPL / EMA SmPC structural differences, or affiliate drift?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedRole, setSelectedRole] = useState('Global Labeling Lead');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.1-flash-lite' | 'gemini-3.5-flash' | 'gemini-3.8-flash'>(
    'gemini-3.1-flash-lite'
  );
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      roleLabel: 'Reviewer',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputPrompt('');
    setIsLoading(true);

    try {
      const responseText = await sendRegulatoryChat(messages, textToSend, selectedRole);

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        roleLabel: `CANON ${selectedRole} (${selectedModel})`,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        roleLabel: 'System',
        content: 'Unable to communicate with Gemini gateway. Using deterministic safety policy.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Analyze clinical difference in Keytruda Section 4.4 hepatic warnings.',
    'What is the current drift between Core CCDS Rev 15 and EU SmPC v9.1?',
    'Summarize PRAC recommendations regarding immune-mediated hepatitis.',
    'Verify ePI FHIR bundle LOINC mapping requirements for Contraindications.',
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[740px] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                CANON Regulatory Intelligence Assistant
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Multi-Turn Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Low-latency responses powered by Gemini 3.1 Flash-Lite & 3.5 Flash
            </p>
          </div>
        </div>

        {/* Role & Model Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
            >
              <option value="Global Labeling Lead">Global Labeling Lead</option>
              <option value="Safety / Medical Reviewer">Safety / Medical Reviewer</option>
              <option value="Regulatory Affairs Specialist">Regulatory Affairs Specialist</option>
              <option value="RegOps / ePI Specialist">RegOps / ePI Specialist</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <select
              value={selectedModel}
              onChange={(e: any) => setSelectedModel(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
            >
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Instant)</option>
              <option value="gemini-3.5-flash">gemini-3.5-flash (Standard)</option>
              <option value="gemini-3.8-flash">gemini-3.8-flash (Reasoning)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Thread (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-purple-600 text-white shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 pb-1 border-b border-white/10">
                <span className="font-bold text-[11px] opacity-80">{msg.roleLabel}</span>
                <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-line pt-1 text-slate-800 dark:text-slate-100 font-sans">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-purple-700 font-semibold p-2">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
            <span>Consulting Gemini gateway ({selectedModel})...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 sm:px-6 py-2 bg-slate-50/80 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-bold uppercase shrink-0">Quick Queries:</span>
        {samplePrompts.map((p, idx) => (
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
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask ${selectedRole} regarding label changes, ePI rules, or affiliate drift...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
        <p className="mt-2 text-[10px] text-slate-400 text-center">
          AI assists with evidence-grounded proposals. Regulatory decisions remain with qualified human
          signatories.
        </p>
      </div>
    </div>
  );
};

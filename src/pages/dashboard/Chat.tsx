import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles, Loader2, Zap, RotateCcw, Copy, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { MODEL_OPTIONS } from '../../lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model: string;
  timestamp: Date;
  tokensIn?: number;
  tokensOut?: number;
}

const DEMO_RESPONSES = [
  "That's an excellent question! Let me break it down for you.\n\nThe key concepts here involve understanding how modern AI architectures work at scale. Transformer models like GPT-4 use attention mechanisms to process input sequences in parallel, rather than sequentially.\n\nThis allows for:\n- **Faster training** on large datasets\n- **Better context understanding** across long texts\n- **More coherent outputs** that maintain thematic consistency\n\nWould you like me to dive deeper into any of these aspects?",
  "Great question! Here's a comprehensive overview:\n\nModern AI systems operate on several fundamental principles:\n\n1. **Neural Networks** — Inspired by biological neurons, these process information through weighted connections\n2. **Attention Mechanisms** — Allow models to focus on relevant parts of the input\n3. **Transfer Learning** — Pre-trained models can be fine-tuned for specific tasks\n\nThe field is evolving rapidly, with new breakthroughs happening monthly.",
  "Let me walk you through this step by step.\n\n## Understanding the Basics\n\nAt its core, this involves three layers:\n\n- **Input Layer**: Processes raw data and tokenizes it\n- **Hidden Layers**: Apply learned transformations through attention\n- **Output Layer**: Generates the final response\n\n### Key Implementation Details\n\n```typescript\nasync function processRequest(input: string) {\n  const tokens = tokenize(input);\n  const embeddings = await embed(tokens);\n  const output = await model.infer(embeddings);\n  return decode(output);\n}\n```\n\nThis pattern is fundamental to all modern AI APIs.",
];

function StreamingText({ content }: { content: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      i += Math.floor(Math.random() * 3) + 1;
      if (i >= content.length) {
        setDisplayed(content);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(content.slice(0, i));
      }
    }, 15);
    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed">
      {displayed}
      {!done && <span className="inline-block w-0.5 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle" />}
    </div>
  );
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [loading, setLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      model,
      timestamp: new Date(),
      tokensIn: Math.floor(input.trim().length / 4),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate streaming delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const response = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
    const tokensOut = Math.floor(response.length / 4);

    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: response,
      model,
      timestamp: new Date(),
      tokensIn: userMsg.tokensIn,
      tokensOut,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setStreamingId(assistantId);
    setLoading(false);

    // Log usage
    if (user) {
      supabase.from('usage_logs').insert({
        user_id: user.id,
        action: 'chat_completion',
        model,
        tokens_in: userMsg.tokensIn,
        tokens_out: tokensOut,
        latency_ms: Math.floor(Math.random() * 500 + 200),
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      setMessages(prev => prev.slice(0, -1));
      setInput(lastUserMsg.content);
      setTimeout(() => handleSend(), 100);
    }
  };

  const selectedModel = MODEL_OPTIONS.find(m => m.id === model) || MODEL_OPTIONS[0];
  const totalTokens = messages.reduce((s, m) => s + (m.tokensIn || 0) + (m.tokensOut || 0), 0);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen">
      {/* Header */}
      <div className="glass border-b border-white/5 px-5 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4.5 h-4.5 text-cyan-400" />
          <h1 className="font-semibold text-white text-sm">AI Chat</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] text-slate-600">Tokens:</span>
            <span className="text-xs text-slate-400 font-mono">{totalTokens.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: selectedModel.color }} />
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-slate-900/50 border border-slate-800/50 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 lg:px-6 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-7 h-7 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Start a conversation</h2>
              <p className="text-slate-500 max-w-md mb-8 text-sm">
                Ask anything — from code generation to creative writing. Powered by the latest AI models.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto">
                {[
                  'Explain quantum computing in simple terms',
                  'Write a Python web scraper',
                  'Help me design a REST API',
                  'Compare React vs Vue.js for my project',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="card glass-hover text-left text-xs text-slate-500 !p-3.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-500/50 mb-1.5" />
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-cyan-500/10">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-2xl rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600/90 to-blue-700/90 text-white px-4 py-3'
                  : 'glass text-slate-200 px-4 py-3'
              }`}>
                {msg.role === 'assistant' && streamingId === msg.id ? (
                  <StreamingText content={msg.content} />
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                )}
                {msg.role === 'assistant' && streamingId !== msg.id && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                    <button onClick={() => handleCopy(msg.id, msg.content)} className="text-slate-700 hover:text-slate-400 transition-colors">
                      {copiedId === msg.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={handleRegenerate} className="text-slate-700 hover:text-slate-400 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="ml-auto text-[10px] text-slate-700 font-mono">{msg.model}</span>
                    {msg.tokensIn && msg.tokensOut && (
                      <span className="text-[10px] text-slate-700 font-mono">{msg.tokensIn + msg.tokensOut} tokens</span>
                    )}
                  </div>
                )}
                <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-cyan-200/50' : 'text-slate-700'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 lg:p-4 border-t border-white/5 glass">
        <div className="max-w-4xl mx-auto flex items-end gap-2.5">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="input-field resize-none min-h-[44px] max-h-28 text-sm"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 112) + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn-primary !px-3.5 !py-2.5 disabled:opacity-40 flex-shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

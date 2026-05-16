import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Loader2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Message { id: number; role: 'user' | 'assistant'; content: string; }

export default function AIPlanner() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', content: "# 🗺️ AI Trip Planner\n\nI'll create a personalized travel itinerary for you! Tell me:\n\n- **Destination** (e.g., Kolkata, Mumbai)\n- **Duration** (e.g., 2 days)\n- **Budget** (e.g., ₹5000)\n- **Preferences** (food, culture, adventure)\n\n*Example: \"Plan a 2-day Kolkata food trip under ₹5000\"*" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const quickPrompts = [
    "2-day Kolkata food trip under ₹5000",
    "Weekend Mumbai street food tour",
    "3-day Rajasthan heritage trip",
    "Budget Delhi food walk",
    "Goa beach and seafood trip",
  ];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: msg });
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Sorry, something went wrong. Please try again!" }]);
    }
    setLoading(false);
  };

  const saveItinerary = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const aiMessages = messages.filter(m => m.role === 'assistant');
    const lastAI = aiMessages[aiMessages.length - 1];
    if (!lastAI) return;
    try {
      await api.post('/itineraries/', { title: 'AI Generated Itinerary', content: { text: lastAI.content }, ai_generated: true, days: 2 });
      alert('Itinerary saved!');
    } catch { alert('Failed to save. Please login first.'); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04]">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5"><ArrowLeft size={18} className="text-white/50" /></button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(24,95%,53%), hsl(24,95%,42%))' }}>
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-white text-sm">AI Trip Planner</h1>
            <p className="text-white/30 text-[10px]">Powered by Culinary Compass AI</p>
          </div>
        </div>
        <button onClick={saveItinerary} className="p-2 rounded-xl hover:bg-white/5" title="Save itinerary"><Save size={18} className="text-white/40" /></button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-orange-500/20 text-white rounded-br-sm' : 'bg-white/[0.03] text-white/80 rounded-bl-sm border border-white/[0.06]'}`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm prose-invert max-w-none [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_p]:my-1.5 [&_ul]:my-1 [&_li]:my-0.5 [&_table]:text-xs">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center text-white/40 text-sm">
            <Loader2 size={16} className="animate-spin text-orange-400" />
            <span>Planning your trip...</span>
          </motion.div>
        )}
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p) => (
            <button key={p} onClick={() => send(p)} className="shrink-0 text-xs px-4 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-orange-500/30 transition-colors whitespace-nowrap">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-5 py-4 border-t border-white/[0.04] safe-bottom">
        <div className="flex items-center gap-3 bg-white/[0.04] rounded-2xl px-4 py-3 border border-white/[0.06]">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Describe your dream trip..." className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none" />
          <button onClick={() => send()} disabled={!input.trim() || loading} className="p-2.5 rounded-xl disabled:opacity-30" style={input.trim() ? { background: 'linear-gradient(135deg, hsl(24,95%,53%), hsl(24,95%,42%))' } : {}}>
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

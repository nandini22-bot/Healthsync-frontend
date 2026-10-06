import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Send, HeartHandshake, Loader, AlertTriangle, MessageSquare } from 'lucide-react';

export default function HealthChat() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Hello! I am Healthsync's Educational Wellness Assistant. I can explain medicine functions, food macros, or general vitamins. Ask me anything, but please note I do not diagnose conditions or prescribe medications."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const predefinedQuestions = [
    "What is Cetirizine?",
    "What foods are high in protein?",
    "Explain Vitamin D deficiency."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const question = textToSend || input;
    if (!question.trim()) return;

    if (!textToSend) setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const response = await api.ai.chat(question);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: err.message || 'Error processing request.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex">
      <Sidebar />

      <main className="flex-1 pl-64 p-8 flex flex-col h-screen max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 shrink-0">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <HeartHandshake className="w-8 h-8 text-green-400" />
            <span>AI Health Companion</span>
          </h1>
          <p className="text-gray-400 mt-1">Ask questions about nutrition balance, exercise physiology, or drug mechanisms.</p>
        </div>

        {/* Informational Banner */}
        <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/10 text-amber-200 text-xs rounded-xl flex items-start gap-2.5 shrink-0">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
          <p className="leading-relaxed">
            <strong>Educational Scope Only:</strong> This AI assistant is configured purely for educational and wellness information. It will never diagnose symptoms, prescribe medications, or recommend specific drugs. Seek medical assistance immediately in case of emergency.
          </p>
        </div>

        {/* Message Log Container */}
        <div className="flex-1 min-h-0 glass-panel border border-gray-800 rounded-2xl p-5 mb-4 flex flex-col justify-between">
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                  msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-800 text-green-400 border border-gray-700'
                }`}>
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>

                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-green-500/10 border border-green-500/25 text-white rounded-tr-none' 
                    : 'bg-[#111827]/60 border border-gray-850 text-gray-300 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-lg shrink-0 bg-gray-800 text-green-400 border border-gray-700 flex items-center justify-center">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#111827]/60 border border-gray-850 text-gray-500 text-xs rounded-tl-none animate-pulse">
                  Gemini reasoning...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations */}
          {messages.length === 1 && (
            <div className="pt-4 border-t border-gray-850/60 shrink-0">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-2">Try asking:</span>
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="bg-gray-900 hover:bg-gray-800 border border-gray-850 px-3 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Input box */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="relative mb-6 shrink-0"
        >
          <input
            type="text"
            placeholder="Ask about medications, nutrition values, or flexibility..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="w-full bg-[#111827] border border-gray-800 rounded-xl py-3.5 pl-4 pr-12 text-white focus:outline-none focus:border-green-500 transition-all text-xs placeholder:text-gray-650"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-3.5 top-3.5 text-green-400 hover:text-green-300 disabled:text-gray-600 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </main>
    </div>
  );
}

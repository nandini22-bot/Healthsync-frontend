"use client";

import React, { useState } from 'react';
import { Send, Bot, ShieldAlert, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  emergency?: boolean;
}

export default function AIAssistantPage() {
  const [messages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your HealthSync wellness companion. Ask me any general health questions, medication storage tips, or macro balance queries. \n\n*Note: I cannot diagnose medical emergencies. If you are experiencing severe symptoms, please visit a clinic immediately.*'
    }
  ]);

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">AI Assistant</h1>
          <p className="text-slate-500 mt-1">Get clinical wellness insights and diet tips from your health companion.</p>
        </div>
        <button
          type="button"
          disabled
          onClick={(e) => e.preventDefault()}
          className="bg-slate-100 text-slate-400 font-bold p-2.5 rounded-xl border-none cursor-not-allowed text-xs flex items-center gap-1.5 opacity-60"
          aria-label="Clear chat history"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Chat Display Box */}
      <div className="flex-1 min-h-0 bg-white border border-slate-200/80 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            
            if (msg.emergency) {
              return (
                <div key={index} className="flex gap-4 items-start max-w-2xl bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl">
                  <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
                  <div className="text-sm leading-relaxed whitespace-pre-line font-medium">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={index} 
                className={`flex gap-4 items-start ${isUser ? 'justify-end' : ''}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}

                <div className={`p-4 rounded-2xl text-xs max-w-xl leading-relaxed whitespace-pre-line ${
                  isUser 
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none' 
                    : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar Form (Frozen) */}
        <form onSubmit={(e) => e.preventDefault()} suppressHydrationWarning className="p-4 border-t border-slate-100 flex gap-2 shrink-0 bg-slate-50">
          <input
            type="text"
            disabled
            suppressHydrationWarning
            placeholder="Describe your query or symptom (e.g. Can I take Dolo with food?)..."
            value=""
            readOnly
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 text-xs focus:outline-none cursor-not-allowed opacity-75"
          />
          <button
            type="button"
            disabled
            suppressHydrationWarning
            className="bg-blue-600 text-white font-bold p-2.5 rounded-xl border-none cursor-not-allowed opacity-50 flex items-center justify-center shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

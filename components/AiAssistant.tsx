import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { askMedicalAssistant } from '../services/geminiService';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm the VitalLab Virtual Assistant. I can help explain our tests, preparation instructions (like fasting requirements), or general lab terminology. How can I assist you today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await askMedicalAssistant(input);
      const aiMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        role: 'model',
        text: "I apologize, but I'm having trouble retrieving that information right now. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto h-[700px] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-600 to-accent-600 p-6 flex items-center justify-between">
          <div className="flex items-center text-white">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm mr-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">VitalLab Assistant</h2>
              <p className="text-medical-100 text-sm">Powered by Gemini AI</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-medical-100 ml-3' : 'bg-accent-100 mr-3'
                }`}>
                  {msg.role === 'user' ? <UserIcon size={16} className="text-medical-700" /> : <Bot size={16} className="text-accent-700" />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-medical-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="flex max-w-[80%] flex-row">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent-100 mr-3 flex items-center justify-center">
                  <Bot size={16} className="text-accent-700" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                  <Loader2 className="w-5 h-5 animate-spin text-accent-500" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-end space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-medical-500 focus-within:border-transparent transition-all">
            <textarea
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none p-2 text-slate-700 placeholder-slate-400 max-h-32"
              rows={1}
              placeholder="Ask about tests, fasting, or lab results..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">
            AI can make mistakes. Please consult with a doctor for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};
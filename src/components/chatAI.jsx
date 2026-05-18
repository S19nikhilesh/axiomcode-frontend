import React, { useState, useRef, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Send } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import Markdown from 'react-markdown';

const ChatAi = ({ problem }) => {
  const { register, handleSubmit, reset } = useForm();
  const [messages, setMessages] = useState([
    {
      role: "user",
      parts: [{ text: "Hello" }],
    },
    {
      role: "model",
      parts: [{ text: "Great to meet you. I am your DSA tutor. How can I help you with this problem today?" }],
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = async (data) => {
    const userPrompt = data.message;
    if (!userPrompt.trim()) return;

    const newMessage = { role: 'user', parts: [{ text: userPrompt }] };
    
    const updatedHistory = [...messages, newMessage];
    setMessages(updatedHistory);
    reset();

    try {
      const response = await axiosClient.post('/ai/chat', {
        message: updatedHistory, 
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode
      });

      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: response.data.message }]
      }]);

    } catch (err) {
      console.error("API Error", err);
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: "⚠️ Error: I couldn't reach the AI server. Please check your connection." }]
      }]);
    }
  };

  return (
    // bg-neutral-900 ko hata kar bg-base-200 kiya aur border-base-content/10 lagaya
    <div className="flex flex-col h-[500px] bg-base-200 border border-base-content/10 p-4 shadow-2xl transition-colors duration-200">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat ${msg.role === 'model' ? 'chat-start' : 'chat-end'}`}>
            <div className={`chat-bubble max-w-[85%] px-4 py-2.5 shadow-sm text-base ${
              msg.role === 'model' 
                ? 'bg-base-100 text-base-content border border-base-content/5' // AI Bubble adapts to base-100
                : 'bg-emerald-600 text-white' // User bubble matches standard brand color seamlessly
            }`}>
              <div className="prose prose-sm leading-relaxed max-w-none text-current">
                <Markdown>{msg.parts[0].text}</Markdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 pt-2 border-t border-base-content/10">
        <input
          {...register("message", { required: true })}
          autoComplete="off"
          placeholder="Ask a hint..."
          // Static input colors ko daisyUI input utilities aur token states par override kiya
          className="input h-11 flex-1 bg-base-100 border-base-content/10 text-base-content text-sm rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button type="submit" className="btn h-11 w-11 min-h-0 p-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 border-none text-white transition-colors">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatAi;
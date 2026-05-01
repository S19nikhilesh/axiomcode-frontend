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

    // 1. Create the new message object
    const newMessage = { role: 'user', parts: [{ text: userPrompt }] };
    
    // 2. Create the updated history array to send to API (to avoid state delay)
    const updatedHistory = [...messages, newMessage];

    // 3. Update UI immediately
    setMessages(updatedHistory);
    reset();

    try {
      const response = await axiosClient.post('/ai/chat', {
        message: updatedHistory, // Send the full history including the new message
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode
      });

      // 4. Add AI response to UI
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
    <div className="flex flex-col h-[500px] bg-base-200 rounded-lg p-4 shadow-xl">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat ${msg.role === 'model' ? 'chat-start' : 'chat-end'}`}>
            <div className={`chat-bubble ${msg.role === 'model' ? 'chat-bubble-neutral' : 'chat-bubble-success'} max-w-[90%]`}>
              <div className="prose prose-sm text-white">
                <Markdown>{msg.parts[0].text}</Markdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
        <input
          {...register("message", { required: true })}
          autoComplete="off"
          placeholder="Ask a hint..."
          className="input input-bordered flex-1 bg-base-100 focus:outline-none focus:border-success"
        />
        <button type="submit" className="btn btn-square btn-success">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatAi;
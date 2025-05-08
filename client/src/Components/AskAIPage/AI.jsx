import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BottomMenu } from '../Commons';

const AIChatPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.currentUserReducer?.result);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I'm Gemini. Ask me anything." },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'ai', content: data.text }]);
        } catch (error) {
            console.error('Gemini fetch error:', error);
            setMessages((prev) => [...prev, { role: 'ai', content: 'Something went wrong.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="relative flex flex-col h-screen bg-[#f7f7f8] pb-32">
            {/* Header */}
            <div className="p-4 bg-black text-white text-xl font-semibold flex justify-between items-center shadow">
                <span>Gemini Chat</span>
                <span className="text-sm text-gray-300">
                    Logged in as {user.firstName + user.lastName}
                </span>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-3xl w-fit px-5 py-3 rounded-xl whitespace-pre-wrap leading-relaxed text-base ${msg.role === 'user'
                            ? 'bg-blue-600 text-white ml-auto'
                            : 'bg-white text-gray-900 shadow mr-auto'
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="max-w-3xl px-5 py-3 rounded-xl bg-gray-200 text-gray-700 mr-auto animate-pulse">
                        Gemini is typing...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat input positioned above BottomMenu */}
            <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 z-20">
                <div className="flex items-center gap-2 bg-white border border-gray-300 p-3 rounded-xl shadow-md">
                    <textarea
                        rows={1}
                        placeholder="Ask Gemini anything..."
                        className="flex-1 resize-none rounded-md px-3 py-2 focus:outline-none text-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Bottom Menu floating cleanly at the bottom */}
            <div className="fixed bottom-1 z-10 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
                <BottomMenu />
            </div>


        </div>
    );
};

export default AIChatPage;

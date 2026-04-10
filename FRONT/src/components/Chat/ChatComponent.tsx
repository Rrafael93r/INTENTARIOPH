import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Trash2, Loader2, MinusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage, ChatMessage } from '../../servicios/chatService';

const ChatComponent: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Enviamos el historial completo al backend (el backend truncará si supera los 10)
            const response = await sendMessage({ messages: newMessages });
            if (response && response.message) {
                setMessages(prev => [...prev, response.message]);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            const errorMessage: ChatMessage = { 
                role: 'assistant', 
                content: 'Error: No se pudo conectar con la IA. Asegúrate de que el servidor esté activo.' 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden w-[380px] h-[520px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Gemma AI</h3>
                                    <p className="text-[10px] text-blue-100 opacity-80">Local Asistente Bitácora</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={clearChat}
                                    className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                                    title="Limpiar chat"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                                    <div className="bg-blue-50 p-4 rounded-full mb-3 text-blue-500">
                                        <Bot size={40} />
                                    </div>
                                    <p className="text-sm">¡Hola! Soy tu asistente inteligente local. ¿En qué puedo ayudarte hoy?</p>
                                </div>
                            )}
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm ${
                                            msg.role === 'user' 
                                                ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 flex-row">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Bot size={16} className="text-gray-400" />
                                        </div>
                                        <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
                                            <Loader2 size={16} className="animate-spin text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md active:scale-95"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-colors flex items-center justify-center group"
                >
                    <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                    </span>
                </motion.button>
            )}
        </div>
    );
};

export default ChatComponent;

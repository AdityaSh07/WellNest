import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Chatbot = () => {
    const location = useLocation();
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your WellNest assistant. How can I help you today?",
            sender: 'bot'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const hasProcessedScore = useRef(false);

    const botResponses = [
        "I'm here to listen. Can you tell me more about how you're feeling?",
        "That sounds challenging. Have you been feeling this way for long?",
        "I understand. It's important to acknowledge these feelings.",
        "Have you tried any coping strategies that have helped before?",
        "Remember, it's okay to feel this way. You're not alone.",
        "Would you like me to suggest some relaxation techniques?",
        "Sometimes talking to someone can help. Have you considered speaking with a friend or counselor?"
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Check if we have a PHQ-9 score from navigation and haven't processed it yet
        if (location.state?.phq9Score && !hasProcessedScore.current) {
            hasProcessedScore.current = true; // Mark as processed
            const score = parseInt(location.state.phq9Score, 10);

            // Add a system message with the score
            const systemMessage = {
                id: Date.now(),
                text: `You just completed the PHQ-9 test and scored ${score}.`,
                sender: 'system',
                isScore: true
            };

            setMessages(prev => [...prev, systemMessage]);

            // Send the score to the backend
            sendScoreToBackend(score);
        }
    }, [location.state]);

    const sendScoreToBackend = async (score) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score: score }),
            });

            const data = await response.json();

            // Add bot's response based on the score
            const botMessage = {
                id: Date.now(),
                text: data.message,
                sender: 'bot',
                isScoreResponse: true
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending score to backend:', error);
            const errorMessage = "I'm having trouble connecting to the server. Please try again later.";
            const errorMessageObj = {
                id: Date.now(),
                text: errorMessage,
                sender: 'bot',
                isError: true
            };
            setMessages(prev => [...prev, errorMessageObj]);
        }
    };

    // Update the existing handleSendMessage to use the new sendScoreToBackend function
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        try {
            // Send the message to the backend
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    query: inputValue,
                    timestamp: new Date().toISOString()
                }),
            });

            const data = await response.json();
            
            // Add bot's response
            const botMessage = {
                id: Date.now(),
                text: data.response || "I'm not sure how to respond to that.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error processing message:', error);
            const errorMessage = "I'm having trouble processing your request. Please try again.";
            const errorMessageObj = {
                id: Date.now(),
                text: errorMessage,
                sender: 'bot',
                isError: true
            };
            setMessages(prev => [...prev, errorMessageObj]);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        WellNest Assistant
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-600 hover:text-purple-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 ${message.sender === 'user'
                                        ? 'bg-purple-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                                    }`}
                            >
                                <p className="text-sm md:text-base">{message.text}</p>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="ml-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-full shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;

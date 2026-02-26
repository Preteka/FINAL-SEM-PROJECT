import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
import "../../index.css";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! Welcome to Vinayaga Glass and Plywoods. How can I assist you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                text: "I'm having trouble connecting to the server. Please try again later.",
                sender: 'bot'
            }]);
        }
    };

    const options = [
        "Product Inquiries",
        "Plywood Selection Guide",
        "Cost Estimation Help",
        "Order Status"
    ];

    const handleOptionClick = (option) => {
        setMessages(prev => [...prev, { text: option, sender: 'user' }]);

        let response = "";
        switch (option) {
            case "Product Inquiries":
                response = "We offer a wide range of Plywood, Glass, and Laminates. Which specific material are you interested in?";
                break;
            case "Plywood Selection Guide":
                response = "For moisture-prone areas (Kitchen/Bath), we recommend BWP (Boiling Water Proof). For furniture, MR (Moisture Resistant) grade is great.";
                break;
            case "Cost Estimation Help":
                response = "You can use our 'Cost Estimation' feature in the menu to get a rough budget for your interior project.";
                break;
            case "Order Status":
                response = "Please provide your Order ID to track your shipment.";
                break;
            default:
                response = "How else can I help you?";
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
        }, 600);
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    transition: 'transform 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? <X size={30} /> : <MessageCircle size={30} />}
            </div>

            {isOpen && (
                <div className="fade-in" style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '30px',
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid #eee'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Vinayaga Assistant</h3>
                        <p style={{ margin: '5px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>Online | Replies instantly</p>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '20px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : 'white',
                                    color: msg.sender === 'user' ? 'white' : 'var(--color-text)',
                                    boxShadow: msg.sender === 'bot' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
                                    borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '12px',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.4'
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {messages.length === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                {options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleOptionClick(opt)}
                                        style={{
                                            padding: '10px 15px',
                                            backgroundColor: 'white',
                                            border: '1px solid #ddd',
                                            borderRadius: '20px',
                                            color: 'var(--color-primary)',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            textAlign: 'left',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.borderColor = 'var(--color-secondary)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'white';
                                            e.currentTarget.style.color = 'var(--color-primary)';
                                            e.currentTarget.style.borderColor = '#ddd';
                                        }}
                                    >
                                        {opt} <ChevronRight size={14} />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '15px',
                        backgroundColor: 'white',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '25px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                fontSize: '0.95rem'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            style={{
                                width: '45px',
                                height: '45px',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s'
                            }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;

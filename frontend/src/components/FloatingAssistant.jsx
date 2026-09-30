import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Bot, Loader, Send } from 'lucide-react';

const FloatingAssistant = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste! Main KisanSathi AI hoon. Aapki kheti me kya madad kar sakta hoon?' }
  ]);
  const [inputText, setInputText] = useState("");
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Hardcoded to English
  const langCode = 'en';
  const sttLang = 'en-IN';
  const greeting = "Hello! I am your KisanSathi. How can I help you today?";
  const getChips = () => {
    switch (activeTab) {
      case 'yield-pest':
        return [
          'How does satellite NDVI predict yield?',
          'What triggers Fall Armyworm outbreaks?',
          'When should I irrigate based on soil moisture?'
        ];
      case 'fertilizer':
        return [
          'What fertilizer for cotton?',
          'How much DAP for 2 acres?',
          'Organic alternatives to urea?'
        ];
      case 'weather':
        return [
          'Will it rain today?',
          'Is weather optimal for spraying?',
          'How to prevent heat stress?'
        ];
      case 'guide':
        return [
          'Best sowing window for wheat?',
          'Pest cycle in sugarcane?',
          'Ideal tomato plant spacing?'
        ];
      case 'heal':
      default:
        return [
          'Why are my tomato leaves turning yellow?', 
          'How to treat fungal blight?', 
          'Organic cure for powdery mildew?'
        ];
    }
  };
  const chips = getChips();

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setMessages([{ sender: 'bot', text: greeting }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Setup Web Speech API for Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = sttLang;

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      
      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = sttLang;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputText("");
    setIsThinking(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: langCode,
          context: activeTab
        })
      });
      const data = await res.json();
      
      setMessages([...newMessages, { sender: 'bot', text: data.response }]);
      speakText(data.response);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: 'bot', text: 'Error connecting to server.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const clearHistory = () => {
    setMessages([{ sender: 'bot', text: greeting }]);
    window.speechSynthesis.cancel();
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 1000 }}>
          {/* Pulsing ring behind the button */}
          <div style={{
            position: 'absolute',
            top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
            borderRadius: '50%',
            background: 'rgba(5, 150, 105, 0.4)',
            animation: 'pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
          }}></div>
          <button
            onClick={() => setIsOpen(true)}
            className="animate-fade-in"
            style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.05)',
              color: '#059669', /* Emerald 600 */
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <Bot size={32} strokeWidth={1.5} />
          </button>
          <style>{`
            @keyframes pulse-ring {
              0% { transform: scale(0.9); opacity: 1; }
              100% { transform: scale(1.4); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '380px',
            height: '600px',
            maxHeight: '80vh',
            maxWidth: 'calc(100vw - 64px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5)',
            borderRadius: '24px'
          }}
        >
          {/* Header */}
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#059669" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 600 }}>AI Assistant</h3>
                <span style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }}></div> Online
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={clearHistory} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>Clear</button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ 
                  background: msg.sender === 'user' ? '#059669' : 'rgba(255,255,255,0.05)', 
                  padding: '14px 18px', 
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  color: '#fff',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px 18px', borderRadius: '20px 20px 20px 4px', display: 'flex', gap: '8px', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Loader size={16} className="lucide-icon" style={{ animation: 'spin 2s linear infinite', color: '#059669' }} />
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                    Thinking...
                  </span>
                </div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            
            {/* Quick Chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
              {chips.map((chip, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSendMessage(chip)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Ask me anything..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 20px', borderRadius: '100px', outline: 'none', fontSize: '0.95rem', transition: 'border 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              
              {!inputText ? (
                <button 
                  onClick={toggleListen}
                  style={{ 
                    background: isListening ? '#ef4444' : '#ffffff', 
                    border: 'none', 
                    color: isListening ? '#fff' : '#0f172a', 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer',
                    boxShadow: isListening ? '0 0 16px rgba(239, 68, 68, 0.6)' : '0 4px 12px rgba(0,0,0,0.15)',
                    animation: isListening ? 'pulse-red 1.5s infinite' : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  <Mic size={20} />
                  <style>{`
                    @keyframes pulse-red {
                      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                      70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                    }
                  `}</style>
                </button>
              ) : (
                <button 
                  onClick={() => handleSendMessage(inputText)}
                  style={{ background: '#059669', border: 'none', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' }}
                >
                  <Send size={18} style={{ marginLeft: '2px' }} />
                </button>
              )}
            </div>
            
            {isListening && (
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', animation: 'pulse-red 1s infinite' }}></div>
                Listening...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAssistant;

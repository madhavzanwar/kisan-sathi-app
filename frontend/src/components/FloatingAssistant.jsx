import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Bot, Loader, Send, Volume2, Trash2 } from 'lucide-react';
import { Tooltip } from 'antd';

/**
 * FloatingAssistant — AI Agronomist Chatbot.
 * Context-aware chat wired to POST /api/chat.
 * Preserves speech recognition (Web Speech API) and speech synthesis.
 */
const FloatingAssistant = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaste! Main KisanSathi AI hoon. Aapki kheti me kya madad kar sakta hoon?' }
  ]);
  const [inputText, setInputText] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const latestSendMessageRef = useRef(null);

  // Hardcoded to English
  const langCode = 'en';
  const sttLang = 'en-IN';
  const greeting = 'Hello! I am your KisanSathi AI assistant. How can I help you in your farm today?';

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
    if (messages.length === 0) {
      setMessages([{ sender: 'bot', text: greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Cancel speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
        latestSendMessageRef.current?.(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
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
    if (!text || !text.trim() || isThinking) return;

    const trimmed = text.trim();
    // Add user message via functional update to prevent stale state overwrites
    setMessages(prev => [...prev, { sender: 'user', text: trimmed }]);
    setInputText('');
    setIsThinking(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          language: langCode,
          context: activeTab,
        }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      speakText(data.response);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Unable to reach the assistant server. If Render is waking up, please retry in 30 seconds.' },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  latestSendMessageRef.current = handleSendMessage;

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error('Mic error:', e);
      }
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
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 1000,
          }}
        >
          {/* Subtle pulse ring */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              right: '-4px',
              bottom: '-4px',
              borderRadius: '50%',
              background: 'rgba(46, 107, 52, 0.25)',
              animation: 'pulse-ring 2.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
            }}
          />
          <Tooltip title="Ask KisanSathi AI" placement="left">
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open AI Assistant"
              className="animate-fade-in"
              style={{
                position: 'relative',
                height: '56px',
                padding: '0 20px',
                borderRadius: '999px',
                background: '#0E2A12',
                border: '1px solid rgba(213, 241, 69, 0.3)',
                color: '#FFFFFF',
                boxShadow: '0 10px 25px rgba(14, 42, 18, 0.25)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 10,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 14px 28px rgba(14, 42, 18, 0.32)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 42, 18, 0.25)';
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#D5F145',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0E2A12',
                }}
              >
                <Bot size={18} strokeWidth={2.2} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: '-0.01em',
                }}
              >
                Kisan AI
              </span>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#D5F145',
                  boxShadow: '0 0 8px #D5F145',
                }}
              />
            </button>
          </Tooltip>

          <style>{`
            @keyframes pulse-ring {
              0% { transform: scale(0.95); opacity: 0.9; }
              100% { transform: scale(1.35); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '400px',
            height: '620px',
            maxHeight: 'calc(100vh - 48px)',
            maxWidth: 'calc(100vw - 32px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(14, 42, 18, 0.12)',
            boxShadow: '0 24px 60px rgba(14, 42, 18, 0.22)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#0E2A12',
              color: '#FFFFFF',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#D5F145',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0E2A12',
                }}
              >
                <Bot size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}
                >
                  KisanSathi AI
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#D5F145',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#D5F145',
                      boxShadow: '0 0 6px #D5F145',
                    }}
                  />
                  Online • {activeTab ? `${activeTab} mode` : 'General agronomy'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Tooltip title="Clear chat history">
                <button
                  onClick={clearHistory}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </Tooltip>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              backgroundColor: '#F9FAF8',
            }}
          >
            {messages.map((msg, i) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={i}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      background: isUser ? '#2E6B34' : '#FFFFFF',
                      padding: '12px 16px',
                      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      color: isUser ? '#FFFFFF' : '#0E2A12',
                      border: isUser ? 'none' : '1px solid rgba(14, 42, 18, 0.08)',
                      boxShadow: isUser
                        ? '0 3px 10px rgba(46, 107, 52, 0.2)'
                        : '0 2px 8px rgba(14, 42, 18, 0.04)',
                      fontSize: '13.5px',
                      lineHeight: '1.5',
                    }}
                  >
                    <p style={{ margin: 0 }}>{msg.text}</p>
                  </div>

                  {!isUser && (
                    <button
                      onClick={() => speakText(msg.text)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#5C6E5F',
                        cursor: 'pointer',
                        padding: '4px 6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        marginTop: '3px',
                      }}
                      title="Read aloud"
                    >
                      <Volume2 size={12} /> Listen
                    </button>
                  )}
                </div>
              );
            })}

            {isThinking && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                <div
                  style={{
                    background: '#FFFFFF',
                    padding: '12px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    border: '1px solid rgba(14, 42, 18, 0.08)',
                    boxShadow: '0 2px 8px rgba(14, 42, 18, 0.04)',
                  }}
                >
                  <Loader
                    size={15}
                    style={{
                      animation: 'assistant-spin 1.5s linear infinite',
                      color: '#2E6B34',
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#5C6E5F' }}>
                    Consulting agronomy models...
                  </span>
                </div>
                <style>{`@keyframes assistant-spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Chips */}
          <div
            style={{
              padding: '10px 16px 6px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid rgba(14, 42, 18, 0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
              }}
            >
              {chips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(chip)}
                  style={{
                    background: '#F4F5F3',
                    border: '1px solid rgba(14, 42, 18, 0.08)',
                    color: '#0E2A12',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(46, 107, 52, 0.08)';
                    e.currentTarget.style.borderColor = '#2E6B34';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#F4F5F3';
                    e.currentTarget.style.borderColor = 'rgba(14, 42, 18, 0.08)';
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px 16px 16px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                backgroundColor: '#F4F5F3',
                borderRadius: '999px',
                padding: '4px 6px 4px 16px',
                border: '1px solid rgba(14, 42, 18, 0.1)',
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Ask about fertilizer, disease, sowing..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#0E2A12',
                  padding: '8px 0',
                  outline: 'none',
                  fontSize: '13.5px',
                  fontFamily: 'var(--font-sans)',
                }}
              />

              {!inputText ? (
                <Tooltip title={isListening ? 'Stop listening' : 'Speak your question'}>
                  <button
                    onClick={toggleListen}
                    style={{
                      background: isListening ? '#DC2626' : '#FFFFFF',
                      border: '1px solid rgba(14, 42, 18, 0.08)',
                      color: isListening ? '#FFFFFF' : '#2E6B34',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isListening
                        ? '0 0 14px rgba(220, 38, 38, 0.6)'
                        : '0 2px 6px rgba(14, 42, 18, 0.08)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Mic size={17} />
                  </button>
                </Tooltip>
              ) : (
                <button
                  onClick={() => handleSendMessage(inputText)}
                  aria-label="Send message"
                  style={{
                    background: '#2E6B34',
                    border: 'none',
                    color: '#FFFFFF',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(46, 107, 52, 0.25)',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#0E2A12';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#2E6B34';
                  }}
                >
                  <Send size={16} />
                </button>
              )}
            </div>

            {isListening && (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#DC2626',
                    borderRadius: '50%',
                    animation: 'pulse-mic 1s infinite',
                  }}
                />
                Listening to speech in en-IN... Speak now
                <style>{`
                  @keyframes pulse-mic {
                    0% { transform: scale(0.9); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.5; }
                    100% { transform: scale(0.9); opacity: 1; }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAssistant;

import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Bot, Loader, Send, Volume2, Trash2, AlertCircle, RotateCcw } from 'lucide-react';
import { Tooltip } from 'antd';
import { useLang } from '../i18n';

/**
 * FloatingAssistant — Fully Multilingual AI Agronomist Chatbot.
 * Context-aware chat wired to POST /api/chat.
 * Features:
 * - Multilingual UI, chips, greeting, errors, and system lines
 * - Natural localized question chips per tab (EN, HI, MR)
 * - Retains previous messages on mid-conversation language switch with translated system notice
 * - SpeechRecognition with en-IN, hi-IN, mr-IN and graceful fallback when unsupported
 * - SpeechSynthesis with Marathi -> Hindi -> Text-only fallback & device voice detection
 * - Devanagari font stack with correct lang attributes
 */
const FloatingAssistant = ({ activeTab }) => {
  const { t, currentLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [voiceNotice, setVoiceNotice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const latestSendMessageRef = useRef(null);
  const prevLangRef = useRef(currentLang);

  const langCode = currentLang === 'mr' ? 'mr' : currentLang === 'hi' ? 'hi' : 'en';
  const sttLang = currentLang === 'mr' ? 'mr-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  const greeting = t('chat.greeting', 'Hello! I am your KisanSathi AI assistant. How can I help you in your farm today?');

  const [messages, setMessages] = useState([
    { id: 'initial-greeting', sender: 'bot', text: greeting, lang: langCode }
  ]);

  // Check Web Speech API (SpeechRecognition) support
  const SpeechRecognition = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition || null)
    : null;
  const isSpeechRecognitionSupported = Boolean(SpeechRecognition);

  // Natural localized question chips per tab (not literal translations)
  const localizedChips = {
    en: {
      'yield-pest': [
        'How does satellite NDVI predict yield?',
        'What triggers Fall Armyworm outbreaks?',
        'When should I irrigate based on soil moisture?'
      ],
      'fertilizer': [
        'What fertilizer is best for cotton?',
        'How much DAP for 2 acres?',
        'What are organic alternatives to urea?'
      ],
      'weather': [
        'Will it rain today?',
        'Is the weather suitable for spraying pesticides?',
        'How to protect crops from extreme heat?'
      ],
      'guide': [
        'What is the best sowing time for wheat?',
        'How to manage shoot borer in sugarcane?',
        'What is the ideal spacing for tomato plants?'
      ],
      'heal': [
        'Why are my tomato leaves turning yellow?',
        'How to treat fungal blight in crops?',
        'What is an organic remedy for powdery mildew?'
      ],
      'assistant': [
        'How do I balance NPK for my soil?',
        'What are safe pesticide spray practices?',
        'How can I increase crop yield this season?'
      ]
    },
    hi: {
      'yield-pest': [
        'सैटेलाइट NDVI से फसल पैदावार का अनुमान कैसे लगाएं?',
        'फॉल आर्मीवर्म कीट से फसल का बचाव कैसे करें?',
        'मिट्टी की नमी देखकर सही समय पर सिंचाई कब करें?'
      ],
      'fertilizer': [
        'कपास की फसल के लिए सबसे सही खाद कौन सी है?',
        '2 एकड़ खेत के लिए कितनी डीएपी खाद डालनी चाहिए?',
        'यूरिया की जगह कौन सी जैविक खाद इस्तेमाल करें?'
      ],
      'weather': [
        'क्या आज खेत में बारिश होने की संभावना है?',
        'क्या आज कीटनाशक छिड़काव के लिए मौसम अनुकूल है?',
        'तेज धूप और गर्मी से फसलों को कैसे सुरक्षित रखें?'
      ],
      'guide': [
        'गेहूं की बुआई का सबसे उपयुक्त समय क्या है?',
        'गन्ने में तना छेदक कीट की रोकथाम कैसे करें?',
        'टमाटर की रोपाई में पौधों के बीच कितनी दूरी रखें?'
      ],
      'heal': [
        'टमाटर के पत्ते पीले क्यों पड़ रहे हैं?',
        'फसलों में फफूंद जनित झुलसा रोग का उपचार क्या है?',
        'पाउडरी मिल्ड्यू (चूर्णी फफूंद) का देसी जैविक इलाज क्या है?'
      ],
      'assistant': [
        'मिट्टी की जांच के अनुसार एनपीके का संतुलन कैसे बनाएं?',
        'कीटनाशक छिड़कते समय किन सावधानियों का ध्यान रखें?',
        'इस मौसम में फसल की पैदावार कैसे बढ़ाएं?'
      ]
    },
    mr: {
      'yield-pest': [
        'उपग्रह NDVI च्या मदतीने पिकाचे उत्पादन कसे ओळखावे?',
        'लष्करी अळीचा प्रादुर्भाव कसा रोखावा?',
        'मातीतील ओलावा पाहून पिकाला पाणी कधी द्यावे?'
      ],
      'fertilizer': [
        'कापूस पिकासाठी कोणती खते देणे फायदेशीर ठरेल?',
        '2 एकर शेतासाठी किती डीएपी खत वापरावे लागेल?',
        'युरिया खताऐवजी कोणते सेंद्रिय पर्याय वापरावेत?'
      ],
      'weather': [
        'आज शेतात पाऊस पडण्याचा अंदाज आहे का?',
        'आज कीटकनाशक फवारणीसाठी हवामान योग्य आहे का?',
        'कडक ऊन आणि उष्णतेपासून पिकांचे रक्षण कसे करावे?'
      ],
      'guide': [
        'गहू पेरणीसाठी सर्वात योग्य वेळ कोणती?',
        'उसातील खोडकीड नियंत्रणासाठी काय उपाय करावेत?',
        'टोमॅटो लागवडीमध्ये रोपांमध्ये किती अंतर असावे?'
      ],
      'heal': [
        'टोमॅटोची पाने पिवळी का पडत आहेत?',
        'पिकांवरील बुरशीजन्य करपा रोगावर काय उपाय करावा?',
        'भुरी रोगासाठी घरगुती व सेंद्रिय उपाय कोणता?'
      ],
      'assistant': [
        'मातीनुसार एनपीके खतांचे योग्य प्रमाण कसे ठरवावे?',
        'कीटकनाशक फवारताना कोणती काळजी घ्यावी?',
        'या हंगामात पिकाचे उत्पादन वाढवण्यासाठी काय करावे?'
      ]
    }
  };

  const getActiveChips = () => {
    const langDict = localizedChips[langCode] || localizedChips.en;
    const tabKey = activeTab || 'assistant';
    return langDict[tabKey] || langDict.assistant || langDict.heal;
  };

  const chips = getActiveChips();

  // Load and monitor speechSynthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices() || [];
        setAvailableVoices(v);
      } catch (e) {
        console.warn('Unable to get speech synthesis voices:', e);
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle Mid-Conversation Language Switches
  useEffect(() => {
    if (prevLangRef.current !== currentLang) {
      prevLangRef.current = currentLang;

      const langNativeName = currentLang === 'mr' ? 'मराठी' : currentLang === 'hi' ? 'हिन्दी' : 'English';
      const switchNotice = currentLang === 'mr'
        ? 'भाषा बदलून मराठी केली'
        : currentLang === 'hi'
        ? 'भाषा बदलकर हिन्दी की गई'
        : `Language changed to ${langNativeName}`;

      setMessages((prev) => {
        // If chat has only initial greeting or is empty, update greeting to new language
        const nonSystemMessages = prev.filter(m => m.sender !== 'system');
        if (nonSystemMessages.length <= 1 && (nonSystemMessages.length === 0 || nonSystemMessages[0]?.sender === 'bot')) {
          return [{ id: 'greeting', sender: 'bot', text: greeting, lang: langCode }];
        }
        // If user already interacted: keep previous messages, append translated neutral system line
        return [
          ...prev,
          {
            id: `sys-lang-${Date.now()}-${Math.random()}`,
            sender: 'system',
            text: switchNotice,
            lang: langCode
          }
        ];
      });
    }
  }, [currentLang]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Setup Web Speech API for Speech Recognition
  useEffect(() => {
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = sttLang;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          latestSendMessageRef.current?.(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to initialize speech recognition:', err);
    }
  }, [SpeechRecognition, sttLang]);

  // Speech Synthesis with fallback logic
  const speakText = (text, targetLang = langCode) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceNotice(t('chat.voiceUnavailable', 'Voice playback is unavailable on this device.'));
      return;
    }

    try {
      if (typeof window.speechSynthesis.cancel === 'function') {
        window.speechSynthesis.cancel();
      }

      let utterance = null;
      try {
        if (typeof SpeechSynthesisUtterance !== 'undefined') {
          utterance = new SpeechSynthesisUtterance(text);
        } else if (typeof window !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined') {
          utterance = new window.SpeechSynthesisUtterance(text);
        }
      } catch (uErr) {
        utterance = { text, rate: 0.92, pitch: 1.0 };
      }

      if (utterance) {
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
      }

      const voicesList = (typeof window.speechSynthesis.getVoices === 'function')
        ? window.speechSynthesis.getVoices()
        : availableVoices;

      const currentVoices = (Array.isArray(voicesList) && voicesList.length > 0) ? voicesList : availableVoices;

      if (targetLang === 'mr') {
        const mrVoice = currentVoices.find(v => v && v.lang && (v.lang.toLowerCase().startsWith('mr') || v.lang.toLowerCase().includes('mr')));
        if (mrVoice) {
          if (utterance) {
            utterance.voice = mrVoice;
            utterance.lang = 'mr-IN';
          }
          setVoiceNotice(null);
          try {
            if (utterance && typeof window.speechSynthesis.speak === 'function') {
              window.speechSynthesis.speak(utterance);
            }
          } catch (speakErr) {
            console.warn('Audio output error:', speakErr);
          }
        } else {
          // Fall back to Hindi voice if available
          const hiVoice = currentVoices.find(v => v && v.lang && (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi')));
          if (hiVoice) {
            if (utterance) {
              utterance.voice = hiVoice;
              utterance.lang = 'hi-IN';
            }
            setVoiceNotice(t('chat.mrVoiceFallbackHi', 'Marathi voice is unavailable on this device. Reading aloud in Hindi voice.'));
            try {
              if (utterance && typeof window.speechSynthesis.speak === 'function') {
                window.speechSynthesis.speak(utterance);
              }
            } catch (speakErr) {
              console.warn('Audio output error:', speakErr);
            }
          } else {
            // Fall back to text-only
            setVoiceNotice(t('chat.voiceUnavailable', 'Voice playback is unavailable on this device.'));
          }
        }
      } else if (targetLang === 'hi') {
        const hiVoice = currentVoices.find(v => v && v.lang && (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi')));
        if (hiVoice && utterance) {
          utterance.voice = hiVoice;
        }
        if (utterance) utterance.lang = 'hi-IN';
        setVoiceNotice(null);
        try {
          if (utterance && typeof window.speechSynthesis.speak === 'function') {
            window.speechSynthesis.speak(utterance);
          }
        } catch (speakErr) {
          console.warn('Audio output error:', speakErr);
        }
      } else {
        const enVoice = currentVoices.find(v => v && v.lang && (v.lang.toLowerCase().startsWith('en-in') || v.lang.toLowerCase().startsWith('en')));
        if (enVoice && utterance) {
          utterance.voice = enVoice;
        }
        if (utterance) utterance.lang = 'en-IN';
        setVoiceNotice(null);
        try {
          if (utterance && typeof window.speechSynthesis.speak === 'function') {
            window.speechSynthesis.speak(utterance);
          }
        } catch (speakErr) {
          console.warn('Audio output error:', speakErr);
        }
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setVoiceNotice(t('chat.voiceUnavailable', 'Voice playback is unavailable on this device.'));
    }
  };

  const handleSendMessage = async (text) => {
    if (!text || !text.trim() || isThinking) return;

    const trimmed = text.trim();
    const messageLang = langCode;

    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: trimmed, lang: messageLang }
    ]);
    setInputText('');
    setIsThinking(true);
    setVoiceNotice(null);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          language: messageLang,
          context: activeTab || 'general',
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const botResponse = data.response || t('chat.serverError', 'Unable to reach the assistant server. Please retry.');

      setMessages(prev => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'bot', text: botResponse, lang: messageLang }
      ]);
      speakText(botResponse, messageLang);
    } catch (err) {
      console.error('Chat error:', err);
      const errorText = t('chat.serverError', 'Unable to reach the assistant server. If Render is waking up, please retry in a few seconds.');
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: errorText,
          lang: messageLang,
          isError: true,
          retryMessage: trimmed
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  latestSendMessageRef.current = handleSendMessage;

  const toggleListen = () => {
    if (!isSpeechRecognitionSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = sttLang;
        }
        recognitionRef.current?.start();
      } catch (e) {
        console.warn('Mic start error:', e);
      }
    }
  };

  const clearHistory = () => {
    setMessages([{ id: 'greet-cleared', sender: 'bot', text: greeting, lang: langCode }]);
    setVoiceNotice(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const getFontFamily = (msgLang) => {
    const l = msgLang || langCode;
    return (l === 'hi' || l === 'mr') ? "'Noto Sans Devanagari', 'Inter', sans-serif" : 'var(--font-sans)';
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
          <Tooltip title={t('chat.tooltip', 'Ask KisanSathi AI')} placement="left">
            <button
              onClick={() => setIsOpen(true)}
              aria-label={t('chat.openAria', 'Open AI Assistant')}
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
                  fontFamily: getFontFamily(langCode),
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
            fontFamily: getFontFamily(langCode),
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
                    fontFamily: getFontFamily(langCode),
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t('chat.title', 'KisanSathi AI Assistant')}
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
                  {t('chat.onlineStatus', 'Online')} • {activeTab ? `${activeTab} ${t('chat.activeModeSuffix', 'mode')}` : t('chat.activeModeGeneral', 'General agronomy')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Tooltip title={t('chat.clearChat', 'Clear conversation')}>
                <button
                  onClick={clearHistory}
                  aria-label={t('chat.clearChat', 'Clear conversation')}
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
                aria-label={t('chat.closeAria', 'Close assistant')}
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

          {/* Voice Fallback Notice Alert if applicable */}
          {voiceNotice && (
            <div
              style={{
                backgroundColor: '#FEF3C7',
                borderBottom: '1px solid #FCD34D',
                padding: '7px 14px',
                fontSize: '11.5px',
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={13} style={{ flexShrink: 0 }} />
                <span>{voiceNotice}</span>
              </div>
              <button
                onClick={() => setVoiceNotice(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#92400E',
                  padding: 0,
                }}
              >
                <X size={13} />
              </button>
            </div>
          )}

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
            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div
                    key={msg.id}
                    lang={msg.lang || currentLang}
                    style={{
                      alignSelf: 'center',
                      background: '#ECEEE9',
                      border: '1px solid rgba(14, 42, 18, 0.08)',
                      color: '#5C6E5F',
                      padding: '4px 14px',
                      borderRadius: '999px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      margin: '6px 0',
                      fontFamily: getFontFamily(msg.lang),
                      textAlign: 'center',
                      maxWidth: '90%',
                    }}
                  >
                    {msg.text}
                  </div>
                );
              }

              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    lang={msg.lang || currentLang}
                    style={{
                      background: isUser
                        ? '#2E6B34'
                        : msg.isError
                        ? '#FEF2F2'
                        : '#FFFFFF',
                      padding: '12px 16px',
                      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      color: isUser
                        ? '#FFFFFF'
                        : msg.isError
                        ? '#B91C1C'
                        : '#0E2A12',
                      border: isUser
                        ? 'none'
                        : msg.isError
                        ? '1px solid #FECACA'
                        : '1px solid rgba(14, 42, 18, 0.08)',
                      boxShadow: isUser
                        ? '0 3px 10px rgba(46, 107, 52, 0.2)'
                        : '0 2px 8px rgba(14, 42, 18, 0.04)',
                      fontSize: '13.5px',
                      lineHeight: '1.55',
                      fontFamily: getFontFamily(msg.lang),
                    }}
                  >
                    <p style={{ margin: 0 }}>{msg.text}</p>
                    {msg.isError && msg.retryMessage && (
                      <button
                        onClick={() => handleSendMessage(msg.retryMessage)}
                        style={{
                          marginTop: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: '#B91C1C',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <RotateCcw size={12} /> {t('chat.retryBtn', 'Retry')}
                      </button>
                    )}
                  </div>

                  {!isUser && !msg.isError && (
                    <button
                      onClick={() => speakText(msg.text, msg.lang)}
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
                        fontFamily: getFontFamily(msg.lang),
                      }}
                      title={t('chat.listenBtn', 'Listen')}
                    >
                      <Volume2 size={12} /> {t('chat.listenBtn', 'Listen')}
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
                  <span style={{ fontSize: '13px', color: '#5C6E5F', fontFamily: getFontFamily(langCode) }}>
                    {t('chat.aiThinking', 'Consulting agronomy models...')}
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
                  lang={langCode}
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
                    fontFamily: getFontFamily(langCode),
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
                data-testid="assistant-chat-input"
                className="assistant-chat-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder={isListening ? t('chat.listeningActive', 'Listening...') : t('chat.placeholder', 'Ask about fertilizer, disease, sowing...')}
                aria-label={t('chat.placeholder', 'Ask about crop diseases, fertilizers, weather...')}
                lang={langCode}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#0E2A12',
                  padding: '8px 0',
                  outline: 'none',
                  fontSize: '13.5px',
                  fontFamily: getFontFamily(langCode),
                }}
              />

              {/* Only render microphone button if Speech Recognition is supported by the browser */}
              {isSpeechRecognitionSupported && !inputText && (
                <Tooltip title={isListening ? t('chat.stopListening', 'Stop listening') : t('chat.speakPrompt', 'Speak your question')}>
                  <button
                    onClick={toggleListen}
                    aria-label={t('chat.micAria', 'Toggle voice input')}
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
              )}

              {inputText && (
                <button
                  onClick={() => handleSendMessage(inputText)}
                  aria-label={t('chat.sendAria', 'Send message')}
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
                  fontFamily: getFontFamily(langCode),
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
                {t('chat.listeningToSpeech', { lang: sttLang, defaultValue: `Listening to speech in ${sttLang}... Speak now` })}
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

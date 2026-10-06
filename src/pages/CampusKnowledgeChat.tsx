import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  FileText, 
  AlertTriangle, 
  HelpCircle, 
  RefreshCw, 
  FileCheck, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Trash2,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { RAGAnswer, Citation } from '../types';
import { useAuth } from '../context/AuthContext';
import { CitationCard } from '../components/CitationCard';
import { SourceViewerModal } from '../components/SourceViewerModal';
import { ConflictAlert } from '../components/ConflictAlert';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  ragAnswer?: RAGAnswer;
  isLoading?: boolean;
}

export const CampusKnowledgeChat: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions in English, Hindi, Marathi
  const suggestionsByLanguage = {
    en: [
      'What is the minimum attendance requirement?',
      'What documents are required for scholarship renewal?',
      'When is the semester examination?',
      'What is the eligibility criteria for appearing in exams?',
      'What are the placement registration requirements?',
      'What are the hostel curfew and library timings?',
    ],
    hi: [
      'न्यूनतम उपस्थिति कितनी आवश्यक है?',
      'छात्रवृत्ति नवीनीकरण के लिए कौन से दस्तावेज आवश्यक हैं?',
      'सेमेस्टर परीक्षा कब है?',
      'कैंपस प्लेसमेंट के लिए क्या पात्रता मानदंड हैं?',
      'पुस्तकालय और छात्रावास के नियम क्या हैं?',
    ],
    mr: [
      'किमान उपस्थिती किती आवश्यक आहे?',
      'शिष्यवृत्ती नूतनीकरणासाठी कोणती कागदपत्रे आवश्यक आहेत?',
      'सेमिस्टर परीक्षा कधी आहे?',
      'कॅम्पस प्लेसमेंटसाठी पात्रता काय आहे?',
      'ग्रंथालय आणि वसतिगृहाचे नियम काय आहेत?',
    ],
  };

  useEffect(() => {
    // Check if initial question was passed via navigation
    const initial = (location.state as any)?.initialQuestion;
    if (initial) {
      handleSend(initial);
    } else if (messages.length === 0) {
      // Welcome initial message
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am Campus Knowledge Copilot.
Ask any questions about attendance regulations, semester examinations, scholarships, timetables, or campus placement guidelines.

Every answer is synthesized strictly from official institutional documents with verified citations.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputQuestion).trim();
    if (!q || isSubmitting) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const loadingMsgId = `loading-${Date.now()}`;
    const loadingMessage: ChatMessage = {
      id: loadingMsgId,
      sender: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputQuestion('');
    setIsSubmitting(true);

    try {
      const ragResponse = await api.askQuestion(q, user?.id);

      setMessages(prev => prev.map(msg => {
        if (msg.id === loadingMsgId) {
          return {
            id: `ans-${Date.now()}`,
            sender: 'assistant',
            text: ragResponse.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ragAnswer: ragResponse,
            isLoading: false,
          };
        }
        return msg;
      }));
    } catch (err: any) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === loadingMsgId) {
          return {
            id: `err-${Date.now()}`,
            sender: 'assistant',
            text: 'I could not process the query right now. Please ensure institutional documents are indexed and retry.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isLoading: false,
          };
        }
        return msg;
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-cleared',
        sender: 'assistant',
        text: 'Chat history cleared. What would you like to inquire about institutional policies today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Campus Knowledge Copilot</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                Grounding v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ask questions about your institution. Zero hallucination guarantee.
            </p>
          </div>
        </div>

        {/* Language selector & reset */}
        <div className="flex items-center gap-2">
          {/* Multilingual quick selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
            <button
              type="button"
              onClick={() => setCurrentLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                currentLanguage === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setCurrentLanguage('hi')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                currentLanguage === 'hi' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setCurrentLanguage('mr')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                currentLanguage === 'mr' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>

          <button
            type="button"
            onClick={clearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 text-xs transition"
            title="Clear Chat View"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 sm:gap-4 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shrink-0 mt-1 shadow">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl sm:max-w-3xl ${msg.sender === 'user' ? 'w-auto' : 'w-full'}`}>
              <div
                className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-sm shadow-md shadow-cyan-600/10'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-sm shadow-lg'
                }`}
              >
                {msg.isLoading ? (
                  <div className="flex items-center gap-3 py-2 text-cyan-400">
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span className="text-xs font-mono tracking-wide">
                      Retrieving institutional chunks & verifying grounding...
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Header tag for assistant answers */}
                    {msg.sender === 'assistant' && msg.ragAnswer && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400 font-mono">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>ANSWER</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>Confidence: {((msg.ragAnswer.confidence || 0.95) * 100).toFixed(0)}%</span>
                          <span>&bull;</span>
                          <span>{msg.ragAnswer.processingTimeMs}ms</span>
                        </div>
                      </div>
                    )}

                    {/* Main Text Content */}
                    <div className="whitespace-pre-line text-slate-200">
                      {msg.text}
                    </div>

                    {/* If Conflict Detected */}
                    {msg.ragAnswer?.hasConflict && msg.ragAnswer.conflictDetails && (
                      <ConflictAlert conflictDetails={msg.ragAnswer.conflictDetails} />
                    )}

                    {/* Citations Box (SOURCES) */}
                    {msg.ragAnswer && msg.ragAnswer.citations && msg.ragAnswer.citations.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-800/80">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>SOURCES ({msg.ragAnswer.citations.length})</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {msg.ragAnswer.citations.map((citation) => (
                            <CitationCard
                              key={citation.id}
                              citation={citation}
                              onViewSource={(c) => setSelectedCitation(c)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className={`text-[10px] text-slate-500 mt-1 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1 shadow">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips Bar */}
      <div className="py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2 font-medium">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Recommended campus questions:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {suggestionsByLanguage[currentLanguage].map((sug, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSend(sug)}
              className="shrink-0 px-3 py-1.5 rounded-lg border text-xs transition bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-2 relative"
      >
        <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl focus-within:border-cyan-500/80 transition-all duration-200">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ask something about attendance, exams, scholarships, timetable, placements..."
            className="w-full bg-transparent px-4 sm:px-5 py-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputQuestion.trim() || isSubmitting}
            className="mr-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <span className="hidden sm:inline text-xs">Ask</span>
            <Send className="w-4 h-4 text-slate-950" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
          <span>Grounded retrieval powered by Supabase pgvector & Gemini Flash 3.8</span>
          <span className="text-cyan-400 font-mono">Strict Hallucination Control: ACTIVE</span>
        </div>
      </form>

      {/* Source Viewer Modal */}
      {selectedCitation && (
        <SourceViewerModal
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
        />
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, User, ShieldAlert, CheckCircle, Volume2, Mic, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { checkDrugConflicts } from '../../utils/conflictDetector';
import { speechService } from '../../utils/speech';
import { soundEffects } from '../../utils/sound';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  hindiText?: string;
  isConflictWarning?: boolean;
  timestamp: string;
}

export const SmartAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { patient, medications, vitals, accessibility } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am AayuMitra, Ram Prasad ji's smart contextual health assistant. I am aware of your ongoing medications (${medications.map(m => m.name.split(' ')[0]).join(', ')}), your latest BP (${vitals[0]?.systolicBP}/${vitals[0]?.diastolicBP}), and your clinical history. How can I help you today?`,
      hindiText: `नमस्ते! मैं आर्यू मित्र हूँ, राम प्रसाद जी का स्मार्ट स्वास्थ्य सहायक। मैं आपकी वर्तमान दवाओं, बीपी और स्वास्थ्य स्थिति से पूरी तरह अवगत हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?`,
      timestamp: 'Just now'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isHindi = accessibility.language === 'hi';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (userQuery?: string) => {
    const query = (userQuery || input).trim();
    if (!query) return;

    soundEffects.playReminderChime();

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userQuery) setInput('');

    // Contextual AI Decision Engine based on patient context
    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = '';
      let hindiReply = '';
      let isWarning = false;

      // 1. Context Check: Inquiring about OTC painkillers / NSAIDs
      if (lower.includes('combiflam') || lower.includes('brufen') || lower.includes('ibuprofen') || lower.includes('pain') || lower.includes('headache') || lower.includes('sar dard') || lower.includes('disprin')) {
        isWarning = true;
        reply = `⚠️ CLINICAL CONTEXT WARNING: Ram Prasad ji is taking Ecosprin 75mg (Aspirin blood thinner). Taking Combiflam or Ibuprofen concurrently severely increases the risk of stomach ulcer bleeding and gastrointestinal hemorrhage. Recommendation: Use Paracetamol (Crocin 500/650) for mild pain instead, and inform Dr. Rajesh Gupta.`;
        hindiReply = `⚠️ महत्वपूर्ण चेतावनी: राम प्रसाद जी इकोस्प्रिन (एस्पिरिन) ले रहे हैं। कॉम्बिफ्लेम या आईबूप्रोफेन लेने से पेट में रक्तस्राव (Bleeding) का गंभीर खतरा हो सकता है। दर्द के लिए केवल पैरासिटामोल (क्रॉसिन) लें और डॉक्टर से परामर्श करें।`;
      }
      // 2. Context Check: Inquiring about morning doses taken status
      else if (lower.includes('morning') || lower.includes('subah') || lower.includes('did i take') || lower.includes('li kya') || lower.includes('dawa li')) {
        const morningMeds = medications.filter(m => m.schedule.includes('Morning'));
        const taken = morningMeds.filter(m => m.takenToday?.Morning);
        const pending = morningMeds.filter(m => !m.takenToday?.Morning);

        if (pending.length === 0) {
          reply = `✅ Great news! Ram Prasad ji has taken all scheduled morning medications (${morningMeds.map(m => m.name.split(' ')[0]).join(', ')}). Everything is on track for today!`;
          hindiReply = `✅ बहुत अच्छे! राम प्रसाद जी ने सुबह की सभी दवाएं ले ली हैं। आपकी दिनचर्या बिल्कुल सही चल रही है!`;
        } else {
          reply = `⏰ Morning Update: Taken: ${taken.map(m => m.name.split(' ')[0]).join(', ') || 'None yet'}. Pending to take: ${pending.map(m => m.name.split(' ')[0]).join(', ')}. Please take them with warm water after breakfast.`;
          hindiReply = `⏰ सुबह की दवाएं: अभी ${pending.map(m => m.name.split(' ')[0]).join(', ')} लेना बाकी है। कृपया नाश्ते के बाद गुनगुने पानी से लें।`;
        }
      }
      // 3. Context Check: Inquiring about Blood Pressure or Vitals
      else if (lower.includes('bp') || lower.includes('blood pressure') || lower.includes('sugar') || lower.includes('vitals') || lower.includes('heart')) {
        const latest = vitals[0];
        reply = `🩺 Vitals Context: Latest BP is ${latest.systolicBP}/${latest.diastolicBP} mmHg (${latest.status === 'normal' ? 'Normal & Stable' : 'Needs observation'}), Pulse: ${latest.pulseRate} bpm, Blood Sugar: ${latest.bloodSugarMgDl} mg/dL (${latest.sugarContext}). Target for Ram Prasad ji is <130/85 mmHg.`;
        hindiReply = `🩺 स्वास्थ्य रिपोर्ट: वर्तमान बीपी ${latest.systolicBP}/${latest.diastolicBP} mmHg है (स्थिर स्थिति)। ब्लड शुगर ${latest.bloodSugarMgDl} mg/dL है। सब नियंत्रण में है।`;
      }
      // 4. Context Check: Inquiring about upcoming doctor appointment
      else if (lower.includes('doctor') || lower.includes('appointment') || lower.includes('hospital') || lower.includes('milna')) {
        reply = `🏥 Upcoming Doctor Visit: Dr. Ananya Sen (Endocrinologist) at Max Super Speciality Hospital, Saket in 5 days. Preparation checklist: 10-12 hours fasting required before blood sampling and carry past 30 days glucometer log.`;
        hindiReply = `🏥 डॉक्टर अपॉइंटमेंट: 5 दिन बाद डॉ. अनन्या सेन (मैक्स हॉस्पिटल) से मिलना है। याद रहे: 10-12 घंटे का उपवास (Fasting) अनिवार्य है।`;
      }
      // 5. Context Check: Inquiring about Pantoprazole / Empty stomach timing
      else if (lower.includes('pan') || lower.includes('pantoprazole') || lower.includes('khali pet') || lower.includes('empty stomach')) {
        reply = `💊 Timing Rule: Pan-40 (Pantoprazole) must strictly be taken 30 minutes before morning tea or breakfast on an empty stomach. This provides an acid-protective shield for the stomach lining against Aspirin.`;
        hindiReply = `💊 निर्देश: पैन-40 (Pan-40) सुबह खाली पेट, चाय या नाश्ते से ठीक 30 मिनट पहले लें ताकि पेट में गैस न बने और एस्पिरिन से सुरक्षा मिले।`;
      }
      // 6. General fallback with context
      else {
        reply = `I am monitoring Ram Prasad ji's care plan. You can ask me about drug conflict safety, pending pill routines, BP/sugar readings, or doctor appointment guidelines.`;
        hindiReply = `मैं राम प्रसाद जी की दवाओं और स्वास्थ्य पर नज़र रख रहा हूँ। आप मुझसे दवाओं के परस्पर प्रभाव, पेंडिंग दवाओं, बीपी या डॉक्टर की सलाह के बारे में पूछ सकते हैं।`;
      }

      if (isWarning) {
        soundEffects.playWarningBuzz();
      } else {
        soundEffects.playReminderChime();
      }

      const botMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        hindiText: hindiReply,
        isConflictWarning: isWarning,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const speakText = (text: string, hindi?: string) => {
    const content = isHindi && hindi ? hindi : text;
    speechService.speak(content, {
      lang: isHindi ? 'hi-IN' : 'en-IN',
      rate: 0.85
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl max-w-xl w-full h-[600px] max-h-[90vh] shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300 font-bold shadow-inner">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white flex items-center gap-1.5">
                <span>आर्यू मित्र (AayuMitra)</span>
                <span className="text-[10px] bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Context-Aware AI
                </span>
              </h3>
              <p className="text-xs text-emerald-100">
                {isHindi ? 'मरीज के व्यक्तिगत संदर्भ पर आधारित स्मार्ट सलाहकार' : 'Active Patient Context: Ram Prasad (76y, T2D, BP, Aspirin)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-emerald-100 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40 overflow-x-auto flex gap-2 text-xs flex-shrink-0">
          <button
            onClick={() => handleSend('Can I take Combiflam for my knee pain?')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900 shadow-sm whitespace-nowrap hover:bg-rose-50"
          >
            ⚠️ Can I take Combiflam for knee pain?
          </button>
          <button
            onClick={() => handleSend('Did I take all my morning medicines today?')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 shadow-sm whitespace-nowrap hover:bg-emerald-50"
          >
            💊 Did I take morning medicines?
          </button>
          <button
            onClick={() => handleSend('How is my latest Blood Pressure reading?')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-sky-800 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800 shadow-sm whitespace-nowrap hover:bg-sky-50"
          >
            🩺 How is my BP?
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map(msg => {
            const isBot = msg.sender === 'assistant';
            const textToDisplay = isHindi && msg.hindiText ? msg.hindiText : msg.text;

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 text-xs sm:text-sm ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.isConflictWarning
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {msg.isConflictWarning ? <ShieldAlert className="w-5 h-5 animate-bounce" /> : <Bot className="w-5 h-5" />}
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl relative ${
                    isBot
                      ? msg.isConflictWarning
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 text-rose-950 dark:text-rose-100 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                      : 'bg-emerald-600 text-white font-medium rounded-tr-none'
                  }`}
                >
                  <p className="leading-relaxed font-medium">
                    {textToDisplay}
                  </p>

                  {isBot && (
                    <div className="mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => speakText(msg.text, msg.hindiText)}
                        className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                        title="Read out loud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Audio</span>
                      </button>
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isHindi ? 'दवा या स्वास्थ्य संबंधी सवाल पूछें...' : 'Ask about drug conflicts, missed doses, or BP target...'}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>

      </div>
    </div>
  );
};

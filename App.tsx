
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Activity, 
  Settings, 
  Send, 
  Database, 
  Terminal, 
  LayoutDashboard, 
  Layers, 
  Cpu, 
  Copy, 
  CheckCircle2,
  AlertCircle,
  Film,
  Zap,
  Play,
  Square,
  MessageSquare,
  Save,
  Globe
} from 'lucide-react';
import { Channel, MovieCopyLog, GeneratedCaption, BotSettings, TerminalLog } from './types';
import { generateMovieCaption, generateAutoReply } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai' | 'settings'>('dashboard');
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [movieInput, setMovieInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState<GeneratedCaption | null>(null);
  const [aiResponseCount, setAiResponseCount] = useState(14); // Simulated initial count
  
  // Bot Settings
  const [botSettings, setBotSettings] = useState<BotSettings>(() => {
    const saved = localStorage.getItem('kinoKopirSettings');
    return saved ? JSON.parse(saved) : {
      botToken: '8151939477:AAEs4hukQbcpY0Q958xZ2ljfVNCQM2dw1_g',
      apiId: '1234567',
      apiHash: 'sizning_api_hash',
      targetChannel: 'UZHD_kinolari',
      autoReplyEnabled: true
    };
  });

  // Logs and Channels
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: '1', name: 'Gobliddintarjima', status: 'active', lastActivity: 'Hozir', count: 124 },
    { id: '2', name: 'goblidin_tarjima_kinolar', status: 'active', lastActivity: '5m oldin', count: 89 },
    { id: '3', name: 'Tarjimaj_kinolar', status: 'active', lastActivity: '12m oldin', count: 210 },
    { id: '4', name: 'Kinolar_Tarjimai', status: 'active', lastActivity: '1h oldin', count: 45 },
    { id: '5', name: 'tarjimaq_kinolar', status: 'active', lastActivity: '1m oldin', count: 312 },
  ];

  const [logs, setLogs] = useState<MovieCopyLog[]>([]);

  const addTerminalLog = useCallback((message: string, type: 'info' | 'error' | 'success' | 'ai') => {
    setTerminalLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      message,
      type,
      time: new Date().toLocaleTimeString()
    }].slice(-50));
  }, []);

  // Save Settings logic
  const saveSettings = () => {
    localStorage.setItem('kinoKopirSettings', JSON.stringify(botSettings));
    addTerminalLog("Sozlamalar saqlandi.", "success");
    alert("Sozlamalar saqlandi!");
  };

  // Bot Logic Simulation
  useEffect(() => {
    let copyInterval: any;
    let autoReplyInterval: any;

    if (isBotRunning) {
      addTerminalLog("Bot ishga tushirildi. Sessiya yuklanmoqda...", "info");
      addTerminalLog("API bilan bog'lanish o'rnatildi.", "success");
      
      // Copy Simulation
      copyInterval = setInterval(() => {
        const randomChannel = channels[Math.floor(Math.random() * channels.length)];
        const movies = ["O'rgimchak odam", "Qasoskorlar", "Avatar 2", "Forsaj 10", "Napoleon", "Maftuningman"];
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        
        addTerminalLog(`Yangi kino nusxalandi: ${randomMovie} (@${randomChannel.name} dan)`, "success");
        
        const newLog: MovieCopyLog = {
          id: Date.now().toString(),
          source: randomChannel.name,
          title: randomMovie,
          timestamp: new Date().toLocaleTimeString(),
          status: 'success'
        };
        setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      }, 8000);

      // AI Auto-Reply Simulation
      if (botSettings.autoReplyEnabled) {
        autoReplyInterval = setInterval(async () => {
          const userMessages = [
            "Salom, yangi kinolar bormi?",
            "Janob, Marvel kinolarini qayerdan topsam bo'ladi?",
            "Rahmat, zo'r kanal ekan!",
            "Kino so'rasam maylimi?"
          ];
          const randomUserMsg = userMessages[Math.floor(Math.random() * userMessages.length)];
          addTerminalLog(`Foydalanuvchi: "${randomUserMsg}"`, "info");
          
          const reply = await generateAutoReply(randomUserMsg);
          addTerminalLog(`AI Javob: "${reply}"`, "ai");
          setAiResponseCount(prev => prev + 1);
        }, 15000);
      }

    } else {
      addTerminalLog("Bot to'xtatildi.", "error");
    }

    return () => {
      clearInterval(copyInterval);
      clearInterval(autoReplyInterval);
    };
  }, [isBotRunning, botSettings.autoReplyEnabled, addTerminalLog]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleAiGenerate = async () => {
    if (!movieInput.trim()) return;
    setAiLoading(true);
    const result = await generateMovieCaption(movieInput);
    setGeneratedCaption(result);
    setAiLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addTerminalLog("Matn nusxalandi.", "info");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Film className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">KinoKopir v2.0</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<Zap size={20} />} 
            label="AI Tavsif" 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Sozlamalar" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Bot Holati</span>
              <span className={`flex items-center gap-1.5 ${isBotRunning ? 'text-emerald-400' : 'text-rose-400'} font-medium`}>
                <div className={`w-2 h-2 rounded-full ${isBotRunning ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {isBotRunning ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <button 
              onClick={() => setIsBotRunning(!isBotRunning)}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                isBotRunning ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {isBotRunning ? <><Square size={14} /> To'xtatish</> : <><Play size={14} /> Botni Yoqish</>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950/50">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/40 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white">
            {activeTab === 'dashboard' ? 'Boshqaruv Paneli' : 
             activeTab === 'ai' ? 'Gemini AI Tavsif Yaratuvchi' : 'Bot Sozlamalari'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 font-medium">MAQSAD KANAL</span>
              <span className="text-sm text-indigo-400 font-bold">@{botSettings.targetChannel}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <Globe size={16} />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Layers className="text-blue-400" />} label="Jami Kinolar" value="1,429" change="+12 bugun" />
                <StatCard icon={<MessageSquare className="text-pink-400" />} label="AI Javoblar" value={aiResponseCount.toString()} change="Aktiv" />
                <StatCard icon={<Send className="text-indigo-400" />} label="Manba Kanallar" value="5" change="Aktiv" />
                <StatCard icon={<Activity className="text-emerald-400" />} label="Uptime" value="99.9%" change="Sog'lom" />
              </div>

              {/* Live Terminal Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Terminal size={18} className="text-slate-400" /> Live Bot Console
                  </h3>
                  <button 
                    onClick={() => setTerminalLogs([])}
                    className="text-xs text-slate-500 hover:text-slate-300"
                  >
                    Tozalash
                  </button>
                </div>
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs h-80 overflow-y-auto custom-scrollbar shadow-inner relative">
                   <div className="absolute top-4 right-4 text-[10px] text-slate-700 font-bold tracking-widest uppercase">Kernel Output</div>
                  {terminalLogs.length === 0 && <p className="text-slate-800 italic">Loglar kutilmoqda... Botni ishga tushiring.</p>}
                  {terminalLogs.map(log => (
                    <div key={log.id} className="flex gap-3 mb-1 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-slate-600">[{log.time}]</span>
                      <span className={
                        log.type === 'success' ? 'text-emerald-400' : 
                        log.type === 'error' ? 'text-rose-400' : 
                        log.type === 'ai' ? 'text-pink-400 font-bold' : 'text-blue-400'
                      }>
                        {log.type === 'success' ? '[COPIED]' : 
                         log.type === 'error' ? '[SYSTEM]' : 
                         log.type === 'ai' ? '[AI-REPLY]' : '[SCAN]'} {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Channel List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Monitoring Kanallari</h3>
                  </div>
                  <div className="glass rounded-2xl overflow-hidden border border-slate-800">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Kanal</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Holat</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Oxirgi skaner</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {channels.map((channel) => (
                          <tr key={channel.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-200">@{channel.name}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                ACTIVE
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">{channel.lastActivity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activity Logs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Oxirgi Nusxalar</h3>
                  <div className="glass rounded-2xl border border-slate-800 p-4 space-y-4 h-[300px] overflow-y-auto custom-scrollbar">
                    {logs.length === 0 && <p className="text-center text-slate-600 py-10">Bot ishlashini kuting...</p>}
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-slate-800 hover:border-slate-700 transition-all">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                          <Film size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{log.title}</p>
                          <p className="text-xs text-slate-500">@{log.source}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'ai' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                  <Zap size={14} fill="currentColor" /> Gemini Pro AI orqali
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight">Kino Tavsifi Yaratish</h2>
                <p className="text-slate-400 text-lg">Kino nomini kiriting va u haqida to'liq SEO ma'lumot oling.</p>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  value={movieInput}
                  onChange={(e) => setMovieInput(e.target.value)}
                  placeholder="Masalan: Forsaj 10 (2023) yoki Avatar"
                  className="w-full h-16 bg-slate-900/50 border border-slate-700 rounded-2xl px-6 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-xl"
                />
                <button 
                  onClick={handleAiGenerate}
                  disabled={aiLoading || !movieInput.trim()}
                  className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {aiLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Yaratish <Send size={18} /></>
                  )}
                </button>
              </div>

              {generatedCaption && (
                <div className="glass rounded-3xl p-8 border border-slate-800 space-y-6 animate-in zoom-in-95 duration-500 shadow-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">{generatedCaption.title}</h3>
                      <p className="text-indigo-400 font-medium">{generatedCaption.genre} • {generatedCaption.year}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(`${generatedCaption.title}\n\n🎬 Janr: ${generatedCaption.genre}\n📅 Yil: ${generatedCaption.year}\n\n📝 Tavsif: ${generatedCaption.description}\n\n${generatedCaption.hashtags.join(' ')}`)}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                      title="Nusxa olish"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                  
                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50">
                    <p className="text-slate-300 leading-relaxed text-lg italic italic">
                      "{generatedCaption.description}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {generatedCaption.hashtags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-500/5 text-indigo-500 rounded-lg text-sm border border-indigo-500/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto glass rounded-3xl border border-slate-800 divide-y divide-slate-800 shadow-2xl">
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Database size={20} className="text-indigo-400" /> Bot Konfiguratsiyasi
                </h3>
                <div className="space-y-6">
                  <EditableSetting 
                    label="Telegram Bot Token" 
                    value={botSettings.botToken} 
                    onChange={(v) => setBotSettings({...botSettings, botToken: v})}
                    sensitive 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <EditableSetting 
                      label="API ID" 
                      value={botSettings.apiId} 
                      onChange={(v) => setBotSettings({...botSettings, apiId: v})}
                    />
                    <EditableSetting 
                      label="API Hash" 
                      value={botSettings.apiHash} 
                      onChange={(v) => setBotSettings({...botSettings, apiHash: v})}
                      sensitive 
                    />
                  </div>
                  <EditableSetting 
                    label="Maqsad Kanal ID (Username)" 
                    value={botSettings.targetChannel} 
                    onChange={(v) => setBotSettings({...botSettings, targetChannel: v})}
                  />
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap size={20} className="text-pink-400" /> AI Funksiyalari
                </h3>
                <div className="space-y-6">
                  <ToggleSetting 
                    label="AI Avto-javob Berish (Chatbot)" 
                    description="Foydalanuvchilar yozgan savollariga Gemini AI orqali avtomatik javob berish."
                    active={botSettings.autoReplyEnabled} 
                    onToggle={() => setBotSettings({...botSettings, autoReplyEnabled: !botSettings.autoReplyEnabled})}
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-900/50 rounded-b-3xl">
                <button 
                  onClick={saveSettings}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Sozlamalarni Saqlash
                </button>
                <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-[0.2em]">Hostingga tayyor (LocalStorage qo'shilgan)</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper Components
const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`}
  >
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; change: string }> = ({ icon, label, value, change }) => (
  <div className="glass p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group shadow-lg">
    <div className="flex items-start justify-between">
      <div className="p-3 rounded-xl bg-slate-900 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded">Live</span>
    </div>
    <div className="mt-6">
      <p className="text-3xl font-bold text-white">{value}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-xs text-emerald-400 font-bold">{change}</p>
      </div>
    </div>
  </div>
);

const EditableSetting: React.FC<{ label: string; value: string; onChange: (v: string) => void; sensitive?: boolean }> = ({ label, value, onChange, sensitive }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative group">
      <input 
        type={sensitive ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  </div>
);

const ToggleSetting: React.FC<{ label: string; description: string; active: boolean; onToggle: () => void }> = ({ label, description, active, onToggle }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <span className="text-slate-300 font-medium block">{label}</span>
      <span className="text-xs text-slate-500">{description}</span>
    </div>
    <button 
      onClick={onToggle}
      className={`w-14 h-7 rounded-full relative transition-colors flex-shrink-0 ${active ? 'bg-indigo-600' : 'bg-slate-800'}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${active ? 'right-1' : 'left-1'}`} />
    </button>
  </div>
);

export default App;

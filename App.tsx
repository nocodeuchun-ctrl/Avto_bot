
import React, { useState, useEffect, useCallback } from 'react';
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
  Zap
} from 'lucide-react';
import { Channel, MovieCopyLog, GeneratedCaption } from './types';
import { generateMovieCaption } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai' | 'settings'>('dashboard');
  const [isBotRunning, setIsBotRunning] = useState(true);
  const [movieInput, setMovieInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState<GeneratedCaption | null>(null);
  
  const [channels, setChannels] = useState<Channel[]>([
    { id: '1', name: 'Gobliddintarjima', status: 'active', lastActivity: '2m ago', count: 124 },
    { id: '2', name: 'goblidin_tarjima_kinolar', status: 'active', lastActivity: '5m ago', count: 89 },
    { id: '3', name: 'Tarjimaj_kinolar', status: 'active', lastActivity: '12m ago', count: 210 },
    { id: '4', name: 'Kinolar_Tarjimai', status: 'idle', lastActivity: '1h ago', count: 45 },
    { id: '5', name: 'tarjimaq_kinolar', status: 'active', lastActivity: '1m ago', count: 312 },
  ]);

  const [logs, setLogs] = useState<MovieCopyLog[]>([
    { id: 'l1', source: 'Gobliddintarjima', title: 'Spider-Man: No Way Home', timestamp: '14:30:12', status: 'success' },
    { id: 'l2', source: 'tarjimaq_kinolar', title: 'Oppenheimer (2023) HD', timestamp: '14:28:45', status: 'success' },
    { id: 'l3', source: 'Tarjimaj_kinolar', title: 'The Batman', timestamp: '14:25:00', status: 'success' },
    { id: 'l4', source: 'Kinolar_Tarjimai', title: 'Dune: Part Two', timestamp: '14:20:11', status: 'failed' },
  ]);

  const handleAiGenerate = async () => {
    if (!movieInput.trim()) return;
    setAiLoading(true);
    const result = await generateMovieCaption(movieInput);
    setGeneratedCaption(result);
    setAiLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Film className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">KinoKopir</h1>
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
            label="AI Captioner" 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="glass rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Bot Status</span>
              <span className={`flex items-center gap-1.5 ${isBotRunning ? 'text-emerald-400' : 'text-rose-400'} font-medium`}>
                <div className={`w-2 h-2 rounded-full ${isBotRunning ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {isBotRunning ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <button 
              onClick={() => setIsBotRunning(!isBotRunning)}
              className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                isBotRunning ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {isBotRunning ? 'Stop Automation' : 'Start Automation'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950/50">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/40 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white">
            {activeTab === 'dashboard' ? 'Automation Overview' : 
             activeTab === 'ai' ? 'Gemini AI Assistant' : 'Configuration'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 font-medium">TARGET CHANNEL</span>
              <span className="text-sm text-indigo-400 font-bold">@UZHD_kinolari</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <Database size={16} />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Layers className="text-blue-400" />} label="Total Movies" value="1,429" change="+12 today" />
                <StatCard icon={<Cpu className="text-purple-400" />} label="Process Rate" value="12/hr" change="Optimized" />
                <StatCard icon={<Send className="text-indigo-400" />} label="Source Channels" value="5" change="Active" />
                <StatCard icon={<Activity className="text-emerald-400" />} label="Uptime" value="99.9%" change="Healthy" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Channel List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Terminal size={18} className="text-slate-400" /> Source Monitors
                    </h3>
                  </div>
                  <div className="glass rounded-2xl overflow-hidden border border-slate-800">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Channel Name</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Last Copy</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {channels.map((channel) => (
                          <tr key={channel.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-200">@{channel.name}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                channel.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                              }`}>
                                {channel.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">{channel.lastActivity}</td>
                            <td className="px-6 py-4 text-sm font-mono text-indigo-400">{channel.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activity Logs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity size={18} className="text-slate-400" /> Recent Activity
                  </h3>
                  <div className="glass rounded-2xl border border-slate-800 p-4 space-y-4 h-[400px] overflow-y-auto custom-scrollbar">
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-slate-800">
                        <div className={`mt-1 p-2 rounded-lg ${log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {log.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{log.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">from @{log.source}</p>
                          <p className="text-[10px] font-mono text-slate-600 mt-2 uppercase tracking-widest">{log.timestamp}</p>
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
                  <Zap size={14} fill="currentColor" /> Powered by Gemini 3 Flash
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight">Movie Meta Generator</h2>
                <p className="text-slate-400 text-lg">Enter a movie title to generate SEO-optimized captions in Uzbek.</p>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  value={movieInput}
                  onChange={(e) => setMovieInput(e.target.value)}
                  placeholder="e.g. Inception (2010)"
                  className="w-full h-16 bg-slate-900/50 border border-slate-700 rounded-2xl px-6 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
                <button 
                  onClick={handleAiGenerate}
                  disabled={aiLoading || !movieInput.trim()}
                  className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {aiLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Generate <Send size={18} /></>
                  )}
                </button>
              </div>

              {generatedCaption && (
                <div className="glass rounded-3xl p-8 border border-slate-800 space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">{generatedCaption.title}</h3>
                      <p className="text-indigo-400 font-medium">{generatedCaption.genre} • {generatedCaption.year}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(`${generatedCaption.title}\n\n🎬 Janr: ${generatedCaption.genre}\n📅 Yil: ${generatedCaption.year}\n\n📝 Tavsif: ${generatedCaption.description}\n\n${generatedCaption.hashtags.join(' ')}`)}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                  
                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50">
                    <p className="text-slate-300 leading-relaxed text-lg italic">
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
            <div className="max-w-2xl mx-auto glass rounded-3xl border border-slate-800 divide-y divide-slate-800">
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">Bot Configuration</h3>
                <div className="space-y-6">
                  <SettingItem label="Telegram Bot Token" value="8151939477:AAEs4huk..." sensitive />
                  <SettingItem label="API ID" value="1234567" />
                  <SettingItem label="API Hash" value="sizning_api_hash..." sensitive />
                  <SettingItem label="Target Channel ID" value="@UZHD_kinolari" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">Execution Rules</h3>
                <div className="space-y-6">
                  <ToggleSetting label="Auto-copy New Messages" active={true} />
                  <ToggleSetting label="Skip duplicate files" active={true} />
                  <ToggleSetting label="Watermark removal simulation" active={false} />
                </div>
              </div>
              <div className="p-8 bg-slate-900/50 rounded-b-3xl">
                <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                  Save Changes
                </button>
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
  <div className="glass p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group">
    <div className="flex items-start justify-between">
      <div className="p-3 rounded-xl bg-slate-900 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded">Stats</span>
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

const SettingItem: React.FC<{ label: string; value: string; sensitive?: boolean }> = ({ label, value, sensitive }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative group">
      <input 
        readOnly
        type={sensitive ? "password" : "text"}
        value={value}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none"
      />
      <button className="absolute right-3 top-2.5 p-1 text-slate-600 hover:text-indigo-400 transition-colors">
        <Copy size={16} />
      </button>
    </div>
  </div>
);

const ToggleSetting: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-300 font-medium">{label}</span>
    <button className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-indigo-600' : 'bg-slate-800'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
    </button>
  </div>
);

export default App;

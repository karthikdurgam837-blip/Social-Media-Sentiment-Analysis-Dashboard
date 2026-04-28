import { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, TrendingUp, Users, AlertCircle, Info, RefreshCw, PlusCircle, BrainCircuit, Activity, Moon, Sun, Download, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateInitialDataset, generateSyntheticPost } from './services/dataGenerator';
import { analyzeSentiment, summarizeTrends } from './services/geminiService';
import { AnalyzedPost, SentimentStats, VolumeData } from './types';
import { Card, cn } from './components/ui/Card';
import { SentimentDonut, VolumeAreaChart } from './components/SentimentChart';
import { Feed } from './components/Feed';
import { Skeleton, PostSkeleton } from './components/ui/Skeleton';

type View = 'dashboard' | 'feed' | 'audience' | 'info';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [posts, setPosts] = useState<AnalyzedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const [customText, setCustomText] = useState("");

  // Start with a clean slate - no synthetic data on launch
  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const stats = useMemo(() => {
    const initial: SentimentStats = { positive: 0, negative: 0, neutral: 0, total: posts.length };
    return posts.reduce((acc, curr) => {
      acc[curr.sentiment]++;
      return acc;
    }, initial);
  }, [posts]);

  const handleAddPost = async (manualText?: string) => {
    if (manualText && !manualText.trim()) return;
    
    setIsAnalyzing(true);
    const textToAnalyze = manualText || "";
    
    let basePost;
    if (textToAnalyze) {
      basePost = {
        id: Math.random().toString(36).substring(7),
        author: 'Intelligence Agent',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        platform: 'twitter',
        likes: 0,
        shares: 0,
        content: textToAnalyze,
        timestamp: new Date().toISOString()
      };
    } else {
      basePost = generateSyntheticPost();
    }

    const analyzed = await analyzeSentiment(basePost);
    setPosts(prev => [analyzed, ...prev]);
    setIsAnalyzing(false);
    if (manualText) setCustomText("");
  };

  const handleClearAll = () => {
    setPosts([]);
    setSummary(null);
  };

  const handleGenerateSummary = async () => {
    if (posts.length === 0) return;
    setIsSummarizing(true);
    const text = await summarizeTrends(posts);
    setSummary(text);
    setIsSummarizing(false);
  };

  const handleExport = () => {
    const data = JSON.stringify(posts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment-analysis-${new Date().toISOString()}.json`;
    a.click();
  };

  const volumeData: VolumeData[] = [
    { time: '08:00', mentions: 120 },
    { time: '10:00', mentions: 340 },
    { time: '12:00', mentions: 1240 },
    { time: '14:00', mentions: 890 },
    { time: '16:00', mentions: 1100 },
    { time: '18:00', mentions: 1560 },
  ];

  const dummyPlatformData = [
    { name: 'Twitter', count: 45, color: '#1DA1F2' },
    { name: 'Youtube', count: 25, color: '#FF0000' },
    { name: 'Insta', count: 20, color: '#E1306C' },
    { name: 'Facebook', count: 10, color: '#4267B2' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAF9] font-sans text-gray-900">
      {/* Sidebar - Navigation Hub (Desktop) */}
      <aside className="fixed left-0 top-0 h-full w-20 border-r border-gray-100 bg-white flex flex-col items-center py-8 gap-8 hidden md:flex z-50">
        <div className="bg-black text-white p-3 rounded-2xl mb-4 shadow-lg shadow-black/10">
          <BrainCircuit className="w-6 h-6" />
        </div>
        
        <nav className="flex flex-col gap-6">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={cn("p-3 rounded-2xl transition-all", activeView === 'dashboard' ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-inner" : "text-gray-300 hover:text-gray-400")}
            title="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setActiveView('feed')}
            className={cn("p-3 rounded-2xl transition-all relative", activeView === 'feed' ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-inner" : "text-gray-300 hover:text-gray-400")}
            title="Signal Stream"
          >
            <Activity className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          </button>
          
          <button 
            onClick={() => setActiveView('audience')}
            className={cn("p-3 rounded-2xl transition-all", activeView === 'audience' ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-inner" : "text-gray-300 hover:text-gray-400")}
            title="Audience Intelligence"
          >
            <Users className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setActiveView('info')}
            className={cn("p-3 rounded-2xl transition-all", activeView === 'info' ? "bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-inner" : "text-gray-300 hover:text-gray-400")}
            title="System Info"
          >
            <Info className="w-5 h-5" />
          </button>
        </nav>

        <div className="mt-auto flex flex-col items-center gap-6 pb-4">
          <div className="rotate-180 [writing-mode:vertical-lr] text-[8px] font-mono font-bold text-gray-300 uppercase tracking-[0.3em] whitespace-nowrap opacity-50">
            Created by D.KARTHIK
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 text-gray-300 hover:text-gray-400 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Hub */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex justify-around py-3 md:hidden z-50 px-4">
        <button onClick={() => setActiveView('dashboard')} className={cn("p-2 rounded-xl", activeView === 'dashboard' ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-300")}>
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveView('feed')} className={cn("p-2 rounded-xl relative", activeView === 'feed' ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-300")}>
          <Activity className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        <button onClick={() => setActiveView('audience')} className={cn("p-2 rounded-xl", activeView === 'audience' ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-300")}>
          <Users className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveView('info')} className={cn("p-2 rounded-xl", activeView === 'info' ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-300")}>
          <Info className="w-6 h-6" />
        </button>
      </nav>

      {/* Dynamic Header */}
      <header className="md:ml-20 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-3 sticky top-0 z-40 transition-colors">
        <div className="max-w-full mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold tracking-[0.2em] text-gray-900 dark:text-white uppercase transition-colors">
              {activeView === 'dashboard' && "Command Center"}
              {activeView === 'feed' && "Live Signal Stream"}
              {activeView === 'audience' && "Audience Intelligence"}
              {activeView === 'info' && "System Architecture"}
            </h1>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse transition-colors"></span>
              <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase truncate max-w-[100px]">Buffer: {posts.length} Signals</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={handleExport}
              title="Download Data"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
             <button 
              onClick={handleClearAll}
              className="text-[10px] font-bold text-gray-400 hover:text-rose-500 transition-colors hidden sm:block uppercase tracking-widest"
            >
              Wipe Buffer
            </button>
             <button 
              onClick={async () => {
                await handleAddPost();
                setActiveView('feed'); 
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-black dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all disabled:opacity-50 shadow-lg shadow-black/10"
            >
              {isAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <PlusCircle className="w-3 h-3" />}
              Import Sample
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="md:ml-20 p-6 min-h-[calc(100vh-64px)] pb-24 md:pb-6 dark:bg-gray-900 transition-colors">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
               <div className="lg:col-span-8 space-y-8">
                  <Card title="Intelligence Briefing" className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 border-blue-100 dark:border-blue-900/50">
                    <div className="space-y-4">
                      {summary ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-blue-900 dark:text-blue-100 font-medium italic serif leading-relaxed">
                          {summary}
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <BrainCircuit className="w-10 h-10 text-blue-300 dark:text-blue-800 mb-3" />
                          <p className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase tracking-widest">Neural Briefing Offline</p>
                          <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-1 italic">Scan signals to generate briefing</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-4 border-t border-blue-100 dark:border-blue-900/50">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Source: Gemini 3 Synthetic Inference</span>
                        <button 
                          onClick={handleGenerateSummary}
                          disabled={isSummarizing || posts.length === 0}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-blue-700 transition-all disabled:opacity-30"
                        >
                          {isSummarizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          Consult Neural Network
                        </button>
                      </div>
                    </div>
                  </Card>

                  <Card title="Volume Analytics">
                    {isLoading ? <Skeleton className="w-full h-[200px]" /> : <VolumeAreaChart data={volumeData} />}
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card title="Traffic Breakdown">
                       <div className="space-y-4 py-4">
                        {isLoading ? [1,2,3,4].map(i => <Skeleton key={i} className="w-full h-8" />) : (
                          dummyPlatformData.map(plat => (
                            <div key={plat.name} className="space-y-1">
                               <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                                 <span>{plat.name}</span>
                                 <span>{plat.count}%</span>
                               </div>
                               <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                 <motion.div initial={{ width: 0 }} animate={{ width: `${plat.count}%` }} className="h-full" style={{ backgroundColor: plat.color }} />
                               </div>
                            </div>
                          ))
                        )}
                       </div>
                    </Card>
                    <Card title="Actionable Keywords">
                       <div className="py-2 flex flex-wrap gap-2 justify-center">
                          {isLoading ? [1,2,3,4,5].map(i => <Skeleton key={i} className="w-16 h-6" />) : (
                            ['oatly', 'innovation', 'milk', 'scandal', 'growth', 'esg'].map(kw => (
                              <span key={kw} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">#{kw}</span>
                            ))
                          )}
                       </div>
                    </Card>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-8">
                  <Card title="Sentiment Breakdown">
                    {isLoading ? <Skeleton className="w-full h-[250px] rounded-full" /> : <SentimentDonut stats={stats} />}
                  </Card>
                  
                  <Card title="Regional Pulse">
                    <div className="h-[120px] bg-slate-50 rounded-xl border border-gray-100 relative overflow-hidden flex items-center justify-center">
                       <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:10px_10px]"></div>
                       <div className="text-center z-10">
                          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">Top Node Intensity</p>
                          <div className="text-lg font-mono font-bold text-gray-900">74% ASIA PACIFIC</div>
                       </div>
                       <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    </div>
                    <div className="mt-4 space-y-2">
                       {['EU', 'NA', 'APAC'].map((reg, i) => (
                         <div key={reg} className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-gray-400 uppercase">{reg}</span>
                            <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500" style={{ width: `${[32, 45, 74][i]}%` }}></div>
                            </div>
                            <span className="font-mono text-gray-600">{[32, 45, 74][i]}%</span>
                         </div>
                       ))}
                    </div>
                  </Card>
               </div>
            </motion.div>
          )}

          {activeView === 'feed' && (
            <motion.div 
              key="feed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <Card title="Manual Intelligence Override">
                <div className="flex flex-col gap-3">
                  <textarea 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter manual social post, comment, or review to run AI inference..."
                    className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-colors resize-none font-sans"
                  />
                  <div className="flex justify-end gap-3">
                     <button 
                      onClick={() => setCustomText("")}
                      className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 hover:text-gray-600"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => handleAddPost(customText)}
                      disabled={isAnalyzing || !customText.trim()}
                      className="bg-black text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-20 flex items-center gap-2"
                    >
                      {isAnalyzing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
                      Execute Analysis
                    </button>
                  </div>
                </div>
              </Card>

              <Card title="Endless Intelligence Stream" className="min-h-[80vh]">
                {isLoading ? (
                  <div className="space-y-6">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                  </div>
                ) : posts.length > 0 ? (
                  <Feed posts={posts} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                      <Activity className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">No Intelligence Buffered</h3>
                      <p className="text-xs text-gray-300 font-mono mt-1 italic">Awaiting manual input or sample import...</p>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {activeView === 'audience' && (
            <motion.div 
              key="audience"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card title="Global Presence Tracking">
                <div className="h-[400px] bg-[#0B1121] rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/5 shadow-2xl">
                   {/* Stylized SVG World Map */}
                   <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                     <path 
                       d="M150,100 Q180,80 220,100 T300,120 T350,80 T400,100 T450,150 T500,120 T600,150 T700,100 M100,200 Q150,220 200,200 T300,180 T400,220 T500,200 T600,220 T700,200" 
                       stroke="currentColor" 
                       fill="none" 
                       strokeWidth="0.5" 
                       className="text-blue-500"
                     />
                     {/* Simplified continents as abstract blobs for high-end "tech" look */}
                     <circle cx="200" cy="150" r="40" className="fill-blue-500/10" />
                     <circle cx="500" cy="180" r="60" className="fill-blue-500/10" />
                     <circle cx="650" cy="140" r="30" className="fill-blue-500/10" />
                   </svg>
                   
                   <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                   
                   <div className="text-center z-10 px-6">
                      <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                        <Users className="w-16 h-16 text-blue-400 relative z-10" />
                        <div className="absolute -top-2 -right-2 flex">
                          <span className="w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></span>
                          <span className="absolute w-4 h-4 bg-blue-500 rounded-full scale-50"></span>
                        </div>
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-blue-400 mb-2">Live Node Intelligence</p>
                      <h4 className="text-3xl font-mono font-bold text-white tracking-tighter">142 ACTIVE GEO-NODES</h4>
                      <p className="text-[10px] font-mono text-gray-500 mt-2 uppercase tracking-[0.2em]">Syncing orbital data... OK</p>
                   </div>

                   {/* Signal Pulses */}
                   <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_#60a5fa]"></div>
                   <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-300 shadow-[0_0_10px_#93c5fd]"></div>
                   <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-emerald-400/20 border border-emerald-400 rounded-full animate-ping"></div>

                   {/* Data Stream Indicators */}
                   <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest leading-none">Latency</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">12ms</span>
                      </div>
                      <div className="w-px h-6 bg-white/10"></div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest leading-none">Uptime</span>
                        <span className="text-[10px] font-mono text-blue-400 font-bold">99.98%</span>
                      </div>
                   </div>
                </div>
              </Card>
              <Card title="Demographic Metrics">
                 <div className="h-[350px] flex items-center justify-center">
                   <SentimentDonut stats={{ positive: 62, negative: 33, neutral: 5, total: 100 }} />
                 </div>
                 <div className="flex justify-center gap-12 border-t border-gray-50 pt-4">
                    <div className="text-center">
                      <div className="text-xs font-bold text-blue-500">MALE</div>
                      <div className="font-mono text-xl">62%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-rose-500">FEMALE</div>
                      <div className="font-mono text-xl">33%</div>
                    </div>
                 </div>
              </Card>
            </motion.div>
          )}

          {activeView === 'info' && (
             <motion.div 
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <Card className="bg-black text-white p-8 border-none shadow-2xl relative overflow-hidden">
                 <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                   Lead Dev: D.KARTHIK
                 </div>
                 <div className="flex items-center gap-4 mb-8">
                    <BrainCircuit className="w-10 h-10 text-blue-400" />
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-widest">Logic Stack: Gemini 3 Flash</h2>
                      <p className="text-xs text-gray-500 font-mono">NEURAL ENGINE / REAL-TIME INFERENCE</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 border-t border-white/10 italic serif">
                    <div>
                      <h4 className="text-blue-400 text-xs font-bold uppercase mb-2">Architectural Summary</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Traditional VADER or NLTK models fail at internet slang. This dashboard leverages Gemini to perform deep semantic reasoning, understanding context, sarcasm, and intent.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-emerald-400 text-xs font-bold uppercase mb-2">Real-world Utility</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Industry leaders use these dashboards to prevent PR disasters. If negative signal velocity spikes by 20% in 10 minutes, the system triggers automated alerts.
                      </p>
                    </div>
                 </div>
              </Card>
              
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-6 items-start">
                 <div className="p-3 bg-blue-500 rounded-xl text-white">
                   <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-blue-900 mb-1 italic serif">Placement Portfolio Fact</h3>
                   <p className="text-xs text-blue-800 leading-relaxed tracking-tight">
                     This project demonstrates full-stack thinking: Integrating Generative AI with real-time data visualization. Mentioning "LLM-based categorization" in interviews shows you know the latest trends beyond basic CSV parsing.
                   </p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

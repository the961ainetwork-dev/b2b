import React, { useState, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Search, 
  Cpu, 
  ListTodo, 
  FileCheck, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  Download, 
  Briefcase, 
  Building2, 
  Store, 
  TrendingUp,
  UserCheck,
  Mail,
  Linkedin,
  PhoneCall,
  Loader2,
  Info
} from 'lucide-react';

interface AgentPersona {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  borderColor: string;
  amberColor: string;
  badgeHex: string;
  description: string;
  expertise: string;
  typicalYield: string;
  industryFocus: string[];
  suggestedPrompt: string;
  sampleLeads: {
    firstName: string;
    lastName: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    linkedin: string;
    deliverability: string;
  }[];
}

const AGENTS: AgentPersona[] = [
  {
    id: 'saas-prospector',
    name: 'SaaS Prospector Prime',
    icon: Cpu,
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500/20',
    amberColor: 'text-blue-500',
    badgeHex: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    description: 'Specializes in high-growth tech firms, CTO architectures, engineering branches, and software founders.',
    expertise: 'Developer utilities, Cloud architectures, and enterprise AI.',
    typicalYield: 'High-intent technical buying decision-makers.',
    industryFocus: ['SaaS', 'Artificial Intelligence', 'Fintech', 'Cybersecurity'],
    suggestedPrompt: 'Retrieve VPs of Engineering and CTOs at US software-as-a-service scaleups with 50-200 headcount.',
    sampleLeads: [
      { firstName: 'Adrian', lastName: 'Sterling', title: 'VP of Engineering', company: 'LogixFlow SaaS', email: 'a.sterling@logixflow.tech', phone: '+1 (415) 390-4821', linkedin: 'linkedin.com/in/adrian-sterling-b2b', deliverability: '99.4%' },
      { firstName: 'Amara', lastName: 'Chidubem', title: 'Chief Technology Officer', company: 'Veridian Cybersecurity', email: 'amara.c@veridian.io', phone: '+1 (650) 808-1192', linkedin: 'linkedin.com/in/amara-chidubem-tech', deliverability: '98.9%' },
      { firstName: 'Cody', lastName: 'Vanderbilt', title: 'Head of Product', company: 'NovaAPI Corp', email: 'cody@novaapi.com', phone: '+1 (408) 551-7729', linkedin: 'text-slate-400', deliverability: '99.1%' },
      { firstName: 'Maya', lastName: 'Sakamoto', title: 'Director of Security DevOps', company: 'Krypton Cloud Solutions', email: 'm.sakamoto@kryptoncloud.net', phone: '+1 (650) 539-0123', linkedin: 'linkedin.com/in/maya-sakamoto-dev', deliverability: '98.5%' }
    ]
  },
  {
    id: 'enterprise-whale',
    name: 'Enterprise Whale Hunter',
    icon: Building2,
    color: 'from-indigo-600 to-purple-600',
    borderColor: 'border-indigo-500/20',
    amberColor: 'text-indigo-500',
    badgeHex: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    description: 'Skilled in navigating Fortune 1000 organizations, procurement branches, logistics grids, and corporate CFO circles.',
    expertise: 'Sovereign supply lines, retail automation, global logistics systems.',
    typicalYield: 'Complex matrix organization procurement leads and corporate legal/finance headers.',
    industryFocus: ['Supply Chain', 'Global Retail Logistics', 'Enterprise Telecom', 'Aviation & Rail Corp'],
    suggestedPrompt: 'Map procurement directors and heads of logistics at European retail multi-nationals generating $50M+ ARR.',
    sampleLeads: [
      { firstName: 'Gerhardt', lastName: 'Schulz', title: 'VP of Global Logistics', company: 'TransitCorp AG', email: 'gerhardt.schulz@transitcorp.de', phone: '+49 89 2210892', linkedin: 'linkedin.com/in/gerhardt-schulz-logistics', deliverability: '98.8%' },
      { firstName: 'Nathalie', lastName: 'Dupont', title: 'Director of Strategic Sourcing', company: 'Monolith Global Retail', email: 'n.dupont@monolith-global.fr', phone: '+33 1 42685300', linkedin: 'linkedin.com/in/nathalie-dupont-retail', deliverability: '97.9%' },
      { firstName: 'Marcus', lastName: 'Kingsley', title: 'Head of Enterprise Procurement', company: 'Atlas Heavy Industry', email: 'kingsley.m@atlasheavy.co.uk', phone: '+44 20 7946 0192', linkedin: 'text-slate-400', deliverability: '98.2%' },
      { firstName: 'Elena', lastName: 'Rostova', title: 'SVP Operations & Fleet Optimization', company: 'Eurasia Transit Group', email: 'e.rostova@eurasiagroup.com', phone: '+353 1 496 0382', linkedin: 'linkedin.com/in/elena-rostova-transit', deliverability: '98.0%' }
    ]
  },
  {
    id: 'local-miner',
    name: 'Municipal & Local Miner',
    icon: Store,
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500/20',
    amberColor: 'text-emerald-500',
    badgeHex: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    description: 'Expertise in hyper-local targeting: identifying dental networks, main street properties, regional contractors, and local franchisees.',
    expertise: 'Small business operations, regional trade services, healthcare franchisees.',
    typicalYield: 'Direct lines to local owners, general partners, and independent medical clinicians.',
    industryFocus: ['Home Trades', 'Medical Practitioners', 'Regional Franchise Groups', 'Commercial Real Estate'],
    suggestedPrompt: 'Identify general contractors, architectural firms, and home construction owners in Dallas county with 10-50 staff.',
    sampleLeads: [
      { firstName: 'Thomas', lastName: 'Caldwell', title: 'Principal General Contractor', company: 'Caldwell Build Co', email: 't.cald@caldwellbuild.com', phone: '+1 (214) 490-2810', linkedin: 'text-slate-400', deliverability: '97.5%' },
      { firstName: 'Sarah', lastName: 'Garrison', title: 'Owner & Lead Clinician', company: 'Garrison Orthodontics', email: 'sarah.g@garrisonortho.com', phone: '+1 (214) 555-0918', linkedin: 'linkedin.com/in/sarah-garrison-dds', deliverability: '96.8%' },
      { firstName: 'Roberto', lastName: 'Mendoza', title: 'Managing Director & Partner', company: 'Lone Star Mechanical Trades', email: 'roberto@lonestarmechanical.org', phone: '+1 (817) 220-4491', linkedin: 'linkedin.com/in/roberto-mendoza', deliverability: '98.1%' },
      { firstName: 'Amanda', lastName: 'Oakes', title: 'Chief Architect & Founder', company: 'Oakes Design Studio', email: 'amanda@oakesdesigns.net', phone: '+1 (972) 349-1002', linkedin: 'linkedin.com/in/amanda-oakes-architect', deliverability: '97.2%' }
    ]
  },
  {
    id: 'viral-hacker',
    name: 'Viral Growth Hacker',
    icon: TrendingUp,
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500/20',
    amberColor: 'text-amber-500',
    badgeHex: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    description: 'Harnesses high-speed social telemetry. Targets DTC e-commerce founders, digital creators, SEO marketers, and agency operators.',
    expertise: 'Direct-to-consumer networks, TikTok/Insta shop storefronts, independent digital agencies.',
    typicalYield: 'Fast-moving digitally naive founders with rapid decision-making speeds.',
    industryFocus: ['DTC E-commerce', 'Creative Agencies', 'Digital Creator Commerce', 'Growth Marketing Systems'],
    suggestedPrompt: 'Scan founders and marketing leads at high-performing Shopify brands operating out of Canada or the UK.',
    sampleLeads: [
      { firstName: 'Declan', lastName: 'Hume', title: 'Founder & CEO', company: 'EnviroSkin DTC', email: 'declan.h@enviroskin.com', phone: '+1 (604) 791-0022', linkedin: 'linkedin.com/in/declan-hume-dtc', deliverability: '98.2%' },
      { firstName: 'Chloe', lastName: 'Burchfield', title: 'Head of Growth Marketing', company: 'NovaNutra Brands', email: 'chloe@novanutraco.uk', phone: '+44 161 496 0288', linkedin: 'linkedin.com/in/chloe-burchfield-growth', deliverability: '97.6%' },
      { firstName: 'Harrison', lastName: 'Pike', title: 'Managing Partner', company: 'PixelCraft Marketing', email: 'harrison@pixelcraftmedia.ca', phone: '+1 (416) 555-0199', linkedin: 'text-slate-400', deliverability: '98.0%' },
      { firstName: 'Zoe', lastName: 'Goldring', title: 'Director of Audience & Ad Operations', company: 'TrendSwell Digital', email: 'zoe@trendswelldigital.com', phone: '+1 (323) 808-1192', linkedin: 'linkedin.com/in/zoe-goldring', deliverability: '97.1%' }
    ]
  }
];

export default function AIAgentBuilder() {
  const [selectedAgent, setSelectedAgent] = useState<AgentPersona>(AGENTS[0]);
  const [promptValue, setPromptValue] = useState<string>(AGENTS[0].suggestedPrompt);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Set suggested prompt on matching Agent change
  const handleAgentSelect = (agent: AgentPersona) => {
    setSelectedAgent(agent);
    setPromptValue(agent.suggestedPrompt);
    setShowResults(false);
    setProcessStep(0);
  };

  // Perform multi-step terminal animation simulating AI execution
  const startAgentMining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptValue.trim() || isProcessing) return;

    setIsProcessing(true);
    setProcessStep(1);
    setShowResults(false);

    // Step 1: Initializing Connection (0.8s)
    setTimeout(() => {
      setProcessStep(2);
      
      // Step 2: Parameter Analysis & Extraction (1.0s)
      setTimeout(() => {
        setProcessStep(3);
        
        // Step 3: Domain DB Matching (1.2s)
        setTimeout(() => {
          setProcessStep(4);
          
          // Step 4: Triple-Check Active Verification (1.2s)
          setTimeout(() => {
            setProcessStep(5);
            
            // Step 5: Ready (0.8s)
            setTimeout(() => {
              setIsProcessing(false);
              setShowResults(true);
            }, 800);
          }, 1200);
        }, 1200);
      }, 1000);
    }, 800);
  };

  // Generate simulated CSV export
  const handleCSVDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);

    setTimeout(() => {
      const csvHeaders = ['First Name', 'Last Name', 'Job Title', 'Business Email', 'Direct Phone', 'Company Name', 'LinkedIn Link', 'Deliverability Baseline'];
      const csvRows = selectedAgent.sampleLeads.map(l => [
        l.firstName,
        l.lastName,
        l.title,
        l.email,
        l.phone,
        l.company,
        l.linkedin === 'text-slate-400' ? 'N/A' : l.linkedin,
        l.deliverability
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [csvHeaders.join(','), ...csvRows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      const filename = `ai_agent_${selectedAgent.id}_custom_b2b_leads.csv`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloading(false);
    }, 1200);
  };

  return (
    <div id="ai-agent-miner-dashboard" className="bg-slate-50 border border-slate-200/85 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
      {/* Decorative clean outline grids */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Upper Header segment */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/70 pb-6">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-650 bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="bg-amber-500/20 text-amber-700 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-500/10 font-bold">ALPHA PIPELINE</span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-brand-500" /> Natural Language Matcher</span>
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 tracking-tight">
                Zrolodex Custom AI Agent List Builders
              </h3>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 max-w-sm font-medium leading-relaxed bg-slate-100/75 px-4 py-2.5 rounded-xl border border-slate-200/50">
            Choose a highly-stylized lead acquisition AI agent below, input your targeting specifications, and watch as it cleanses domain indices and builds custom segments instantly.
          </div>
        </div>

        {/* Double Column Grid: Left Selector, Right Input/Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Selector panel of Agent Personas (4 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-black mb-1">Select Specialized AI Agent Profile</span>
            
            {AGENTS.map((agent) => {
              const Icon = agent.icon;
              const isSelected = selectedAgent.id === agent.id;
              
              return (
                <button
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent)}
                  className={`w-full text-left p-4 rounded-2xl border transition duration-150 cursor-pointer relative group flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-white border-brand-500 shadow-md ring-1 ring-brand-500/10'
                      : 'bg-white/50 border-slate-200/70 hover:bg-white hover:border-slate-350'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 pr-6 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm font-display tracking-tight leading-none">
                        {agent.name}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      {agent.description}
                    </p>
                  </div>

                  {/* Little chevron indicator */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-brand-500 transition duration-150">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Prompt Input, Processing states, Results Showcase (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/85 rounded-2xl shadow-sm p-6 space-y-6">
            
            {/* Selected Agent overview card */}
            {(() => {
              const AgentIcon = selectedAgent.icon;
              return (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedAgent.color} text-white flex items-center justify-center shrink-0`}>
                      <AgentIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold block leading-none">ACTIVE AGENT WORKSPACE</span>
                      <span className="text-xs font-bold text-slate-800 font-display mt-1 block">
                        {selectedAgent.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedAgent.industryFocus.map(ind => (
                      <span key={ind} className="bg-slate-200/80 text-slate-600 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Input Form */}
            <form onSubmit={startAgentMining} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block uppercase font-mono">
                  Custom List Prompt & Database Filter Criteria
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder="E.g., Find medical directors and orthopedic center practitioners in Los Angeles, California."
                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 rounded-xl p-3.5 pr-10 text-xs text-slate-700 font-medium placeholder-slate-400 focus:outline-none transition leading-relaxed"
                  />
                  <div className="absolute right-3.5 bottom-3.5 pointer-events-none text-slate-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Suggestions row helper */}
              <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50/55 p-2.5 border border-slate-200/30 rounded-lg">
                <Info className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Expertise parameters mapped:</span> {selectedAgent.expertise}
                </div>
              </div>

              {/* Run Agent Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isProcessing || !promptValue.trim()}
                  className="flex-shrink-0 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-850 disabled:bg-brand-800 text-white font-semibold text-xs px-5 py-3 rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-brand-900/10"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Agent Mining Database...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      Build List Match
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPromptValue(selectedAgent.suggestedPrompt)}
                  className="text-[10px] font-mono text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset to recommended prompt
                </button>
              </div>
            </form>

            {/* Simulated Live Processor Terminal Screen */}
            <AnimatePresence mode="wait">
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-slate-950 text-slate-300 font-mono p-4 rounded-xl text-[11px] space-y-2 border border-slate-800 shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-2 right-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  
                  <div className="text-slate-500 text-[10px] pb-1 border-b border-white/5 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-brand-400" />
                    <span>Active Telemetry Terminal (Zrolodex core)</span>
                  </div>

                  <div className="space-y-1.5">
                    {processStep >= 1 && (
                      <div className="flex items-start gap-2 text-slate-300">
                        <span className="text-emerald-400 font-bold">&#10003;</span>
                        <span>[CON_INIT] Connected to <span className="font-bold text-white">{selectedAgent.name}</span> context pool...</span>
                      </div>
                    )}
                    
                    {processStep >= 2 && (
                      <div className="flex items-start gap-2 text-slate-300">
                        <span className="text-emerald-400 font-bold">&#10003;</span>
                        <span>[PRMPT_PARSE] Tokenizing filter specifications... Target: <span className="text-brand-400 italic">"{promptValue.length > 50 ? promptValue.substring(0, 50) + '...' : promptValue}"</span></span>
                      </div>
                    )}

                    {processStep >= 3 && (
                      <div className="flex items-start gap-2 text-slate-300">
                        <span className="text-indigo-400 font-bold animate-pulse">&gt;&gt;</span>
                        <span>[INDEX_SCAN] Scanning active database index... Searching through 21,490,000 lead logs.</span>
                      </div>
                    )}

                    {processStep >= 4 && (
                      <div className="flex items-start gap-2 text-slate-400">
                        <span className="text-amber-400 font-bold animate-pulse">&gt;&gt;</span>
                        <span>[SMTP_VERIFY] Compiling contact details. Running double-blind MX records ping validation.</span>
                      </div>
                    )}

                    {processStep >= 5 && (
                      <div className="flex items-start gap-2 text-emerald-400 font-bold">
                        <span>[SUCCESS] Found 4 highly relevant sample records. Building output preview.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated outputs Showcase Table */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full font-mono font-bold uppercase inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500" /> Mapped List Ready
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 mt-1">Generated Lead Preview Profiles</h4>
                    </div>

                    <button
                      onClick={handleCSVDownload}
                      disabled={isDownloading}
                      className="text-[10px] bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-850 text-white font-bold font-mono px-3 py-1.5 rounded-lg transition duration-150 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-emerald-500/10"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Building...
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          Download AI Sample List (CSV)
                        </>
                      )}
                    </button>
                  </div>

                  {/* Responsive leads grid / table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner bg-slate-50/50">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 uppercase font-mono font-bold border-b border-slate-200">
                          <th className="p-3">Decision Maker</th>
                          <th className="p-3">Job Title & Firm</th>
                          <th className="p-3">Direct Contact Info</th>
                          <th className="p-3 text-center">MX Check</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedAgent.sampleLeads.map((lead, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition duration-100">
                            <td className="p-3 font-semibold text-slate-800">
                              {lead.firstName} {lead.lastName}
                            </td>
                            <td className="p-3">
                              <span className="text-slate-700 font-medium block">{lead.title}</span>
                              <span className="text-slate-400 text-[10px] block font-mono">{lead.company}</span>
                            </td>
                            <td className="p-3 space-y-1">
                              <div className="flex items-center gap-1 text-slate-600">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-mono">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                                <PhoneCall className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                                <span>{lead.phone}</span>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/40 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                                {lead.deliverability}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                    *Above is a high-fidelity 4-lead sample matching your search constraints. You can extract up to 100,000+ similar contacts instantly using our custom Outbound Estimator engine above.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}

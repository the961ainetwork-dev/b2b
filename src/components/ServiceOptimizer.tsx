import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wand2, 
  Target, 
  Database, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Sliders, 
  ArrowRight, 
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { SERVICES } from '../data';

interface ServiceOptimizerProps {
  onNavigateService: (serviceId: 'srv-1' | 'srv-2' | 'srv-3' | 'srv-4') => void;
}

export default function ServiceOptimizer({ onNavigateService }: ServiceOptimizerProps) {
  // Input User States for target optimizer
  const [primaryGoal, setPrimaryGoal] = useState<string>('acquire');
  const [targetVolume, setTargetVolume] = useState<number>(2500);
  const [mainChallenge, setMainChallenge] = useState<string>('bounces');
  const [industryFocus, setIndustryFocus] = useState<string>('SaaS');

  // Interactive Goals
  const GOALS = [
    { id: 'acquire', label: 'Acquire New Leads', subtitle: 'Target fresh, highly matching prospects', icon: <Database className="w-4 h-4 text-brand-600" /> },
    { id: 'outbound', label: 'Automate Outreach', subtitle: 'Book discovery calls & demos', icon: <Target className="w-4 h-4 text-indigo-600" /> },
    { id: 'append', label: 'Restore Old Data', subtitle: 'Enrich and clean aging CRM sheets', icon: <RefreshCw className="w-4 h-4 text-emerald-600" /> },
    { id: 'event', label: 'Fill Event Seats', subtitle: 'Maximize webinars & booths attendees', icon: <Calendar className="w-4 h-4 text-amber-600" /> },
  ];

  // Specific Challenges
  const CHALLENGES = [
    { id: 'bounces', label: 'High Email Bounce Rates', description: 'Lists contain stale or inactive mailboxes' },
    { id: 'nobookings', label: 'Low Meeting Booking Rates', description: 'Outreach sequences feel dry and generic' },
    { id: 'nosdrs', label: 'No Time for Manual Dialing', description: 'Small team bogged down by manual prospecting' },
    { id: 'dirtycrm', label: 'Outdated CRM Records', description: 'Contacts have shifted roles or companies recently' },
  ];

  // Live matching analysis calculation engine
  const optimizerResults = useMemo(() => {
    let recommendedId: 'srv-1' | 'srv-2' | 'srv-3' | 'srv-4' = 'srv-1';
    let matchScore = 95;
    let expectedHoursSaved = 0;
    let targetWarmupSafety: 'safe' | 'caution' | 'warning' = 'safe';
    let deliveryDays = '1-2 Days';
    let potentialRoiMultiplier = '3.4x';
    let specificActionSteps: string[] = [];

    // Volume calculation
    expectedHoursSaved = Math.round((targetVolume / 100) * 1.5 + 8);

    // Safety recommendation gauge
    if (targetVolume < 1500) {
      targetWarmupSafety = 'safe';
    } else if (targetVolume >= 1500 && targetVolume < 6000) {
      targetWarmupSafety = 'caution';
    } else {
      targetWarmupSafety = 'warning';
    }

    // Logic combining Goal + Challenge to recommend appropriate workspace
    if (primaryGoal === 'acquire') {
      if (mainChallenge === 'dirtycrm') {
        recommendedId = 'srv-3'; // Append is better if they have dirty records
        matchScore = 94;
        deliveryDays = 'Instant API Match';
        potentialRoiMultiplier = '4.1x';
        specificActionSteps = [
          'Filter out contact records with no active activity labels in past 6 months.',
          'Inject newly matched corporate mobile phone indicators through our Enrichment Workspace.',
          'Export newly appended CSV immediately with CRM formatting presets.'
        ];
      } else {
        recommendedId = 'srv-1'; // Lead list builder
        matchScore = 98;
        deliveryDays = 'Within 24 Hours';
        potentialRoiMultiplier = '5.0x';
        specificActionSteps = [
          'Isolate target titles utilizing exact geo-location parameters to avoid broad scrapers.',
          'Request a 50-record custom pilot sample to verify exact email deliverability.',
          'Utilize triple-verification layer (SMTP check, MX scan, & human confirmation).'
        ];
      }
    } else if (primaryGoal === 'outbound') {
      recommendedId = 'srv-2'; // Copywriting campaigns
      matchScore = 99;
      deliveryDays = 'Instant Generation';
      potentialRoiMultiplier = '4.6x';
      specificActionSteps = [
        'Utilize our live Outreach Generator to adjust subject headlines for high-conversion hooks.',
        'Adopt follow-up step intervals of 3, 5, and 9 business days for peak response rates.',
        'Incorporate personalized variable tags (e.g. {{Estimated Savings}}) into core email bodies.'
      ];
    } else if (primaryGoal === 'append') {
      recommendedId = 'srv-3'; // Data appending
      matchScore = 97;
      deliveryDays = 'Under 1 Hour';
      potentialRoiMultiplier = '3.8x';
      specificActionSteps = [
        'Upload raw CSVs or raw text blocks to map current LinkedIn positions.',
        'Append secondary contact parameters like direct office lines and direct social profiles.',
        'Scrub any hard-bouncing emails to preserve domain score warmth.'
      ];
    } else {
      recommendedId = 'srv-4'; // Event promotion
      matchScore = 96;
      deliveryDays = '2-4 Business Days';
      potentialRoiMultiplier = '6.2x';
      specificActionSteps = [
        'Isolate local executives within a 50-mile geographical radius of your physical event.',
        'Implement hyper-targeted invitational sequences mimicking conversational direct invites.',
        'Utilize visual progress targets to dynamically monitor predicted seat-turnout benchmarks.'
      ];
    }

    const matchedService = SERVICES.find(s => s.id === recommendedId) || SERVICES[0];

    return {
      service: matchedService,
      matchScore,
      expectedHoursSaved,
      targetWarmupSafety,
      deliveryDays,
      potentialRoiMultiplier,
      specificActionSteps
    };
  }, [primaryGoal, targetVolume, mainChallenge]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 md:p-8 space-y-8" id="service-optimizer-widget">
      
      {/* Widget Header with interactive badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-slate-800">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-brand-600">GTM AI Co-Pilot</span>
          </div>
          <h3 className="text-xl font-display font-bold text-slate-900">
            Interactive Service Optimizer
          </h3>
          <p className="text-xs text-slate-500 max-w-lg">
            Let our algorithm analyze your constraints, current challenges, and goal outputs to isolate the most efficient service hub for your team.
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1.5 rounded-2xl flex items-center gap-2 self-start md:self-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Analysis Engine Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Step 1: Select Goal */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono block">
              1. What is your primary objective?
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {GOALS.map((goal) => {
                const isActive = primaryGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setPrimaryGoal(goal.id)}
                    className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                      isActive 
                        ? 'bg-brand-50/40 border-brand-500/80 ring-2 ring-brand-500/10' 
                        : 'bg-white border-slate-200/80 hover:bg-slate-50/50 hover:border-slate-350'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                      isActive ? 'bg-white shadow-sm border border-brand-100' : 'bg-slate-50'
                    }`}>
                      {goal.icon}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold leading-none ${isActive ? 'text-brand-900' : 'text-slate-800'}`}>
                        {goal.label}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 font-normal leading-tight">
                        {goal.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Slider for Volume */}
          <div className="space-y-3 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono block">
                2. Monthly Prospects Needed
              </label>
              <span className="text-xs font-mono font-black text-brand-600 bg-white border border-brand-100 px-2.5 py-0.5 rounded-lg shadow-sm">
                {targetVolume.toLocaleString()} /mo
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={targetVolume}
              onChange={(e) => setTargetVolume(parseInt(e.target.value))}
              className="w-full accent-brand-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>500 Leads</span>
              <span>5k Medium</span>
              <span>10k Enterprise</span>
            </div>
          </div>

          {/* Step 3: Current Main Bottleneck */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono block">
              3. What is your biggest challenge?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CHALLENGES.map((challenge) => {
                const isActive = mainChallenge === challenge.id;
                return (
                  <button
                    key={challenge.id}
                    type="button"
                    onClick={() => setMainChallenge(challenge.id)}
                    className={`text-left px-3.5 py-2.5 rounded-xl border text-xs transition duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="font-bold block">{challenge.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Recommendations Panel */}
        <div className="lg:col-span-7 bg-slate-50/70 p-6 md:p-8 rounded-3xl border border-slate-200/60 relative space-y-6">
          
          {/* Output Tag Line */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Recommended Workspace Suggestion</span>
            <div className="flex items-center gap-1 bg-brand-600 text-white font-mono font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
              <Zap className="w-3 h-3 animate-pulse" />
              <span>Match Accuracy: {optimizerResults.matchScore}%</span>
            </div>
          </div>

          {/* Core Recommended Service Overview */}
          <motion.div
            key={optimizerResults.service.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-md font-mono font-bold uppercase block w-max">
                  {optimizerResults.service.id.toUpperCase()} • PRIMARY SOLUTION
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {optimizerResults.service.title}
                </h4>
              </div>
              <div className="w-10 h-10 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-700 shrink-0">
                {optimizerResults.service.id === 'srv-1' && <Database className="w-5 h-5" />}
                {optimizerResults.service.id === 'srv-2' && <Target className="w-5 h-5" />}
                {optimizerResults.service.id === 'srv-3' && <RefreshCw className="w-5 h-5" />}
                {optimizerResults.service.id === 'srv-4' && <Calendar className="w-5 h-5" />}
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {optimizerResults.service.shortDesc}
            </p>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
              <div className="space-y-0.5 bg-slate-50 p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Est. ROI</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{optimizerResults.potentialRoiMultiplier}</span>
              </div>
              <div className="space-y-0.5 bg-slate-50 p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Hours Saved</span>
                <span className="text-xs font-bold text-slate-800 font-mono">+{optimizerResults.expectedHoursSaved} hrs/mo</span>
              </div>
              <div className="space-y-0.5 bg-slate-50 p-2 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Turnaround</span>
                <span className="text-xs font-bold text-slate-800 font-mono">{optimizerResults.deliveryDays}</span>
              </div>
            </div>
          </motion.div>

          {/* Suggested Optimization Actions */}
          <div className="space-y-3.5">
            <h5 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Tailored Outreach Optimization Steps
            </h5>
            <ul className="space-y-2.5">
              {optimizerResults.specificActionSteps.map((step, sIdx) => (
                <motion.li
                  key={sIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sIdx * 0.1 }}
                  className="flex items-start gap-2.5 text-[11px] sm:text-xs text-slate-600 leading-normal font-sans"
                >
                  <span className="w-4 h-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-mono font-black rounded-md flex items-center justify-center shrink-0 mt-0.5">
                    {sIdx + 1}
                  </span>
                  <span>{step}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Domain Volume Safety Warning Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              {optimizerResults.targetWarmupSafety === 'safe' && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
              )}
              {optimizerResults.targetWarmupSafety === 'caution' && (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse mt-1" />
              )}
              {optimizerResults.targetWarmupSafety === 'warning' && (
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mt-1" />
              )}
            </div>
            <div className="space-y-1">
              <h6 className="text-[11px] font-bold text-slate-800 flex items-center gap-1 uppercase tracking-wide">
                Volume Warm-up Safety Level:
                <span className={`font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  optimizerResults.targetWarmupSafety === 'safe' ? 'bg-emerald-50 text-emerald-700' :
                  optimizerResults.targetWarmupSafety === 'caution' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                }`}>
                  {optimizerResults.targetWarmupSafety.toUpperCase()}
                </span>
              </h6>
              <p className="text-[10px] text-slate-500 leading-snug">
                {optimizerResults.targetWarmupSafety === 'safe' && 'Perfect list size for direct manual reachouts. Minimal warm-up required.'}
                {optimizerResults.targetWarmupSafety === 'caution' && 'Ensure your delivery domain has a DMARC and SPF policy configured before deploying this quantity.'}
                {optimizerResults.targetWarmupSafety === 'warning' && 'Highly scaled automation list. Split-batching across multiple send domains is strongly Recommended to protect IP records.'}
              </p>
            </div>
          </div>

          {/* Interactive CTA button */}
          <button
            type="button"
            onClick={() => onNavigateService(optimizerResults.service.id)}
            className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer shadow-md hover:-translate-y-0.5 select-none"
            id="launch-optimized-workspace-btn"
          >
            <span>Launch Optimized Workspace Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

    </div>
  );
}

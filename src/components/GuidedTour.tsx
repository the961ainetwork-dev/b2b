import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  HelpCircle, 
  Check, 
  Database, 
  Zap, 
  Search, 
  Mail, 
  Play, 
  Award 
} from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  positionDesc: string;
}

interface GuidedTourProps {
  onClose: () => void;
  onSelectPage: (page: 'home' | 'srv-1' | 'srv-2' | 'srv-3' | 'srv-4' | 'get-started' | 'admin') => void;
  onFinishSetup?: (industry: string, quantity: string) => void;
}

export default function GuidedTour({ onClose, onSelectPage, onFinishSetup }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  // Interactive configurations made during the tour
  const [tourIndustry, setTourIndustry] = useState('Technology & SaaS');
  const [tourQuantity, setTourQuantity] = useState('5,000 Leads');
  const [customIndustry, setCustomIndustry] = useState('');

  // List of Steps to highlight
  const steps: TourStep[] = [
    {
      targetId: 'hero-section',
      badge: 'Welcome Tour',
      icon: <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />,
      title: 'Welcome to Verified Lead Indexer!',
      description: 'Let\'s take a brief interactive tour of our core dashboard hubs. We help sales and marketing teams source triple-verified B2B contact lists instantly.',
      positionDesc: 'Explore our features step by step.'
    },
    {
      targetId: 'ai-agents-section',
      badge: 'Interactive Miner',
      icon: <Database className="w-5 h-5 text-brand-600 animate-bounce" />,
      title: 'AI Agent Miner',
      description: 'Say goodbye to complicated filtering menus. Select a specialized lead-mining agent, prompt your criteria in natural language, and watch the system match, compile, and qualify prospects in real time.',
      positionDesc: 'Located under the hero section.'
    },
    {
      targetId: 'list-estimator',
      badge: 'B2B Calculator',
      icon: <Zap className="w-5 h-5 text-amber-500 animate-pulse" />,
      title: 'Live Target Calculator',
      description: 'Input your target specifications. Adjust seniority, geo-radius, and industry metrics to estimate total available match volume and calculate custom budget options immediately.',
      positionDesc: 'Calculates leads instantly.'
    },
    {
      targetId: 'prospect-explorer',
      badge: 'Prospect Explorer',
      icon: <Search className="w-5 h-5 text-blue-500" />,
      title: 'Live Database Searcher',
      description: 'Directly search our verified footprint. Select industries, evaluate individual contact previews (e.g. verified tags for Direct Emails & active phone systems) dynamically.',
      positionDesc: 'Live database lookup.'
    },
    {
      targetId: 'outbound-builder',
      badge: 'Outreach Copilot',
      icon: <Mail className="w-5 h-5 text-purple-500" />,
      title: 'Smart Message Builder',
      description: 'Instantly generate high-converting cold outreach copies. Tailored for email, LinkedIn, or cold calling. Features modular copy-to-clipboard buttons for fast workflows!',
      positionDesc: 'Craft highly converting outbound copy.'
    },
    {
      targetId: 'faq',
      badge: 'Self-Help Support',
      icon: <HelpCircle className="w-5 h-5 text-slate-500" />,
      title: 'Searchable FAQ Bank',
      description: 'Have rapid questions regarding accuracy, delivery, GDPR/legal compliance, or custom sample files? Type keywords or click quick-filter category chips to find immediate answers.',
      positionDesc: 'Instant solutions filter.'
    },
    {
      targetId: 'contact-section',
      badge: 'Custom Sourcing',
      icon: <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />,
      title: 'Finish Setup: Free Lead Samples',
      description: 'Ready to receive your 25 free lead samples check? Choose your industry and volume target below, then click "Finish Setup" to pre-populate our quote desk and start your journey.',
      positionDesc: 'Final Step: Launch Outbound'
    }
  ];

  const activeStepItem = steps[currentStep];

  // Logic to track active element bounding rect
  useEffect(() => {
    // Reset to homepage to ensure all sections exist in the DOM
    onSelectPage('home');

    const updateHighlight = () => {
      if (!activeStepItem.targetId) {
        setHighlightRect(null);
        return;
      }
      
      const el = document.getElementById(activeStepItem.targetId);
      if (el) {
        // Scroll target element to center smoothly
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Timeout to fetch correct position after scrolling initiates
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          setHighlightRect(rect);
        }, 150);
      } else {
        setHighlightRect(null);
      }
    };

    updateHighlight();

    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight);
    };
  }, [currentStep, activeStepItem.targetId, onSelectPage]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onFinishSetup) {
        onFinishSetup(tourIndustry, tourQuantity);
      }
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Click on background overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Check if clicked exactly on background
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] overflow-x-hidden overflow-y-auto bg-slate-950/60 backdrop-blur-[1.5px] cursor-default flex flex-col justify-between"
      onClick={handleOverlayClick}
      id="guided-tour-backdrop"
    >
      
      {/* 1. Spotlight high-visibility frame overlay */}
      {highlightRect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            top: highlightRect.top + window.scrollY - 8,
            left: highlightRect.left + window.scrollX - 8,
            width: highlightRect.width + 16,
            height: highlightRect.height + 16,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className="absolute border-2 border-amber-500 rounded-3xl pointer-events-none z-[101] shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] ring-4 ring-amber-500/30"
          id="guided-tour-spotlight"
        />
      )}

      {/* Helper to spacing inside search */}
      <div className="flex-1" />

      {/* 2. Beautiful floating central controller overlay widget */}
      <div className="w-full max-w-lg mx-auto p-4 relative z-[105] mb-6 mt-16">
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100 flex flex-col justify-between relative overflow-hidden"
          id="guided-tour-panel"
        >
          {/* Top subtle grid effect */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none" />

          {/* Sparkle decorative circles */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-brand-100/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative space-y-4">
            {/* Steps & Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 px-2.5 bg-brand-50 border border-brand-100 rounded-lg text-[10px] font-mono font-extrabold text-brand-700 tracking-wider uppercase">
                  {activeStepItem.badge}
                </div>
                <span className="text-[10px] text-slate-400 font-medium font-mono">
                  {activeStepItem.positionDesc}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer"
                title="Exit Tour"
                id="tour-close-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content description */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                {activeStepItem.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {activeStepItem.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {activeStepItem.description}
                </p>
              </div>
            </div>

            {/* Interactive selections for the final step */}
            {currentStep === steps.length - 1 && (
              <div className="space-y-3.5 pt-3.5 border-t border-slate-150 border-slate-200 animate-fade-in" id="tour-interactive-config">
                {/* Industry Selection */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Target Industry Niche
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['SaaS & Tech', 'Healthcare', 'Finance', 'Real Estate', 'E-commerce'].map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => {
                          setTourIndustry(ind);
                          setCustomIndustry('');
                        }}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition duration-150 cursor-pointer ${
                          tourIndustry === ind && !customIndustry
                            ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        id={`ind-btn-${ind.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom industry entry input field */}
                  <div className="pt-1">
                    <input
                      type="text"
                      value={customIndustry}
                      onChange={(e) => {
                        setCustomIndustry(e.target.value);
                        setTourIndustry(e.target.value || 'SaaS & Tech');
                      }}
                      placeholder="Specify other specific custom niche..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all duration-150 text-slate-700 font-sans"
                      id="tour-custom-industry"
                    />
                  </div>
                </div>

                {/* Quantity selection buttons */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Desired Lead Volume
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['1,000 Leads', '5,000 Leads', '10,000 Leads', '25,000+ Leads'].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setTourQuantity(qty)}
                        className={`text-[10px] font-bold py-1.5 rounded-lg border text-center transition duration-150 cursor-pointer ${
                          tourQuantity === qty
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                        id={`qty-btn-${qty.replace(/[^0-9K+]/g, '')}`}
                      >
                        {qty.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Visual Step Progress indicators */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex gap-1.5 items-center">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep ? 'w-6 bg-brand-600' : 'w-2 bg-slate-200 hover:bg-slate-350'
                    }`}
                    title={`Step ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            {/* Lower row: action toggles */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600 px-3.5 py-2 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                id="tour-skip-link"
              >
                Skip Tour
              </button>
              
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition cursor-pointer"
                    id="tour-back-btn"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className={`${
                    currentStep === steps.length - 1
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-amber-500/10'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  } text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 transition cursor-pointer shadow-md`}
                  id="tour-next-btn"
                >
                  <span>{currentStep === steps.length - 1 ? 'Finish Setup' : 'Next'}</span>
                  {currentStep === steps.length - 1 ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      <div className="flex-1" />

    </div>
  );
}

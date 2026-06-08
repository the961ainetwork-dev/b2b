import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  MapPin, 
  Mail, 
  PhoneCall, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight, 
  FileSpreadsheet, 
  Users, 
  Star, 
  HelpCircle, 
  Database, 
  Briefcase, 
  RefreshCw, 
  Calendar,
  Cpu,
  Network,
  Zap,
  Send,
  Sparkles,
  Info,
  Check,
  ChevronDown,
  Menu,
  X,
  AlertCircle,
  Search,
  Shield
} from 'lucide-react';
import { SERVICES, TESTIMONIALS, FAQS, COMPETITIVE_MATRIX } from './data';
import type { TestimonialItem } from './types';
import EstimatorWidget from './components/EstimatorWidget';
import RecordPreview from './components/RecordPreview';
import OutreachGenerator from './components/OutreachGenerator';
import ActiveLeadsHeatmap from './components/ActiveLeadsHeatmap';
import AIAgentBuilder from './components/AIAgentBuilder';
import ServicePages from './components/ServicePages';
import GuidedTour from './components/GuidedTour';
import ServiceOptimizer from './components/ServiceOptimizer';
import LiveActivityTicker from './components/LiveActivityTicker';
import EmailVerifierWidget from './components/EmailVerifierWidget';
import AdminPanel from './components/AdminPanel';
import type { AdminSectionConfig } from './components/AdminPanel';

const DEFAULT_SECTIONS: AdminSectionConfig[] = [
  { id: 'hero-section', name: 'Hero Header Panel', title: 'Power Your Outbound with Localized B2B Contact Leads', subtitle: 'Access manual triple-verified business profiles & custom cold outreach data sequences matching your ideal client target persona.', isVisible: true, order: 1 },
  { id: 'competitive-edge-section', name: 'Premium Competitive Edge', title: 'Your Competitive Edge in the Market', subtitle: 'Enterprise-grade verification pipelines designed to build deep market access safely.', isVisible: true, order: 2 },
  { id: 'ai-agents-section', name: 'AI Sales Builders & Agents', title: 'Choose an AI Agent to Build Your Lead List', subtitle: 'Say goodbye to tedious filtering queries. Select the tailored agent of your industry focus below, prompt your custom criteria, and watch the validation loop build real-time matched output.', isVisible: true, order: 3 },
  { id: 'calculator-section', name: 'B2B Leads Cost Estimator', title: 'Instant Database Match & Pricing Estimate', subtitle: 'Establish your parameters below. Our database index counts will calculate matches instantly, letting you request custom samples with zero obligations.', isVisible: true, order: 4 },
  { id: 'core-services', name: 'Core Service Portfolios', title: 'End-to-End B2B Data & Marketing Services', subtitle: 'From fresh databases to complete client appointment acquisition. We cover every node of your sales outreach efforts.', isVisible: true, order: 5 },
  { id: 'prospect-explorer', name: 'B2B Database Prospect Explorer', title: 'Inspect Our B2B Database Record Fields', subtitle: 'Every profile delivered is packed with direct dials, verified company demographics, and verified email keys. Review actual format examples below.', isVisible: true, order: 6 },
  { id: 'database-footprint', name: 'Our Growing Local Database Footprint', title: 'Worldwide Reach & Lead Heatmap', subtitle: 'Establish high-fidelity geolocated campaign indices. Filter the global directory by key metrics and regions to observe density clusters instantly.', isVisible: true, order: 7 },
  { id: 'outbound-builder', name: 'AI Outreach Copywriter Builder', title: 'Instantly Generate Sales Sequences', subtitle: 'Connect the data you acquire directly to relevant outreach messaging models. Pick your core sales channel and objectives to copy pre-optimized frameworks instantly.', isVisible: true, order: 8 },
  { id: 'workflow-steps', name: '4-Step Workflow Framework', title: 'From Custom Request to Campaign Success in 4 Steps', subtitle: 'A streamlined verification loop guarantees that you never waste outbound marketing budget on bounced email keys.', isVisible: true, order: 9 },
  { id: 'client-evaluations', name: 'Client Evaluations & Wall of Stories', title: 'Trusted by 2,000+ Global Marketing Teams', subtitle: 'See how modern SDRs, demand planners, and agency executives scale up outreach ROI with our vetted sets.', isVisible: true, order: 10 },
  { id: 'faq', name: 'Frequently Asked Questions', title: 'Answers to Verification & Compliance Frameworks', subtitle: 'Clear summaries about our deliverability backups, manual checks & custom queries.', isVisible: true, order: 11 },
  { id: 'contact-section', name: 'Instant Custom Quote Desk', title: 'Request Custom Sample Leads Stack or Quote Details', subtitle: 'Tell us your niche filter coordinates, state parameters & quantity to test 25 free leads.', isVisible: true, order: 12 }
];

const getInitialSections = (): AdminSectionConfig[] => {
  try {
    const saved = localStorage.getItem('zrolodex_admin_sections');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn(e);
  }
  return DEFAULT_SECTIONS;
};

const getInitialStories = (): TestimonialItem[] => {
  try {
    const saved = localStorage.getItem('zrolodex_admin_stories');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn(e);
  }
  return TESTIMONIALS;
};

const getInitialSiteTitle = (): string => {
  try {
    const saved = localStorage.getItem('zrolodex_admin_siteTitle');
    if (saved) return saved;
  } catch (e) {
    console.warn(e);
  }
  return 'ZROLODEX.LIVE';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'srv-1' | 'srv-2' | 'srv-3' | 'srv-4' | 'get-started' | 'admin'>('home');
  const [sectionsState, setSectionsState] = useState<AdminSectionConfig[]>(getInitialSections);
  const [storiesState, setStoriesState] = useState<TestimonialItem[]>(getInitialStories);
  const [siteTitleState, setSiteTitleState] = useState<string>(getInitialSiteTitle);

  const getSectionConfig = (id: string): { isVisible: boolean; title: string; subtitle: string; } => {
    const config = sectionsState.find(s => s.id === id);
    if (!config) return { isVisible: true, title: '', subtitle: '' };
    return {
      isVisible: config.isVisible,
      title: config.title,
      subtitle: config.subtitle
    };
  };
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqSelectedCategory, setFaqSelectedCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tourActive, setTourActive] = useState(false);

  useEffect(() => {
    try {
      const hasSeenTour = localStorage.getItem('hasSeenTourV1');
      if (!hasSeenTour) {
        const timer = setTimeout(() => {
          setTourActive(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
  }, []);

  useEffect(() => {
    try {
      document.title = `${siteTitleState} | Verified Lead Indexer`;
    } catch (e) {
      console.warn('Document title update failed:', e);
    }
  }, [siteTitleState]);

  const handleCloseTour = () => {
    setTourActive(false);
    try {
      localStorage.setItem('hasSeenTourV1', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const handleFinishSetupFromTour = (industry: string, quantity: string) => {
    // 1. Ensure contact section is visible in sections state
    const sectionConfig = sectionsState.find(s => s.id === 'contact-section');
    if (sectionConfig && !sectionConfig.isVisible) {
      const updated = sectionsState.map(s => s.id === 'contact-section' ? { ...s, isVisible: true } : s);
      setSectionsState(updated);
      try {
        localStorage.setItem('zrolodex_admin_sections', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
    }
    
    // 2. Pre-fill target campaign fields
    setQuoteIndustry(industry);
    setQuoteQuantity(quantity);
    setQuoteMessage(`Hi Zrolodex team, I completed the guided onboarding tour and would like a custom list match for the ${industry} niche with the ${quantity} tier.`);
    
    // 3. Mark contact fields as touched so UI validation looks pre-validated/active
    setQuoteTouched(prev => ({
      ...prev,
      industry: true,
      message: true
    }));

    // 4. Close the tour overlay
    setTourActive(false);
    try {
      localStorage.setItem('hasSeenTourV1', 'true');
    } catch (e) {
      console.error(e);
    }

    // 5. Smoothly scroll to Quote Desk and focus the name input
    setTimeout(() => {
      const el = document.getElementById('contact-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inputEl = el.querySelector('input[placeholder="Your Name"]');
        if (inputEl) {
          (inputEl as HTMLInputElement).focus();
        }
      }
    }, 180);
  };

  const startGuidedTour = () => {
    setMobileMenuOpen(false);
    setServicesMenuOpen(false);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setTourActive(true);
    }, 150);
  };

  const navigateToAnchor = (targetId: string) => {
    setMobileMenuOpen(false);
    setServicesMenuOpen(false);
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // Custom Quotation state
  const [quoteIndustry, setQuoteIndustry] = useState('Technology & SaaS');
  const [quoteQuantity, setQuoteQuantity] = useState('5,000 Leads');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  // Real-time validation state parameters
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({});
  const [quoteTouched, setQuoteTouched] = useState<Record<string, boolean>>({});

  const validateQuoteField = (name: string, value: string) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) {
        error = 'Your name is required';
      } else if (value.trim().length < 2) {
        error = 'Name must be at least 2 characters';
      }
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        error = 'Business email is required';
      } else if (!emailRegex.test(value.trim())) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'industry') {
      if (!value.trim()) {
        error = 'Industry focus is required';
      } else if (value.trim().length < 2) {
        error = 'Please enter at least 2 characters';
      }
    } else if (name === 'message') {
      if (!value.trim()) {
        error = 'Target parameters are required';
      } else if (value.trim().length < 10) {
        error = 'Provide a little more detail about targets (min. 10 characters)';
      }
    }
    setQuoteErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleQuoteFieldChange = (name: string, value: string) => {
    if (name === 'name') setContactName(value);
    else if (name === 'email') setContactEmail(value);
    else if (name === 'industry') setQuoteIndustry(value);
    else if (name === 'message') setQuoteMessage(value);

    // If already touched, validate in real-time
    if (quoteTouched[name]) {
      validateQuoteField(name, value);
    }
  };

  const handleQuoteFieldBlur = (name: string, value: string) => {
    setQuoteTouched(prev => ({ ...prev, [name]: true }));
    validateQuoteField(name, value);
  };

  const getInputClass = (fieldName: string, baseClass = "") => {
    const isTouched = quoteTouched[fieldName];
    const error = quoteErrors[fieldName];
    
    if (!isTouched) {
      return `${baseClass} border-slate-200 focus:ring-brand-500/20 focus:border-brand-500`;
    }
    if (error) {
      return `${baseClass} border-red-500 ring-2 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500 bg-red-50/10`;
    }
    // checked and pristine
    return `${baseClass} border-emerald-500 ring-1 ring-emerald-500/5 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/5`;
  };

  // Triggering the free sample widget request
  const scrolltoEstimator = () => {
    const el = document.getElementById('list-estimator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = !contactName.trim() ? 'Your name is required' : contactName.trim().length < 2 ? 'Name must be at least 2 characters' : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailErr = !contactEmail.trim() ? 'Business email is required' : !emailRegex.test(contactEmail.trim()) ? 'Please enter a valid email address' : '';
    const industryErr = !quoteIndustry.trim() ? 'Industry focus is required' : quoteIndustry.trim().length < 2 ? 'Please enter at least 2 characters' : '';
    const messageErr = !quoteMessage.trim() ? 'Target parameters are required' : quoteMessage.trim().length < 10 ? 'Provide a little more detail about targets (min. 10 characters)' : '';

    const newErrors = {
      name: nameErr,
      email: emailErr,
      industry: industryErr,
      message: messageErr
    };

    setQuoteErrors(newErrors);
    setQuoteTouched({
      name: true,
      email: true,
      industry: true,
      message: true
    });

    if (nameErr || emailErr || industryErr || messageErr) {
      return;
    }

    setSubmissionLoading(true);
    // Simulate API quote posting
    setTimeout(() => {
      setSubmissionLoading(false);
      setQuoteSubmitted(true);
      setQuoteTouched({});
      setQuoteErrors({});
      setQuoteMessage('');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-brand-500 selection:text-white" id="main-application">
      
      {/* Top Banner Alert Segment */}
      <div className="bg-brand-950 text-white text-center py-2.5 px-4 text-xs font-medium border-b border-white/5 relative z-50">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-emerald-500 text-slate-950 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
            Hot Lead Promo
          </span>
          <p className="text-slate-200">
            Secure 25 standard verified contacts for free as part of your custom database evaluation. 
          </p>
          <button 
            onClick={scrolltoEstimator} 
            className="text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            Claim Sample Now
            <ChevronRight className="w-3 h-3 inline" />
          </button>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo brand */}
          <button 
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left border-none bg-transparent cursor-pointer group"
          >
            <div className="bg-brand-700 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform duration-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-black text-slate-900 text-lg md:text-xl tracking-tight block uppercase text-brand-705 bg-gradient-to-r from-brand-700 to-indigo-650 bg-clip-text text-transparent">
                {siteTitleState}
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider uppercase block -mt-1">
                Verified Lead Indexer
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => navigateToAnchor('ai-agents-section')}
              className="hover:text-brand-600 text-brand-600 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              AI Agent Miner
            </button>
            <button 
              onClick={() => navigateToAnchor('list-estimator')}
              className="hover:text-brand-600 transition cursor-pointer"
            >
              Target Calculator
            </button>

            {/* Our Services Hover Dropdown */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setServicesMenuOpen(true)}
              onMouseLeave={() => setServicesMenuOpen(false)}
            >
              <button 
                className={`hover:text-brand-600 transition flex items-center gap-1 cursor-pointer font-semibold ${
                  ['srv-1', 'srv-2', 'srv-3', 'srv-4'].includes(currentPage) ? 'text-brand-600' : 'text-slate-600'
                }`}
              >
                Our Capabilities
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-1 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-1"
                  >
                    <button 
                      onClick={() => { setCurrentPage('srv-1'); setServicesMenuOpen(false); }}
                      className={`w-full text-left p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer ${
                        currentPage === 'srv-1' ? 'bg-slate-50 text-brand-750 font-bold' : ''
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-800 block">B2B Core List Builder</span>
                      <span className="text-[9.5px] text-slate-400 block -mt-0.5 font-normal leading-tight">Sourcing manually triple-verified lists.</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('srv-2'); setServicesMenuOpen(false); }}
                      className={`w-full text-left p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer ${
                        currentPage === 'srv-2' ? 'bg-slate-50 text-brand-750 font-bold' : ''
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-800 block">Outbound Campaigns &amp; Copywriter</span>
                      <span className="text-[9.5px] text-slate-400 block -mt-0.5 font-normal leading-tight">Expert cold messaging strategy setups.</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('srv-3'); setServicesMenuOpen(false); }}
                      className={`w-full text-left p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer ${
                        currentPage === 'srv-3' ? 'bg-slate-50 text-brand-750 font-bold' : ''
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-800 block">Intelligent Data Enrichment</span>
                      <span className="text-[9.5px] text-slate-400 block -mt-0.5 font-normal leading-tight">Appending phone numbers &amp; active positions.</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('srv-4'); setServicesMenuOpen(false); }}
                      className={`w-full text-left p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer ${
                        currentPage === 'srv-4' ? 'bg-slate-50 text-brand-750 font-bold' : ''
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-800 block">Event Seat Promotion</span>
                      <span className="text-[9.5px] text-slate-400 block -mt-0.5 font-normal leading-tight">Fill virtual webinar roundtables by geo-radius.</span>
                    </button>
                    
                    <div className="border-t border-slate-150 pt-2 mt-1.5">
                      <button 
                        onClick={() => { setCurrentPage('get-started'); setServicesMenuOpen(false); }}
                        className="w-full text-left p-2 bg-amber-50 hover:bg-amber-100 rounded-xl transition flex items-center justify-between cursor-pointer border border-amber-200/40"
                      >
                        <div>
                          <span className="text-[11px] font-extrabold text-amber-950 block font-display">Get Started Workshop</span>
                          <span className="text-[9.5px] text-amber-700 block font-normal -mt-0.5">Interactive guided checklist.</span>
                        </div>
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => navigateToAnchor('prospect-explorer')}
              className="hover:text-brand-600 transition cursor-pointer"
            >
              Prospect Explorer
            </button>
            <button 
              onClick={() => navigateToAnchor('outbound-builder')}
              className="hover:text-brand-600 transition cursor-pointer"
            >
              Message Builder
            </button>
            <button 
              onClick={() => navigateToAnchor('client-evaluations')}
              className="hover:text-brand-600 transition cursor-pointer"
            >
              Why Choose Us
            </button>
            <button 
              onClick={() => navigateToAnchor('faq')}
              className="hover:text-brand-600 transition cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop Call to Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="mailto:contact@zrolodex.live" 
              className="text-xs font-mono font-bold text-slate-500 hover:text-brand-600 transition flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              contact@zrolodex.live
            </a>
            
            <button 
              onClick={startGuidedTour}
              className="bg-amber-500 hover:bg-amber-600 border border-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition duration-150 cursor-pointer shadow-md shadow-brand-500/10 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
              Get Started Tour
            </button>

            <button 
              onClick={() => setCurrentPage('admin')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl transition duration-150 cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Open Admin CMS Console"
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Mobile menu burger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-150 relative z-30 overflow-hidden"
          >
            <div className="p-4 space-y-4 font-semibold text-slate-700 text-sm flex flex-col">
              
              <button 
                onClick={startGuidedTour} 
                className="py-2.5 px-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-bold flex items-center justify-between text-left text-xs"
              >
                <div>
                  <span className="block">Get Started Tour</span>
                  <span className="block text-[10px] text-amber-700 font-normal">Our Interactive setup checklist</span>
                </div>
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
              </button>

              <div className="border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase mb-1.5">Direct Service Pages</span>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  <button onClick={() => { setCurrentPage('srv-1'); setMobileMenuOpen(false); }} className="text-left py-1 text-xs text-slate-600 hover:text-brand-600 font-medium">1. List Builder</button>
                  <button onClick={() => { setCurrentPage('srv-2'); setMobileMenuOpen(false); }} className="text-left py-1 text-xs text-slate-600 hover:text-brand-600 font-medium font-display">2. Outbound campaigns</button>
                  <button onClick={() => { setCurrentPage('srv-3'); setMobileMenuOpen(false); }} className="text-left py-1 text-xs text-slate-600 hover:text-brand-600 font-medium">3. CRM Appending</button>
                  <button onClick={() => { setCurrentPage('srv-4'); setMobileMenuOpen(false); }} className="text-left py-1 text-xs text-slate-600 hover:text-brand-600 font-medium">4. Event Seat Promoter</button>
                </div>
              </div>

              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase mb-1.5">Interactive Dashboard</span>
                <div className="flex flex-col pl-2 gap-2 text-xs">
                  <button onClick={() => navigateToAnchor('ai-agents-section')} className="text-left py-1 hover:text-brand-600 text-brand-600 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    AI Agent Miner
                  </button>
                  <button onClick={() => navigateToAnchor('list-estimator')} className="text-left py-1 hover:text-brand-600">Target Calculator</button>
                  <button onClick={() => navigateToAnchor('prospect-explorer')} className="text-left py-1 hover:text-brand-600">Prospect Explorer</button>
                  <button onClick={() => navigateToAnchor('outbound-builder')} className="text-left py-1 hover:text-brand-600 font-display">Message Builder</button>
                  <button onClick={() => navigateToAnchor('client-evaluations')} className="text-left py-1 hover:text-brand-600">Why Choose Us</button>
                  <button onClick={() => navigateToAnchor('faq')} className="text-left py-1 hover:text-brand-600">FAQ</button>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
                <button
                  onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 text-amber-500 font-bold rounded-xl flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Administrative CMS (/admin)</span>
                </button>
                <a href="mailto:contact@zrolodex.live" className="text-xs text-slate-500 font-mono flex items-center gap-1.5 py-1 justify-center mt-1">
                  <Mail className="w-4 h-4" />
                  contact@zrolodex.live
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentPage === 'home' ? (
        <>
          {/* Hero Block */}
      {getSectionConfig('hero-section').isVisible && (
      <section className="relative bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden" id="hero-section">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        {/* Subtle blur spheres */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Side Context */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              
              <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-3.5 py-1.5 text-xs text-brand-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                GDPR & CCPA Compliant B2B Leads Provider
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.1]">
                  {getSectionConfig('hero-section').title}
                </h1>
                <p className="text-slate-550 text-slate-500 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                  {getSectionConfig('hero-section').subtitle}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={scrolltoEstimator}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-8 py-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-brand-500/20"
                >
                  <Database className="w-4 h-4" />
                  Estimate Matched Leads Instantly
                </button>
                <a 
                  href="#contact-section"
                  className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-8 py-4 rounded-xl border border-slate-200 transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Get a Custom Quote (24 hrs)
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Highlight Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 border-dashed max-w-lg">
                <div>
                  <p className="text-2xl md:text-3xl font-display font-extrabold text-slate-900">95%+</p>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">SLA Bounce Guarantee</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-display font-extrabold text-blue-650 text-brand-600">2,000+</p>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">Active Global Clients</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-display font-extrabold text-teal-600">24Hr</p>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">Triple-Audit Delivery</p>
                </div>
              </div>

            </div>

            {/* Hero Right Side: Small Animated Floating Dashboard Panel */}
            <div className="lg:col-span-5 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full blur-3xl opacity-50 pointer-events-none" />
              
              <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl relative border border-slate-800 text-slate-100 space-y-6 w-full max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-xs font-mono font-bold text-slate-400">SMTP VERIFICATION PIPELINE</span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                    Live Status
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 text-xs flex justify-between items-center">
                    <div>
                      <p className="text-slate-400 font-medium">Core SMTP Handshake Match</p>
                      <p className="text-teal-400 font-mono font-bold mt-0.5">Active Server Connected</p>
                    </div>
                    <CheckCircle2 className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 text-xs flex justify-between items-center">
                    <div>
                      <p className="text-slate-400 font-medium">Domain MX Record Lookups</p>
                      <p className="text-teal-400 font-mono font-bold mt-0.5">A/MX Primary Match OK</p>
                    </div>
                    <CheckCircle2 className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 text-xs flex justify-between items-center">
                    <div>
                      <p className="text-slate-400 font-medium">Manual Account Audit Verify</p>
                      <p className="text-teal-400 font-mono font-bold mt-0.5">2-Tier Triple Check Done</p>
                    </div>
                    <CheckCircle2 className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 text-center">
                  <p className="text-slate-400 text-xs">
                    "Every lead we source goes through the Zrolodex double-blind validation loop."
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
      )}

      {/* Live Activity Ticker */}
      <LiveActivityTicker />

      {/* Your Competitive Edge & Capabilities Columns section */}
      {getSectionConfig('competitive-edge-section').isVisible && (
      <section className="py-16 md:py-24 bg-white relative border-b border-slate-100/80 overflow-hidden" id="competitive-edge-section">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-slate-50 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-50/40 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3 opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 md:space-y-18">
          
          {/* First Row: 2-column descriptive row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-3.5">
              <span className="bg-brand-50 text-brand-700 text-[10px] font-mono font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-brand-100 shadow-sm inline-block">
                Strategic Position
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-slate-900 tracking-tight leading-[1.15]">
                {getSectionConfig('competitive-edge-section').title}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                {getSectionConfig('competitive-edge-section').subtitle}
              </p>
            </div>
          </div>

          {/* Second Row: 3-column structured highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Column 1: Why We Lead / Unrivaled GTM Intelligence */}
            <div className="bg-slate-50/60 hover:bg-white border border-slate-200/60 hover:border-brand-200 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-amber-50 group-hover:bg-amber-100/80 rounded-xl flex items-center justify-center mb-6 transition-colors duration-200 border border-amber-100">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-[10px] text-amber-600 font-mono font-extrabold uppercase tracking-widest block mb-1">
                Why We Lead
              </span>
              <h3 className="text-lg font-bold text-slate-850 text-slate-900 mb-3">
                Unrivaled GTM Intelligence
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Access a comprehensive view of your market to understand exactly who your prospects are, what drives their needs, and the optimal moment to engage.
              </p>
            </div>

            {/* Column 2: Engineered for Connectivity */}
            <div className="bg-slate-50/60 hover:bg-white border border-slate-200/60 hover:border-brand-200 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100/80 rounded-xl flex items-center justify-center mb-6 transition-colors duration-200 border border-blue-100">
                <Network className="w-6 h-6 text-brand-500" />
              </div>
              <span className="text-[10px] text-brand-600 font-mono font-extrabold uppercase tracking-widest block mb-1">
                Systems Architecture
              </span>
              <h3 className="text-lg font-bold text-slate-850 text-slate-900 mb-3">
                Engineered for Connectivity
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Eliminate data silos by unifying your sales, marketing, and operations—creating a seamless flow of information across your entire tech stack.
              </p>
            </div>

            {/* Column 3: AI-Driven Velocity */}
            <div className="bg-slate-50/60 hover:bg-white border border-slate-200/60 hover:border-brand-200 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-50 group-hover:bg-purple-100/80 rounded-xl flex items-center justify-center mb-6 transition-colors duration-200 border border-purple-100">
                <Cpu className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-[10px] text-purple-600 font-mono font-extrabold uppercase tracking-widest block mb-1">
                Optimized Output
              </span>
              <h3 className="text-lg font-bold text-slate-850 text-slate-900 mb-3">
                AI-Driven Velocity
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Offload high-volume, repetitive tasks to our agent-ready systems, allowing your team to reclaim their time and focus on what matters most: closing deals and strengthening client relationships.
              </p>
            </div>

          </div>

        </div>
      </section>
      )}

      {/* AI Agent Automated Lead Assembly Section */}
      {getSectionConfig('ai-agents-section').isVisible && (
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-100/30 to-white relative border-b border-slate-100" id="ai-agents-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-3">
            <span className="bg-amber-100/60 text-amber-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              Automated AI Sourcing Agents
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {getSectionConfig('ai-agents-section').title}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              {getSectionConfig('ai-agents-section').subtitle}
            </p>
          </div>

          {/* Core AIAgentBuilder block */}
          <AIAgentBuilder />

        </div>
      </section>
      )}

      {/* Main Interactive Segment: EstimatorWidget */}
      {getSectionConfig('calculator-section').isVisible && (
      <section className="py-12 md:py-20 bg-white border-t border-b border-slate-100" id="calculator-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-3">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100">
              Pricing Calculator
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {getSectionConfig('calculator-section').title}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              {getSectionConfig('calculator-section').subtitle}
            </p>
          </div>

          <EstimatorWidget />

        </div>
      </section>
      )}

      {/* Core B2B Services Suite */}
      {getSectionConfig('core-services').isVisible && (
      <section className="py-16 md:py-24 bg-slate-50/70" id="core-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-3">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-100">
              Services Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {getSectionConfig('core-services').title}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              {getSectionConfig('core-services').subtitle}
            </p>
          </div>

          {/* Real-time Interactive Service Suggestions Optimizer */}
          <div className="mb-16">
            <ServiceOptimizer onNavigateService={(id) => setCurrentPage(id)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((srv) => (
              <div 
                key={srv.id}
                className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-2px] transition duration-200 flex flex-col justify-between gap-6"
                id={`service-${srv.id}`}
              >
                <div className="space-y-4">
                  <div className="bg-brand-50 text-brand-700 w-12 h-12 rounded-2xl flex items-center justify-center">
                    {srv.id === 'srv-1' && <Database className="w-6 h-6" />}
                    {srv.id === 'srv-2' && <Target className="w-6 h-6" />}
                    {srv.id === 'srv-3' && <RefreshCw className="w-6 h-6" />}
                    {srv.id === 'srv-4' && <Calendar className="w-6 h-6" />}
                  </div>

                  <h3 className="font-display font-bold text-slate-900 text-xl md:text-2xl">
                    {srv.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {srv.longDesc}
                  </p>
                </div>

                <div className="border-t border-slate-50 pt-5 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Service Deliverables include:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                    {srv.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>
      )}

      {/* Prospect Explorer Section */}
      {getSectionConfig('prospect-explorer').isVisible && (
      <section className="py-16 md:py-24 bg-white border-t border-b border-slate-100" id="prospect-explorer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-teal-100">
              Database Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {getSectionConfig('prospect-explorer').title}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              {getSectionConfig('prospect-explorer').subtitle}
            </p>
          </div>

          <RecordPreview onTriggerSample={scrolltoEstimator} />

          {/* Real-time Email Verifier Interactive Sandbox */}
          <div className="mt-16 border-t border-slate-100 pt-16">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100">
                Outbound Safeguard Analysis
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                Simulate a SMTP Handshake Live
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Experience the raw verification loop that powers our platform. Try random corporate addresses below to observe direct mail-exchanger checks and mailbox availability queries.
              </p>
            </div>
            
            <EmailVerifierWidget />
          </div>

        </div>
      </section>
      )}

      {/* Global B2B Reach & Heatmap Visualizer */}
      {getSectionConfig('database-footprint').isVisible && (
      <section className="py-16 md:py-24 bg-slate-50 border-t border-b border-slate-100" id="database-footprint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-3">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100">
              Database Coverage
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {getSectionConfig('database-footprint').title}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              {getSectionConfig('database-footprint').subtitle}
            </p>
          </div>

          <ActiveLeadsHeatmap />

        </div>
      </section>
      )}

      {/* Live Messaging Outreach builder */}
      {getSectionConfig('outbound-builder').isVisible && (
      <section className="py-16 md:py-24 bg-slate-950 relative overflow-hidden" id="outbound-builder">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-800/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 position-relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Context Left Column */}
            <div className="lg:col-span-4 space-y-6 text-white">
              <span className="bg-teal-500/10 text-teal-400 text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-teal-500/20">
                Outreach Companion
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium leading-tight">
                {getSectionConfig('outbound-builder').title}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
                {getSectionConfig('outbound-builder').subtitle}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-white/5 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <p>Matches targeting filters set in estimator widget.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <p>Tailors tone to executives, directors, or operations.</p>
                </div>
              </div>
            </div>

            {/* Core assistant right side */}
            <div className="lg:col-span-8">
              <OutreachGenerator />
            </div>

          </div>

        </div>
      </section>
      )}

      {/* 4 Steps Timeline Flow */}
      {getSectionConfig('workflow-steps').isVisible && (
      <section className="py-16 md:py-24 bg-white" id="workflow-steps">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-3">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100">
              Work Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {getSectionConfig('workflow-steps').title}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              {getSectionConfig('workflow-steps').subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Visual connector line for timeline */}
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-slate-100 z-0" />

            {/* Step 1 */}
            <div className="space-y-4 text-center md:text-left relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-lg font-bold font-mono border-2 border-brand-100 mx-auto md:mx-0 shadow-md">
                01
              </div>
              <h4 className="font-display font-bold text-slate-800 text-lg">Define Target Criteria</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Choose your specific target verticals, exact metropolitan states, management hierarchy, and annual firmographic sizes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center md:text-left relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-lg font-bold font-mono border-2 border-brand-100 mx-auto md:mx-0 shadow-md">
                02
              </div>
              <h4 className="font-display font-bold text-slate-800 text-lg">We Build Your Core List</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Our dynamic match system aggregates public datasets and executes automatic SMTP/MX routing verification checks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center md:text-left relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-lg font-bold font-mono border-2 border-brand-100 mx-auto md:mx-0 shadow-md">
                03
              </div>
              <h4 className="font-display font-bold text-slate-800 text-lg">Sample & Approve</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Download your 25 complementary verified prospects. Inspect data points and audit actual live response standards before completion.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 text-center md:text-left relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-lg font-bold font-mono border-2 border-brand-100 mx-auto md:mx-0 shadow-md">
                04
              </div>
              <h4 className="font-display font-bold text-slate-800 text-lg">Launch & Scale Outbound</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Import CSV records to Apollo, HubSpot, or any CRM package. Unleash campaigns knowing deliverability is SLA-backed.
              </p>
            </div>

          </div>

        </div>
      </section>
      )}

      {/* Grid Comparison Section */}
      <section className="py-16 md:py-24 bg-slate-50" id="competitive-matrix">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              ZROLODEX.LIVE vs. Standard Data Providers
            </h2>
            <p className="text-slate-500 text-sm">
              Why 2000+ top enterprises choose Zrolodex. Clean verification processes provide stellar delivery.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-semibold text-xs font-mono uppercase tracking-wider border-b border-slate-850">
                    <th className="py-5 px-6">Criteria Metric</th>
                    <th className="py-5 px-6 text-brand-400">Our Target Performance</th>
                    <th className="py-5 px-6 text-slate-400">Others Vendors/Scrapers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {COMPETITIVE_MATRIX.features.map((feat, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-4.5 px-6 font-bold text-slate-800">{feat.name}</td>
                      <td className="py-4.5 px-6 font-medium text-slate-800 flex items-center gap-1.5">
                        <Check className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                        {feat.target}
                      </td>
                      <td className="py-4.5 px-6 text-slate-450 text-slate-500">{feat.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* CRM Sync Compatibility Segment */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100" id="crm-compatibility">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100">
              Direct Push Integrations
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Enterprise CRM Sync Compatibility
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              Say goodbye to manual scraping. Export and stream your triple-verified lists directly into your marketing workflows or CRM systems with 1-click mapping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Salesforce Integration Card */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 hover:shadow-xl hover:border-blue-200 transition duration-300 group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-55 text-blue-600 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                  {/* Salesforce Custom Cloud SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.1 10.3c-.2-.1-.4-.2-.6-.2h-.1c-1.1-2.4-3.5-3.9-6.1-3.6-2.1.2-3.9 1.5-4.7 3.4-.6-.4-1.3-.5-2-.4-1.7.3-3 1.8-3 3.5 0 2 1.6 3.6 3.6 3.6H19c1.7 0 3-1.4 3-3.1 0-1.8-1.3-3.1-2.9-3.2z" />
                  </svg>
                </div>
                <span className="bg-blue-100/70 text-blue-700 font-mono text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-blue-200">
                  Native App
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-800 font-display group-hover:text-blue-600 transition">Salesforce Cloud Link</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Map leads instantly into custom campaign groups, assign directly to SDR owners, and audit duplicate indexes automatically prior to billing.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Field Mapping</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 32 Custom Fields
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                <span>Configure sync parameters</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* HubSpot Integration Card */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 hover:shadow-xl hover:border-orange-200 transition duration-300 group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-orange-55 text-orange-600 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 shadow-sm">
                  {/* HubSpot Sprocket SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-[2.2]" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="7" r="2.5" />
                    <circle cx="7" cy="15.5" r="2.5" />
                    <circle cx="17" cy="15.5" r="2.5" />
                    <line x1="12" y1="9.5" x2="12" y2="13.5" />
                    <line x1="12" y1="13.5" x2="8.75" y2="13.5" />
                    <line x1="12" y1="13.5" x2="15.25" y2="13.5" />
                  </svg>
                </div>
                <span className="bg-orange-100/70 text-orange-700 font-mono text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-orange-200">
                  1-Click Auth
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-800 font-display group-hover:text-orange-600 transition">HubSpot CRM Setup</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Export verified contacts as marketing leads or full company objects with corporate domain association mapped instantly.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Export Speed</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Near Instantaneous
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-orange-600 font-bold">
                <span>Initiate HubSpot link</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Pipedrive Integration Card */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 hover:shadow-xl hover:border-emerald-200 transition duration-300 group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-emerald-55 text-emerald-600 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm">
                  {/* Pipedrive Arrow SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-[2.2]" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="6" height="5" rx="1" />
                    <rect x="14" y="4" width="6" height="5" rx="1" />
                    <rect x="4" y="15" width="6" height="5" rx="1" />
                    <rect x="14" y="15" width="6" height="5" rx="1" />
                    <path d="M10 6.5h4M10 17.5h4" />
                  </svg>
                </div>
                <span className="bg-emerald-100/70 text-emerald-700 font-mono text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border border-emerald-200">
                  Ready API
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-800 font-display group-hover:text-emerald-600 transition">Pipedrive Pipelines</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Build custom deal pipelines populated with rich context. Automatically attach telephone, LinkedIn, region and sector details.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Webhook Integration</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Fully Supported
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <span>Create pipeline mapping</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick-stats and list of supported minor platforms */}
          <div className="mt-12 p-6 bg-slate-50/50 rounded-2xl border border-slate-200/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Database className="w-5 h-5 text-brand-450 text-brand-400" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-800">Need another integration connector?</h5>
                <p className="text-xs text-slate-500">
                  We generate custom CSV exports fully structurally compatible with Apollo, Zoho, Outreach, and Microsoft Dynamics.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {['Zoho CRM', 'Apollo.io', 'Clay', 'Microsoft Dynamics', 'Zapier Connector', 'Webhook API'].map((item) => (
                <span key={item} className="text-[10px] font-mono font-bold bg-white text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Client Evaluations */}
      {getSectionConfig('client-evaluations').isVisible && (
      <section className="py-16 md:py-24 bg-white" id="client-evaluations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-100">
              User Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              {getSectionConfig('client-evaluations').title}
            </h2>
            <p className="text-slate-550 text-slate-500 text-sm">
              {getSectionConfig('client-evaluations').subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storiesState.map((test) => (
              <div 
                key={test.id} 
                className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 flex flex-col justify-between hover:translate-y-[-2px] transition duration-200"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(test.rating)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-650 text-xs md:text-sm italic leading-relaxed text-slate-600">
                    "{test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200/60">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-[#0c4375] font-extrabold flex items-center justify-center">
                    {test.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm leading-tight">{test.name}</h5>
                    <p className="text-slate-400 text-[11px] font-medium leading-none mt-1">
                      {test.role} • <strong>{test.company}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      )}

      {/* Accordion FAQ Section */}
      {getSectionConfig('faq').isVisible && (
      <section className="py-16 md:py-24 bg-slate-50/70" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100">
              Got Questions?
            </span>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              {getSectionConfig('faq').title}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              {getSectionConfig('faq').subtitle}
            </p>
          </div>

          {/* FAQ Filter Tools */}
          <div className="max-w-xl mx-auto mb-10 space-y-4">
            {/* Search input bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search FAQ by keywords (e.g., accuracy, GDPR, email)..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl bg-white border border-slate-200/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none placeholder-slate-400 text-slate-800 transition shadow-sm font-sans"
              />
              {faqSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFaqSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Keyword Chip Selector Buttons */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                { id: 'all', label: 'All Queries' },
                { id: 'accuracy', label: 'Accuracy & Quality' },
                { id: 'compliance', label: 'GDPR & Compliance' },
                { id: 'delivery', label: 'Delivery Time' },
                { id: 'samples', label: 'Free Samples' },
              ].map((category) => {
                const isActive = faqSelectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFaqSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition border ${
                      isActive
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 animate-fade-in" id="faq-accordions">
            {(() => {
              const filtered = FAQS.filter((faq) => {
                const matchesQuery =
                  faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                  faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
                if (!matchesQuery) return false;

                if (faqSelectedCategory === 'all') return true;
                if (faqSelectedCategory === 'accuracy' && (faq.id === 'f-1' || faq.id === 'f-5')) return true;
                if (faqSelectedCategory === 'compliance' && faq.id === 'f-2') return true;
                if (faqSelectedCategory === 'delivery' && faq.id === 'f-3') return true;
                if (faqSelectedCategory === 'samples' && faq.id === 'f-4') return true;

                return false;
              });

              if (filtered.length === 0) {
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-10 px-6 bg-white rounded-2xl border border-slate-200/60 max-w-sm mx-auto space-y-4 shadow-sm"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-xs">No Matches Found</h4>
                      <p className="text-slate-500 text-[11px] leading-relaxed max-w-xs mx-auto">
                        We couldn't find matches for "{faqSearchQuery}" in this context. Try typing another term or reset.
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setFaqSearchQuery('');
                          setFaqSelectedCategory('all');
                        }}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-xl transition cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </motion.div>
                );
              }

              return filtered.map((faq) => {
                const isOpen = activeFAQ === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className="bg-white rounded-2xl border border-slate-150/80 overflow-hidden transition-all duration-200 hover:shadow-sm"
                  >
                    <button
                      onClick={() => setActiveFAQ(isOpen ? null : faq.id)}
                      className="w-full text-left py-4.5 px-6 flex items-center justify-between font-semibold font-display text-slate-800 text-sm md:text-base cursor-pointer hover:bg-slate-50/50 transition gap-4"
                    >
                      <span className="leading-snug">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition duration-200 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="p-6 pt-0 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              });
            })()}
          </div>

        </div>
      </section>
      )}

      {/* Custom Section Blocks added dynamically via Admin Panel */}
      {sectionsState
        .filter(sec => sec.isVisible && !DEFAULT_SECTIONS.some(deflt => deflt.id === sec.id))
        .map(sec => (
          <section key={sec.id} className="py-16 md:py-24 bg-gradient-to-r from-slate-900 to-brand-950 text-white relative border-b border-brand-900 overflow-hidden" id={sec.id}>
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-mono font-extrabold pb-0.5 uppercase px-3 py-1 rounded-full border border-amber-500/20 inline-block">
                Custom Page Block: #{sec.id}
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
                {sec.title}
              </h2>
              {sec.subtitle && (
                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans">
                  {sec.subtitle}
                </p>
              )}
            </div>
          </section>
        ))}

      {/* Quote Request Form block */}
      {getSectionConfig('contact-section').isVisible && (
      <section className="py-16 md:py-24 bg-white" id="contact-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="bg-brand-950 text-white rounded-3xl overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="p-6 md:p-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-5 space-y-6">
                <div>
                  <span className="bg-white/10 text-teal-300 border border-white/10 px-3 py-1 text-[10px] font-mono rounded mt-2 uppercase font-extrabold tracking-wider">
                    Fast Turnaround
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight mt-4">
                    {getSectionConfig('contact-section').title}
                  </h3>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">
                  {getSectionConfig('contact-section').subtitle}
                </p>

                <div className="space-y-3.5 text-xs text-slate-300 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-teal-400" />
                    <span>contact@zrolodex.live</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Free sample lookup included with prompt reply</span>
                  </div>
                </div>
              </div>

              {/* Form Input area */}
              <div className="md:col-span-7 bg-white text-slate-700 p-6 md:p-8 rounded-2xl shadow-xl">
                
                {quoteSubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-14 h-14 bg-emerald-55 text-emerald-650 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-display font-bold text-slate-800 text-lg">Requirements Transmitted!</h4>
                      <p className="text-slate-500 text-xs">
                        Hi {contactName}, your target parameters for <strong className="text-brand-650 text-brand-600">{quoteIndustry}</strong> have been received. We will send matching lead counts and a 25 leads sample spreadsheet to your mail: <strong className="text-slate-700">{contactEmail}</strong> in 2 hours.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setQuoteSubmitted(false);
                        setQuoteTouched({});
                        setQuoteErrors({});
                      }}
                      className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer underline"
                    >
                      Update Parameters / Resubmit
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <h4 className="font-display font-bold text-slate-800 text-base">Transmission Form</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => handleQuoteFieldChange('name', e.target.value)}
                          onBlur={(e) => handleQuoteFieldBlur('name', e.target.value)}
                          placeholder="Your Name"
                          className={getInputClass('name', 'w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs focus:outline-none transition-all duration-200')}
                        />
                        {quoteTouched.name && quoteErrors.name ? (
                          <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1 font-sans">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            {quoteErrors.name}
                          </p>
                        ) : quoteTouched.name && !quoteErrors.name && contactName ? (
                          <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1 font-sans animate-fade-in">
                            <Check className="w-3.5 h-3.5 flex-shrink-0" />
                            Full name verified
                          </p>
                        ) : null}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Email</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => handleQuoteFieldChange('email', e.target.value)}
                          onBlur={(e) => handleQuoteFieldBlur('email', e.target.value)}
                          placeholder="you@company.com"
                          className={getInputClass('email', 'w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs focus:outline-none transition-all duration-200')}
                        />
                        {quoteTouched.email && quoteErrors.email ? (
                          <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1 font-sans">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            {quoteErrors.email}
                          </p>
                        ) : quoteTouched.email && !quoteErrors.email && contactEmail ? (
                          /@(gmail|yahoo|hotmail|outlook|aol|live|msn|icloud|mail)\.com$/i.test(contactEmail) ? (
                            <div className="text-[10px] text-amber-600 font-medium flex items-start gap-1 mt-1 font-sans leading-tight bg-amber-50/50 p-1.5 rounded border border-amber-100/30">
                              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                              <span>Corporate domain recommended for high-priority matching.</span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1 font-sans">
                              <Check className="w-3.5 h-3.5 flex-shrink-0" />
                              Business email verified
                            </p>
                          )
                        ) : null}
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Industry focus */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry Target</label>
                        <input
                          type="text"
                          required
                          value={quoteIndustry}
                          onChange={(e) => handleQuoteFieldChange('industry', e.target.value)}
                          onBlur={(e) => handleQuoteFieldBlur('industry', e.target.value)}
                          placeholder="e.g. Technology, Medical"
                          className={getInputClass('industry', 'w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs focus:outline-none transition-all duration-200')}
                        />
                        {quoteTouched.industry && quoteErrors.industry ? (
                          <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1 font-sans">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            {quoteErrors.industry}
                          </p>
                        ) : quoteTouched.industry && !quoteErrors.industry && quoteIndustry ? (
                          <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1 font-sans">
                            <Check className="w-3.5 h-3.5 flex-shrink-0" />
                            Industry focus verified
                          </p>
                        ) : null}
                      </div>

                      {/* Target size */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Quantity</label>
                        <select
                          value={quoteQuantity}
                          onChange={(e) => setQuoteQuantity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none appearance-none cursor-pointer text-slate-600 font-semibold"
                        >
                          <option value="1,000 Leads">1,000 Leads</option>
                          <option value="5,000 Leads">5,000 Leads</option>
                          <option value="10,000 Leads">10,000 Leads</option>
                          <option value="25,000+ Leads">25,000+ Leads (Enterprise)</option>
                        </select>
                      </div>

                    </div>

                    {/* Specifications */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Describe your Target Persona & Location</label>
                      <textarea
                        rows={3}
                        required
                        value={quoteMessage}
                        onChange={(e) => handleQuoteFieldChange('message', e.target.value)}
                        onBlur={(e) => handleQuoteFieldBlur('message', e.target.value)}
                        placeholder="Define region (e.g. Texas, London), titles (e.g. CMO), or company revenues..."
                        className={getInputClass('message', 'w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs focus:outline-none resize-none font-sans transition-all duration-200')}
                      />
                      {quoteTouched.message && quoteErrors.message ? (
                        <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1 font-sans">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {quoteErrors.message}
                        </p>
                      ) : quoteTouched.message && !quoteErrors.message && quoteMessage ? (
                        <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1 font-sans">
                          <Check className="w-3.5 h-3.5 flex-shrink-0" />
                          Specification parameters updated ({quoteMessage.length} chars)
                        </p>
                      ) : null}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submissionLoading}
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer"
                    >
                      {submissionLoading ? 'Transmitting Specs...' : 'Request Match Analysis'}
                      <Send className="w-3.5 h-3.5" />
                    </button>

                  </form>
                )}

              </div>

            </div>
          </div>

        </div>
      </section>
      )}

        </>
      ) : currentPage === 'admin' ? (
        <AdminPanel 
          onClose={() => setCurrentPage('home')}
          sections={sectionsState}
          onUpdateSections={(newSecs) => {
            setSectionsState(newSecs);
            try {
              localStorage.setItem('zrolodex_admin_sections', JSON.stringify(newSecs));
            } catch(e) { console.error(e); }
          }}
          stories={storiesState}
          onUpdateStories={(newStories) => {
            setStoriesState(newStories);
            try {
              localStorage.setItem('zrolodex_admin_stories', JSON.stringify(newStories));
            } catch(e) { console.error(e); }
          }}
          siteTitle={siteTitleState}
          onUpdateSiteTitle={(newTitle) => {
            setSiteTitleState(newTitle);
            try {
              localStorage.setItem('zrolodex_admin_siteTitle', newTitle);
            } catch(e) { console.error(e); }
          }}
        />
      ) : (
        <ServicePages initialTab={currentPage as any} onBackToHome={() => setCurrentPage('home')} />
      )}

      {/* Corporate footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 text-xs">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-brand-700 text-white w-8 h-8 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <span className="font-display font-black text-white text-lg tracking-tight uppercase">
                {siteTitleState}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {siteTitleState} is a premier global provider of accurate B2B contact lists, lead generation strategy, database auditing, and custom outbound campaigns since 2014.
            </p>
            
            {/* Badges of compliance */}
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                GDPR COMPLIANT
              </div>
              <div className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                CCPA COMPLIANT
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h5 className="font-display font-semibold text-white uppercase tracking-wider text-[11px]">Primary Capabilities</h5>
            <ul className="space-y-2">
              <li><a href="#core-services" className="hover:text-white transition">B2B Core List Building</a></li>
              <li><a href="#core-services" className="hover:text-white transition">Outreach Sequences Dev</a></li>
              <li><a href="#core-services" className="hover:text-white transition">Data Appending Core</a></li>
              <li><a href="#core-services" className="hover:text-white transition">B2B Lead Appointments</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h5 className="font-display font-semibold text-white uppercase tracking-wider text-[11px]">Get in Touch</h5>
            <ul className="space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5 text-slate-300">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>Email: <a href="mailto:contact@zrolodex.live" className="hover:underline text-white">contact@zrolodex.live</a></span>
              </li>
              <li>Office Hours: Mon-Fri | 9:00 AM - 6:00 PM EST</li>
              <li className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Development Host Sandbox • Verification System Activated
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Zrolodex.live. All rights reserved. Registered business database index provider.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition">Opt-Out Request</a>
          </div>
        </div>
      </footer>

      {/* Interactive Guided Tour Overlay */}
      <AnimatePresence>
        {tourActive && (
          <GuidedTour 
            onClose={handleCloseTour} 
            onSelectPage={setCurrentPage} 
            onFinishSetup={handleFinishSetupFromTour}
          />
        )}
      </AnimatePresence>

      {/* Floating Tour Launcher */}
      {currentPage === 'home' && !tourActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.3 }}
          className="fixed bottom-6 left-6 z-[90] hidden sm:block"
        >
          <button
            onClick={() => setTourActive(true)}
            className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition hover:-translate-y-0.5 border border-white/10 cursor-pointer select-none group"
            title="Launch Dashboard Tour"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform duration-250" />
            <span>Interactive Guide</span>
          </button>
        </motion.div>
      )}

    </div>
  );
}

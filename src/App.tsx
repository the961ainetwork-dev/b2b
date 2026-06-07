import React, { useState } from 'react';
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
  Send,
  Sparkles,
  Info,
  Check,
  ChevronDown,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';
import { SERVICES, TESTIMONIALS, FAQS, COMPETITIVE_MATRIX } from './data';
import EstimatorWidget from './components/EstimatorWidget';
import RecordPreview from './components/RecordPreview';
import OutreachGenerator from './components/OutreachGenerator';

export default function App() {
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-700 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-brand-700/20">
              <Target className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 text-lg md:text-xl tracking-tight block">
                Point <span className="text-brand-600">To Business</span>
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider uppercase block -mt-1">
                Services & Lead Core
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#list-estimator" className="hover:text-brand-600 transition">Target Calculator</a>
            <a href="#core-services" className="hover:text-brand-600 transition">Our Services</a>
            <a href="#prospect-explorer" className="hover:text-brand-600 transition">Prospect Explorer</a>
            <a href="#outbound-builder" className="hover:text-brand-600 transition">Message Builder</a>
            <a href="#client-evaluations" className="hover:text-brand-600 transition">Why Choose Us</a>
            <a href="#faq" className="hover:text-brand-600 transition">FAQ</a>
          </nav>

          {/* Desktop Call to Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="mailto:info@pointtobusinessservices.com" 
              className="text-xs font-mono font-bold text-slate-500 hover:text-brand-600 transition flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              info@pointtobusinessservices.com
            </a>
            <button 
              onClick={scrolltoEstimator}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition duration-150 cursor-pointer shadow-md shadow-brand-500/10"
            >
              Get Free Sample
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
            <div className="p-4 space-y-3 font-semibold text-slate-700 text-sm flex flex-col">
              <a href="#list-estimator" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50 hover:text-brand-600 transition">Target Calculator</a>
              <a href="#core-services" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50 hover:text-brand-600 transition">Our Services</a>
              <a href="#prospect-explorer" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50 hover:text-brand-600 transition">Prospect Explorer</a>
              <a href="#outbound-builder" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50 hover:text-brand-600 transition">Message Builder</a>
              <a href="#client-evaluations" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50 hover:text-brand-600 transition">Why Choose Us</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-slate-50 hover:text-brand-600 transition">FAQ</a>
              
              <div className="pt-2 flex flex-col gap-2">
                <a href="mailto:info@pointtobusinessservices.com" className="text-xs text-slate-500 font-mono flex items-center gap-1.5 py-1">
                  <Mail className="w-4 h-4" />
                  info@pointtobusinessservices.com
                </a>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrolltoEstimator();
                  }}
                  className="w-full bg-brand-600 text-white font-semibold py-3 text-center rounded-xl cursor-pointer"
                >
                  Get Free Core Sample
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Block */}
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
                  Verified B2B Email Lists & <span className="text-brand-600 relative inline-block">Lead Generation</span>
                </h1>
                <p className="text-slate-500 text-base md:text-lg max-w-xl leading-relaxed">
                  Power your outbound outreach with triple-verified contact data for decision makers. Enjoy 95%+ guaranteed deliverability on every list built specifically to your sector since 2014.
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
                    "Every lead we source goes through the Point double-blind validation loop."
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Interactive Segment: EstimatorWidget */}
      <section className="py-12 md:py-20 bg-white border-t border-b border-slate-100" id="calculator-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-3">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100">
              Pricing Calculator
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Instant Database Match & Pricing Estimate
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              Establish your parameters below. Our database index counts will calculate matches instantly, letting you request custom samples with zero obligations.
            </p>
          </div>

          <EstimatorWidget />

        </div>
      </section>

      {/* Core B2B Services Suite */}
      <section className="py-16 md:py-24 bg-slate-50/70" id="core-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-3">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-100">
              Services Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              End-to-End B2B Data & Marketing Services
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              From fresh databases to complete client appointment acquisition. We cover every node of your sales outreach efforts.
            </p>
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

      {/* Prospect Explorer Section */}
      <section className="py-16 md:py-24 bg-white border-t border-b border-slate-100" id="prospect-explorer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-teal-100">
              Database Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Inspect Our B2B Database Record Fields
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              Every profile delivered is packed with direct dials, verified company demographics, and verified email keys. Review actual format examples below.
            </p>
          </div>

          <RecordPreview onTriggerSample={scrolltoEstimator} />

        </div>
      </section>

      {/* Live Messaging Outreach builder */}
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
                Instantly Generate Sales Sequences
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect the data you acquire directly to relevant outreach messaging models. Pick your core sales channel and objectives to copy pre-optimized frameworks instantly.
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

      {/* 4 Steps Timeline Flow */}
      <section className="py-16 md:py-24 bg-white" id="workflow-steps">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-3">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100">
              Work Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              From Custom Request to Campaign Success in 4 Steps
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              A streamlined verification loop guarantees that you never waste outbound marketing budget on bounced email keys.
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

      {/* Grid Comparison Section */}
      <section className="py-16 md:py-24 bg-slate-50" id="competitive-matrix">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Point to Business Services vs. Standard Data Providers
            </h2>
            <p className="text-slate-500 text-sm">
              Why 2000+ top enterprises choose Point. Clean verification processes provide stellar delivery.
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

      {/* Client Evaluations */}
      <section className="py-16 md:py-24 bg-white" id="client-evaluations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-100">
              User Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Trusted by 2,000+ Global Marketing Teams
            </h2>
            <p className="text-slate-550 text-slate-500 text-sm">
              See how modern SDRs, demand planners, and agency executives scale up outreach ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test) => (
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

      {/* Accordion FAQ Section */}
      <section className="py-16 md:py-24 bg-slate-50/70" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
            <span className="bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100">
              Got Questions?
            </span>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Still feeling curious about B2B records? We compiled typical client inquiries below.
            </p>
          </div>

          <div className="space-y-3" id="faq-accordions">
            {FAQS.map((faq) => {
              const isOpen = activeFAQ === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFAQ(isOpen ? null : faq.id)}
                    className="w-full text-left py-4.5 px-6 flex items-center justify-between font-semibold font-display text-slate-800 text-sm md:text-base cursor-pointer hover:bg-slate-50/50 transition gap-4"
                  >
                    <span>{faq.question}</span>
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
            })}
          </div>

        </div>
      </section>

      {/* Quote Request Form block */}
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
                    Get a Custom Quote in 24 Hours
                  </h3>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Have very specific target needs? (e.g., HVAC technicians in Germany, Dental clinic administrators in NY). Submit specifications and our engineers will calculate a custom query.
                </p>

                <div className="space-y-3.5 text-xs text-slate-300 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-teal-400" />
                    <span>info@pointtobusinessservices.com</span>
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

      {/* Corporate footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 text-xs">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-brand-700 text-white w-8 h-8 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <span className="font-display font-medium text-white text-lg tracking-tight">
                Point <span className="text-brand-500">To Business</span> Services
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Point to Business Services is a premier global provider of accurate B2B contact lists, lead generation strategy, database auditing, and custom outbound campaigns since 2014.
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
                <span>Email: <a href="mailto:info@pointtobusinessservices.com" className="hover:underline text-white">info@pointtobusinessservices.com</a></span>
              </li>
              <li>Office Hours: Mon-Fri | 9:00 AM - 6:00 PM EST</li>
              <li className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Development Host Sandbox • Verification System Activated
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Point to Business Services. All rights reserved. Registered business database index provider.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition">Opt-Out Request</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  UserCheck, 
  Sliders, 
  Download, 
  Filter, 
  ArrowRight, 
  Layers, 
  Percent, 
  DollarSign, 
  BadgeCheck, 
  Loader2, 
  Mail, 
  FileSpreadsheet,
  CheckCircle,
  X,
  AlertCircle,
  Check,
  Info
} from 'lucide-react';
import { 
  INDUSTRIES, 
  GEOGRAPHIES, 
  JOB_LEVELS, 
  COMPANY_SIZES, 
  calculateEstimatedContacts,
  MOCK_CONTACTS 
} from '../data';
import { FilterState, ContactRecord } from '../types';

export default function EstimatorWidget() {
  const [filters, setFilters] = useState<FilterState>({
    industry: INDUSTRIES[0],
    geography: GEOGRAPHIES[0],
    jobLevel: JOB_LEVELS[0],
    companySize: COMPANY_SIZES[0]
  });

  const [requestedVolume, setRequestedVolume] = useState<number>(2500);
  const [isRequestingSample, setIsRequestingSample] = useState(false);
  const [sampleEmail, setSampleEmail] = useState('');
  const [sampleName, setSampleName] = useState('');
  const [sampleCompany, setSampleCompany] = useState('');
  const [isBuildingSample, setIsBuildingSample] = useState(false);
  const [sampleStep, setSampleStep] = useState<1 | 2 | 3>(1);
  const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);

  // Real-time Validation States
  const [sampleErrors, setSampleErrors] = useState<Record<string, string>>({});
  const [sampleTouched, setSampleTouched] = useState<Record<string, boolean>>({});

  const validateSampleField = (name: string, value: string) => {
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
        error = 'Please enter a valid business email';
      }
    } else if (name === 'company') {
      if (!value.trim()) {
        error = 'Company name is required';
      } else if (value.trim().length < 2) {
        error = 'Company name must be at least 2 characters';
      }
    }
    setSampleErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSampleFieldChange = (name: string, value: string) => {
    if (name === 'name') setSampleName(value);
    else if (name === 'email') setSampleEmail(value);
    else if (name === 'company') setSampleCompany(value);

    if (sampleTouched[name]) {
      validateSampleField(name, value);
    }
  };

  const handleSampleFieldBlur = (name: string, value: string) => {
    setSampleTouched(prev => ({ ...prev, [name]: true }));
    validateSampleField(name, value);
  };

  const getSampleInputClass = (fieldName: string, baseClass = "") => {
    const isTouched = sampleTouched[fieldName];
    const error = sampleErrors[fieldName];
    
    if (!isTouched) {
      return `${baseClass} border-slate-200 focus:ring-brand-500/20 focus:border-brand-500`;
    }
    if (error) {
      return `${baseClass} border-red-500 ring-2 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500 bg-red-50/10`;
    }
    return `${baseClass} border-emerald-500 ring-1 ring-emerald-500/5 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/5`;
  };

  // Re-calculate basic pool size based on selected criteria
  const { totalCount, pricing: basePricing } = calculateEstimatedContacts(
    filters.industry,
    filters.geography,
    filters.jobLevel,
    filters.companySize
  );

  // Cap requested volume by total count available
  const maxVolume = Math.min(totalCount, 50000);
  const currentVolume = Math.min(requestedVolume, maxVolume);

  useEffect(() => {
    if (requestedVolume > maxVolume) {
      setRequestedVolume(Math.max(100, Math.floor(maxVolume * 0.6)));
    }
  }, [maxVolume]);

  // Pricing structure: higher volume = bulk discounts per contact
  const getPerLeadPrice = (volume: number) => {
    if (volume < 500) return 0.35;
    if (volume < 2000) return 0.28;
    if (volume < 10000) return 0.22;
    return 0.16;
  };

  const perLeadPrice = getPerLeadPrice(currentVolume);
  const calculatedCost = Math.round(currentVolume * perLeadPrice);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const startSampleRequest = () => {
    setIsRequestingSample(true);
    setSampleStep(1);
    setSampleErrors({});
    setSampleTouched({});
  };

  const handleRequestSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameErr = !sampleName.trim() ? 'Your name is required' : sampleName.trim().length < 2 ? 'Name must be at least 2 characters' : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailErr = !sampleEmail.trim() ? 'Business email is required' : !emailRegex.test(sampleEmail.trim()) ? 'Please enter a valid business email' : '';
    const companyErr = !sampleCompany.trim() ? 'Company name is required' : sampleCompany.trim().length < 2 ? 'Company name must be at least 2 characters' : '';

    const newErrors = {
      name: nameErr,
      email: emailErr,
      company: companyErr
    };

    setSampleErrors(newErrors);
    setSampleTouched({
      name: true,
      email: true,
      company: true
    });

    if (nameErr || emailErr || companyErr) {
      return;
    }

    setSampleStep(2);
    setIsBuildingSample(true);

    // Simulate database building workflow
    setTimeout(() => {
      setIsBuildingSample(false);
      setSampleStep(3);
    }, 2800);
  };

  // Compile a mock CSV file of 25 matched leads for instant download
  const handleDownloadCSV = () => {
    if (isDownloadingCSV) return;
    setIsDownloadingCSV(true);

    setTimeout(() => {
      // Generate filtered samples or general ones
      const matches = MOCK_CONTACTS.map((c, i) => ({
        ...c,
        industry: filters.industry,
        country: filters.geography.split(' ')[0],
        title: filters.jobLevel.split(' ')[0] + ' ' + c.title.split(' ').slice(1).join(' '),
        email: `${c.firstName.toLowerCase()}.${c.lastName.toLowerCase()}@${c.company.toLowerCase().replace(/[^a-z]/g, '') || 'b2bmatched'}.com`
      }));

      const csvHeaders = ['First Name', 'Last Name', 'Job Title', 'Business Email', 'Direct Phone', 'Company Name', 'Size', 'Country', 'Industry', 'LinkedIn Profile', 'Deliverability Status'];
      const csvRows = matches.map(m => [
        m.firstName,
        m.lastName,
        m.title,
        m.email,
        m.phone,
        m.company,
        m.size.split(' ')[0],
        m.country,
        m.industry,
        m.linkedin,
        m.verifiedStatus
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [csvHeaders.join(','), ...csvRows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      const filename = `zrolodex_b2b_leads_sample_${filters.industry.toLowerCase().replace(/\s+/g, '_')}.csv`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloadingCSV(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-100/70 overflow-hidden" id="list-estimator">
      
      {/* Widget Header Banner */}
      <div className="bg-brand-900 text-white px-6 py-8 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="bg-brand-800 text-teal-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-700/50">
              Interactive Tools
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight mt-3">
              Live Database Estimator
            </h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Configure your criteria in real-time to preview available targets, calculate bulk rate pricing, and retrieve immediate accuracy levels.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-brand-950 px-4 py-3 rounded-2xl border border-brand-800 self-start md:self-auto">
            <BadgeCheck className="text-teal-400 w-5 h-5 flex-shrink-0" />
            <div className="text-xs">
              <p className="text-slate-400">Database Integrity</p>
              <p className="text-teal-300 font-semibold font-mono">95%+ Triple-Verified</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
        {/* Left Side: Filter Panel */}
        <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Filter className="text-brand-600 w-5 h-5" />
            <h4 className="font-display font-semibold text-slate-800">1. Adjust Targeting Demographics</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Industry Filter */}
            <div className="space-y-1.5" id="filter-industry">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Industry Vertical
              </label>
              <div className="relative">
                <select
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Geography Filter */}
            <div className="space-y-1.5" id="filter-geography">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Target Region
              </label>
              <div className="relative">
                <select
                  value={filters.geography}
                  onChange={(e) => handleFilterChange('geography', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer"
                >
                  {GEOGRAPHIES.map((geo) => (
                    <option key={geo} value={geo}>{geo}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Job Level Filter */}
            <div className="space-y-1.5" id="filter-job-level">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                Management Level
              </label>
              <div className="relative">
                <select
                  value={filters.jobLevel}
                  onChange={(e) => handleFilterChange('jobLevel', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer"
                >
                  {JOB_LEVELS.map((job) => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Company Size Filter */}
            <div className="space-y-1.5" id="filter-company-size">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                Company Size Tier
              </label>
              <div className="relative">
                <select
                  value={filters.companySize}
                  onChange={(e) => handleFilterChange('companySize', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer"
                >
                  {COMPANY_SIZES.map((sz) => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

          </div>

          {/* Volume Specification Slider */}
          <div className="space-y-4 pt-6 border-t border-slate-50" id="volume-slider">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="font-semibold text-sm text-slate-800">Data Acquisition Volume</h5>
                <p className="text-slate-400 text-xs mt-0.5">Specify your requested contact quantity</p>
              </div>
              <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-lg text-sm font-bold font-mono">
                {currentVolume.toLocaleString()} Contacts
              </span>
            </div>

            <input
              type="range"
              min={100}
              max={maxVolume}
              step={100}
              value={currentVolume}
              onChange={(e) => setRequestedVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />

            <div className="flex justify-between text-[11px] font-semibold text-slate-400 font-mono">
              <span>Min: 100</span>
              <span>Available Pool Capacity: {totalCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Value scale discount table */}
          <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-4 gap-2 text-center text-xs divide-x divide-slate-200/60 border border-slate-100">
            <div>
              <p className="text-slate-400 font-medium">Vol: &lt;500</p>
              <p className="text-slate-700 font-mono font-bold mt-1">$0.35 / lead</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Vol: 500-2K</p>
              <p className="text-slate-700 font-mono font-bold mt-1">$0.28 / lead</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Vol: 2K-10K</p>
              <p className="text-brand-600 font-mono font-bold mt-1">$0.22 / lead</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Vol: 10K+</p>
              <p className="text-emerald-600 font-mono font-bold mt-1">$0.16 / lead</p>
            </div>
          </div>
        </div>

        {/* Right Side: Direct Calculation & Output Results Drawer */}
        <div className="lg:col-span-5 p-6 md:p-8 bg-slate-50/70 flex flex-col justify-between gap-6">
          <div className="space-y-6">
            <h4 className="font-display font-semibold text-slate-800 pb-4 border-b border-slate-100 flex items-center gap-2">
              <Layers className="text-brand-600 w-5 h-5" />
              2. Instant Analytics & Cost
            </h4>

            {/* Huge Database Metrics display */}
            <div className="space-y-4">
              
              {/* Metric 1: Total Match Database Pool */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between" id="metric-total-active">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matched Contact Pool</p>
                  <p className="text-slate-450 text-[11px] mt-0.5">Verified entries in immediate region</p>
                </div>
                <div className="text-right">
                  <motion.p 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-display font-bold text-slate-800 font-mono"
                  >
                    {totalCount.toLocaleString()}
                  </motion.p>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                    Live Match
                  </span>
                </div>
              </div>

              {/* Metric 2: Estimated List Pricing */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between" id="metric-price">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dynamic Cost Estimator</p>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block font-mono">
                    ${perLeadPrice.toFixed(2)} cost per record
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-display font-bold text-brand-700 font-mono flex items-center justify-end">
                    <DollarSign className="w-5 h-5 text-brand-600 mr-0.5" />
                    {calculatedCost.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400 italic">One-time payment, no recuring fee</span>
                </div>
              </div>

              {/* Metric 3: Deliverability Benchmark */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between" id="metric-deliverability">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Guaranteed Deliverability</p>
                  <p className="text-slate-400 text-xs mt-0.5">Real-time SMTP handshake verify</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-display font-bold text-teal-600 font-mono">95%+</p>
                  <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
                    SLA Protected
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Dual Action Buttons */}
          <div className="space-y-3 pt-4">
            <button 
              onClick={startSampleRequest}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-900/10"
              id="btn-get-sample"
            >
              <Download className="w-4 h-4" />
              Request 25 Free Target Leads
            </button>
            <a 
              href="#contact-section"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              id="btn-buy-list"
            >
              Get Custom Quote & Delivery
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

      {/* Slide overlay for Free Sample Request modal with live generation */}
      <AnimatePresence>
        {isRequestingSample && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setIsRequestingSample(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>

              {sampleStep === 1 && (
                <form onSubmit={handleRequestSampleSubmit} className="p-6 md:p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="bg-brand-50 w-12 h-12 rounded-xl flex items-center justify-center text-brand-600">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-slate-800">
                      Download 25 Free Customized Leads
                    </h3>
                    <p className="text-slate-500 text-xs">
                      We will compile 25 true contact profiles aligning with: <strong className="text-brand-700">{filters.industry}</strong>, located in <strong className="text-brand-700">{filters.geography.split(' ')[0]}</strong> matching <strong className="text-brand-700">{filters.jobLevel.split(' ')[0]}</strong> roles.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={sampleName}
                        onChange={(e) => handleSampleFieldChange('name', e.target.value)}
                        onBlur={(e) => handleSampleFieldBlur('name', e.target.value)}
                        placeholder="John Doe"
                        className={getSampleInputClass('name', 'w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200')}
                      />
                      {sampleTouched.name && sampleErrors.name ? (
                        <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1 font-sans">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {sampleErrors.name}
                        </p>
                      ) : sampleTouched.name && !sampleErrors.name && sampleName ? (
                        <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1 font-sans">
                          <Check className="w-3.5 h-3.5 flex-shrink-0" />
                          Full name verified
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Business Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={sampleEmail}
                        onChange={(e) => handleSampleFieldChange('email', e.target.value)}
                        onBlur={(e) => handleSampleFieldBlur('email', e.target.value)}
                        placeholder="john@yourcompany.com"
                        className={getSampleInputClass('email', 'w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200')}
                      />
                      {sampleTouched.email && sampleErrors.email ? (
                        <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1 font-sans">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {sampleErrors.email}
                        </p>
                      ) : sampleTouched.email && !sampleErrors.email && sampleEmail ? (
                        /@(gmail|yahoo|hotmail|outlook|aol|live|msn|icloud|mail)\.com$/i.test(sampleEmail) ? (
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

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Company Name</label>
                      <input 
                        type="text" 
                        required
                        value={sampleCompany}
                        onChange={(e) => handleSampleFieldChange('company', e.target.value)}
                        onBlur={(e) => handleSampleFieldBlur('company', e.target.value)}
                        placeholder="SalesFlow Inc"
                        className={getSampleInputClass('company', 'w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200')}
                      />
                      {sampleTouched.company && sampleErrors.company ? (
                        <p className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-1 font-sans">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {sampleErrors.company}
                        </p>
                      ) : sampleTouched.company && !sampleErrors.company && sampleCompany ? (
                        <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1 font-sans">
                          <Check className="w-3.5 h-3.5 flex-shrink-0" />
                          Company mapped for verification routing
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
                  >
                    Build Custom Core Sample
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {sampleStep === 2 && (
                <div className="p-8 text-center space-y-6 py-12">
                  <div className="relative inline-block">
                    <Loader2 className="w-16 h-16 text-brand-600 animate-spin mx-auto" />
                    <FileSpreadsheet className="w-6 h-6 text-brand-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-bold text-lg text-slate-800">Connecting to B2B Filter Core...</h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Matching real-time targets for "{filters.industry}" targeting "{filters.jobLevel.split(' ')[0]}" levels...
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 max-w-xs mx-auto text-left space-y-2 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">SMTP Handshake Verification:</span>
                      <span className="text-emerald-600 font-bold">Passed</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">DNS Records Match Check:</span>
                      <span className="text-emerald-600 font-bold">Passed</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Deduplication Core Filter:</span>
                      <span className="text-brand-600 font-bold">100% OK</span>
                    </div>
                  </div>
                </div>
              )}

              {sampleStep === 3 && (
                <div className="p-8 text-center space-y-6 py-12">
                  <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-emerald-500 border-2 border-emerald-100">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-bold text-xl text-slate-800">Your custom file is ready!</h4>
                    <p className="text-slate-500 text-xs max-w-md mx-auto">
                      Hi {sampleName}, we matched 25 triple-verified active executives matching your custom Ideal Customer Profile. Download the spreadsheet below to test deliverables.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 max-w-md mx-auto space-y-2 text-xs text-left">
                    <p className="text-slate-600 font-medium">Included Segment Specs:</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-500 font-mono leading-relaxed list-disc list-inside">
                      <li>Industry: {filters.industry.slice(0, 16)}...</li>
                      <li>Job Level: {filters.jobLevel.split(' ')[0]}</li>
                      <li>Emails: SMTP Active</li>
                      <li>Phones: Verified Active</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto pt-4">
                    <button
                      onClick={handleDownloadCSV}
                      disabled={isDownloadingCSV}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-emerald-600/10"
                    >
                      {isDownloadingCSV ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Preparing CSV...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download CSV Sample
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsRequestingSample(false)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition duration-150 cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

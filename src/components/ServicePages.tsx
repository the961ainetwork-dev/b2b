import React, { useState } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  ArrowLeft,
  ArrowRight,
  Database,
  Mail,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  ListTodo,
  FileSpreadsheet,
  Users,
  Search,
  Check,
  Send,
  Sliders,
  Play,
  FileCheck,
  Zap,
  Download,
  Terminal,
  Layers,
  ChevronRight,
  Calendar,
  MousePointerClick,
  FileText,
  BadgeAlert,
  SlidersHorizontal,
  HelpCircle,
  Copy,
  Plus
} from 'lucide-react';

interface ServicePagesProps {
  initialTab?: 'srv-1' | 'srv-2' | 'srv-3' | 'srv-4' | 'get-started';
  onBackToHome: () => void;
}

export default function ServicePages({ initialTab = 'srv-1', onBackToHome }: ServicePagesProps) {
  const [activeTab, setActiveTab] = useState<'srv-1' | 'srv-2' | 'srv-3' | 'srv-4' | 'get-started'>(initialTab);

  // Core Service 1 (Email database Builder) States & Demo Data
  const [srv1Industry, setSrv1Industry] = useState('Technology & SaaS');
  const [srv1Role, setSrv1Role] = useState('VPs & Directors');
  const [srv1Region, setSrv1Region] = useState('North America');
  const [srv1Running, setSrv1Running] = useState(false);
  const [srv1Results, setSrv1Results] = useState<any[] | null>(null);

  // Core Service 2 (Outbound Copywriter) States
  const [srv2Goal, setSrv2Goal] = useState('Product Demo Booking');
  const [srv2Niche, setSrv2Niche] = useState('Automated Logistics Software');
  const [srv2Running, setSrv2Running] = useState(false);
  const [srv2ActiveStep, setSrv2ActiveStep] = useState(1);
  const [srv2Sequence, setSrv2Sequence] = useState<any | null>(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Core Service 3 (Appeinding Tools) States
  const [srv3RawInput, setSrv3RawInput] = useState('Jessica, Product lead at Shopify, Toronto');
  const [srv3Running, setSrv3Running] = useState(false);
  const [srv3Result, setSrv3Result] = useState<any | null>(null);

  // Core Service 4 (Event Promotion) States
  const [srv4Type, setSrv4Type] = useState('Virtual Technical Webinar');
  const [srv4Audience, setSrv4Audience] = useState(250);
  const [srv4Cost, setSrv4Cost] = useState(2500);
  const [srv4Running, setSrv4Running] = useState(false);
  const [srv4Estimate, setSrv4Estimate] = useState<any | null>(null);

  // Get Started Sequence Stepper States
  const [gsStep, setGsStep] = useState(1);
  const [gsGoals, setGsGoals] = useState<string[]>([]);
  const [gsSelectedIndustry, setGsSelectedIndustry] = useState('Technology & SaaS');
  const [gsContactName, setGsContactName] = useState('');
  const [gsContactEmail, setGsContactEmail] = useState('');
  const [gsContactRequirements, setGsContactRequirements] = useState('');
  const [gsDemoLoading, setGsDemoLoading] = useState(false);
  const [gsDemoRan, setGsDemoRan] = useState(false);
  const [gsDemoOutput, setGsDemoOutput] = useState<any[] | null>(null);
  const [gsSubmitted, setGsSubmitted] = useState(false);

  // List of pre-filled Appending Records
  const appendSamples = [
    { label: 'Shopify Product Lead (Toronto)', query: 'Jessica, Product lead at Shopify, Toronto' },
    { label: 'Cochran Gen Partner (Construction/NY)', query: 'Arthur Cochran, GP at Cochran General Building, NY' },
    { label: 'VP Marketing, Apex Health (London)', query: 'Priya Patel, VP of Marketing, Apex Health, London UK' }
  ];

  // Run Service 1 Lead Match Logic
  const handleSrv1Run = (e: React.FormEvent) => {
    e.preventDefault();
    setSrv1Running(true);
    setSrv1Results(null);

    setTimeout(() => {
      // Simulate highly customized matches based on inputs
      const matches = [
        { name: `${srv1Role.startsWith('C-') ? 'Chief' : 'VP'} Alex Vance`, company: `Summit ${srv1Industry.replace(/ &.*/, '')} Solutions`, email: `alex.vance@summit${srv1Industry.toLowerCase().replace(/[^a-z]/g, '') || 'b2b'}.com`, phone: '+1 (415) 309-8812', title: srv1Role.split(' ')[0] + ' Operations', certValue: '99.4%', location: srv1Region === 'North America' ? 'San Francisco, USA' : 'London, UK' },
        { name: 'Marcus Sterling', company: 'Integra Group', email: `marcus@integracorp.${srv1Region === 'Western Europe' ? 'de' : 'com'}`, phone: '+1 (212) 555-0199', title: srv1Role.split(' ')[0] + ' Strategy', certValue: '98.9%', location: srv1Region === 'North America' ? 'New York, USA' : 'Frankfurt, GER' },
        { name: 'Diana Rostova', company: 'Monolith Global', email: `d.rostova@monolith-global.${srv1Region === 'Western Europe' ? 'fr' : 'com'}`, phone: '+1 (415) 555-5201', title: srv1Role.split(' ')[0] + ' Sourcing', certValue: '99.1%', location: srv1Region === 'North America' ? 'Toronto, Canada' : 'Paris, FRA' },
        { name: 'Kenji Tanaka', company: 'Nexus Digital', email: `tanaka.k@nexus-digital.io`, phone: '+81 3 5555 1092', title: srv1Role.split(' ')[0] + ' Operations', certValue: '98.5%', location: 'Tokyo, JAP' }
      ];
      setSrv1Results(matches);
      setSrv1Running(false);
    }, 1500);
  };

  // Run Service 2 Outreach sequence writer
  const handleSrv2Run = (e: React.FormEvent) => {
    e.preventDefault();
    setSrv2Running(true);
    setSrv2Sequence(null);

    setTimeout(() => {
      let subject = '';
      let email1 = '';
      let email2 = '';

      if (srv2Goal.includes('Demo')) {
        subject = `Fixing outbound efficiency bottlenecks / ${srv2Niche || 'Your Agency'}`;
        email1 = `Hi {{First Name}},\n\nSaw that your team is pushing heavily into business development at {{Company Name}}. Most leaders I speak with in that seat are frustrated of spending hours checking disconnected cold numbers.\n\nOur specialized ${srv2Niche || 'customized engines'} helps bypass unverified profiles to boost targeted meeting-booking rates by up to 2x.\n\nDo you have 10 minutes next Tuesday at 2:00 PM to evaluate a brief performance sandbox?\n\nBest,\nYour Team`;
        email2 = `Hi {{First Name}},\n\nWanted to follow up on this briefly with a checklist. We recently helped SynergyFlow secure a customized index of 5,000 triple-verified leads in under 48 hours—yielding an incredible 2.2% bounce rate.\n\nShould I send over a quick 25-contact custom list focused specifically on your targets to test?\n\nBest,\nYour Team`;
      } else if (srv2Goal.includes('Booking')) {
        subject = `Intro: Streamlining pipeline acquisition for ${srv2Niche || 'Your Firm'}`;
        email1 = `Hi {{First Name}},\n\nI was reviewing {{Company Name}} and noticed your focus on scaling client acquisition pipelines. \n\nWe provide high-integrity, triple-verified lists mapped specifically to your exact customer archetype (VPs, CFOs, Heads of Tech) with direct cell indicators. This trims average sales development cycles by up to 30%.\n\nAre you available for a brief conversational sync this week?\n\nBest,\nYour Team`;
        email2 = `Hi {{First Name}},\n\nQuick bump here. I know you're busy running operations. If it makes it easier, you can try out our live index calculator at zrolodex.live to scope the exact contact count for your sector.\n\nLet me know if you would like me to compile a draft set.\n\nBest,\nYour Team`;
      } else {
        subject = `Collaborative partnership query: ${srv2Niche || 'Zrolodex integrations'}`;
        email1 = `Hi {{First Name}},\n\nI hope this finds you well. I was impressed by {{Company Name}}'s growth footprint in your sector.\n\nI lead partnership channels here. We help firms map, enrich, and continuously append active customer data with our native CRM webhook integrations.\n\nWould you be open to a quiet introductory scope to see where our databases align?\n\nBest,\nYour Team`;
        email2 = `Hi {{First Name}},\n\nFollowing up to see if there is any interest. We currently map full-scale native pipelines into HubSpot, Salesforce, and Pipedrive with 1-click field mapping.\n\nHappy to demo our schema mapping if you have 8 minutes.\n\nBest,\nYour Team`;
      }

      setSrv2Sequence({
        subject,
        emails: [email1, email2],
        channel: 'Corporate Business Email'
      });
      setSrv2Running(false);
      setSrv2ActiveStep(1);
    }, 1300);
  };

  const copySequenceToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  // Run Service 3 Append Data matching
  const handleSrv3Run = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srv3RawInput.trim()) return;
    setSrv3Running(true);
    setSrv3Result(null);

    setTimeout(() => {
      // Analyze input keywords or provide seed defaults
      const text = srv3RawInput.toLowerCase();
      let firstName = 'Jessica';
      let lastName = 'McClure';
      let company = 'Shopify Inc.';
      let email = 'j.mcclure@shopify.com';
      let title = 'Product Operations Lead';
      let phone = '+1 (416) 555-0182';
      let domain = 'Toronto, Canada';
      let size = '500+ Employees';
      let verifiedStatus = '99.4% Verified';
      let linkedin = 'linkedin.com/in/jessica-mcclure-product';

      if (text.includes('cochran') || text.includes('arthur')) {
        firstName = 'Arthur';
        lastName = 'Cochran';
        company = 'Cochran Custom General Building';
        email = 'arthur.cochran@cochranbuild.com';
        title = 'Managing General Partner';
        phone = '+1 (212) 555-9002';
        domain = 'New York, USA';
        size = '11 - 50 Employees';
        verifiedStatus = '97.6% Verified';
        linkedin = 'N/A';
      } else if (text.includes('priya') || text.includes('apex') || text.includes('health')) {
        firstName = 'Priya';
        lastName = 'Patel';
        company = 'Apex Health Global Ltd';
        email = 'p.patel@apexhealth.co.uk';
        title = 'VP of Communications & Growth';
        phone = '+44 20 7946 0399';
        domain = 'London, UK';
        size = '201 - 500 Employees';
        verifiedStatus = '98.9% Verified';
        linkedin = 'linkedin.com/in/priya-patel-health';
      } else if (srv3RawInput.trim().includes(',')) {
        const parts = srv3RawInput.split(',');
        firstName = parts[0].trim().split(' ')[0] || 'Target';
        lastName = parts[0].trim().split(' ').slice(1).join(' ') || 'Prospect';
        title = parts[1]?.trim() || 'Executive Associate';
        company = parts[2]?.trim() || 'Dynamic Corporates';
        domain = parts[3]?.trim() || 'Global Markets';
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase() || 'leads'}@${company.toLowerCase().replace(/[^a-z]/g, '') || 'b2b-domain'}.com`;
        phone = '+1 (212) 555-8833';
        verifiedStatus = '96.2% Autogenerated & Calibrated';
        linkedin = `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
      }

      setSrv3Result({
        firstName, lastName, company, email, title, phone, domain, size, verifiedStatus, linkedin
      });
      setSrv3Running(false);
    }, 1400);
  };

  // Run Service 4 Event prediction ROI
  const handleSrv4Run = (e: React.FormEvent) => {
    e.preventDefault();
    setSrv4Running(true);
    setSrv4Estimate(null);

    setTimeout(() => {
      const multiplicationFactor = srv4Type.includes('Virtual') ? 3.5 : 1.4;
      const totalInvitations = Math.floor(srv4Audience * 18);
      const deliveryGuaranteed = Math.floor(totalInvitations * 0.95);
      const emailOpens = Math.floor(deliveryGuaranteed * 0.44);
      const initialLeadsRegistered = srv4Audience;
      const expectedAttendance = Math.floor(srv4Audience * (srv4Type.includes('Virtual') ? 0.45 : 0.78));
      const costPerAttendee = Math.floor(srv4Cost / expectedAttendance);
      const pipelineOpportunity = expectedAttendance * 2100;

      setSrv4Estimate({
        totalInvitations,
        deliveryGuaranteed,
        emailOpens,
        initialLeadsRegistered,
        expectedAttendance,
        costPerAttendee,
        pipelineOpportunity
      });
      setSrv4Running(false);
    }, 1200);
  };

  // Run Get Started matching step
  const handleGsDemoRun = () => {
    setGsDemoLoading(true);
    setGsDemoRan(false);

    setTimeout(() => {
      const output = [
        { name: 'Charles Whitmore', company: `Quantum ${gsSelectedIndustry.split(' ')[0]}`, email: `c.whitmore@quantum${gsSelectedIndustry.toLowerCase().split(' ')[0]}.com`, title: 'Chief Operations Officer', deliverability: '99.5%' },
        { name: 'Elena Korolyova', company: 'Pinnacle Systems Ltd', email: 'elena.k@pinnaclesystems.ca', title: 'VP Growth & Business Sourcing', deliverability: '98.8%' },
        { name: 'Devon Caldwell', company: 'Omni Retail Group', email: 'd.caldwell@omniretail.org', title: 'Head of Strategic Procurement', deliverability: '97.9%' }
      ];
      setGsDemoOutput(output);
      setGsDemoLoading(false);
      setGsDemoRan(true);
    }, 1600);
  };

  // Submit Get Started final contact parameters
  const handleGsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gsContactName.trim() || !gsContactEmail.trim()) return;
    setGsSubmitted(true);
  };

  // Toggle selection lists for Get Started Goals
  const toggleGsGoal = (goal: string) => {
    if (gsGoals.includes(goal)) {
      setGsGoals(gsGoals.filter(g => g !== goal));
    } else {
      setGsGoals([...gsGoals, goal]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="services-subview-panel">
      
      {/* Upper Navigation Rail */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6 mb-8">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-brand-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to main landing
        </button>

        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/50 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('srv-1')}
            className={`flex-1 md:flex-none text-xs px-3.5 py-2 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'srv-1' 
                ? 'bg-white text-brand-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email Lists Build
          </button>
          <button
            onClick={() => setActiveTab('srv-2')}
            className={`flex-1 md:flex-none text-xs px-3.5 py-2 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'srv-2' 
                ? 'bg-white text-brand-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Outbound Copywriter
          </button>
          <button
            onClick={() => setActiveTab('srv-3')}
            className={`flex-1 md:flex-none text-xs px-3.5 py-2 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'srv-3' 
                ? 'bg-white text-brand-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Appending
          </button>
          <button
            onClick={() => setActiveTab('srv-4')}
            className={`flex-1 md:flex-none text-xs px-3.5 py-2 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'srv-4' 
                ? 'bg-white text-brand-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Event Promotion
          </button>
          <button
            onClick={() => {
              setActiveTab('get-started');
              setGsStep(1);
              setGsSubmitted(false);
            }}
            className={`flex-1 md:flex-none text-xs px-4 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'get-started' 
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/10' 
                : 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Get Started Page
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ================= SERVICE 1 ================= */}
        {activeTab === 'srv-1' && (
          <motion.div
            key="srv-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Informational Context (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="bg-brand-50 text-brand-700 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100 shadow-sm">
                Primary Database Sourcing
              </span>
              <h2 className="text-3xl font-display font-medium text-slate-900 tracking-tight leading-tight">
                B2B Email List &amp; Custom Database Builder
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Unlock triple-verified corporate databases customized to your exact customer parameters. Skip generic spreadsheets that bounce; configure highly specific demographic selectors and get instant CRM-ready arrays.
              </p>

              <div className="space-y-3.5 bg-slate-100/70 p-5 rounded-2xl border border-slate-200/50">
                <h4 className="text-xs font-mono font-black text-slate-700 uppercase tracking-widest">
                  Key Service Standards
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    '95%+ Automanual verified server pings',
                    'Direct dial cellphone index filters',
                    'Corporate LinkedIn matching credentials',
                    'Full support for EU GDPR and CCPA specs'
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/50 text-xs text-blue-700 flex gap-2.5">
                <Sliders className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 animate-pulse" />
                <p>
                  <strong>Sandbox Notice:</strong> Adjust parameters in our live matching filter on the right to simulate target counts and extract sample lead rows instantly.
                </p>
              </div>
            </div>

            {/* Interactive Sandbox Dashboard (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-150/50 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/40 text-brand-600 flex items-center justify-center shadow-sm">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Advanced lead Filter Simulator</h3>
                  <p className="text-[10px] text-slate-500 font-mono">ZROLODEX CORE DATABASE / LIVE B2B QUERY</p>
                </div>
              </div>

              <form onSubmit={handleSrv1Run} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Sector Industry</label>
                  <select
                    value={srv1Industry}
                    onChange={(e) => setSrv1Industry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="Technology & SaaS">Technology &amp; SaaS</option>
                    <option value="Healthcare & Life Sciences">Healthcare &amp; Life Sci</option>
                    <option value="Construction & Engineering">Construction &amp; Eng</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Finance & Banking">Finance &amp; Banking</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Job Hierarchy</label>
                  <select
                    value={srv1Role}
                    onChange={(e) => setSrv1Role(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="C-Suite (CEO/Founder)">C-Suite (CEO/CFO)</option>
                    <option value="VPs & Directors">VPs &amp; Directors</option>
                    <option value="Heads & Managers">Heads &amp; Managers</option>
                    <option value="Engineering Leaders">Engineering Leaders</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Target Geography</label>
                  <select
                    value={srv1Region}
                    onChange={(e) => setSrv1Region(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="North America">North America (USA)</option>
                    <option value="Western Europe">Western Europe (EU)</option>
                  </select>
                </div>

                <div className="md:col-span-3 pt-2">
                  <button
                    type="submit"
                    disabled={srv1Running}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/15"
                  >
                    {srv1Running ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        Fetching Matching Indices...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                        Run Segment Query Finder
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Output showcase table */}
              <AnimatePresence mode="wait">
                {srv1Results ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 underline decoration-brand-200">
                      <span>Found 4 high-fidelity matching roles</span>
                      <span className="text-emerald-600 font-bold">100% Deliverability Check PASS</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-inner bg-slate-50/50">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 uppercase font-mono font-bold border-b border-secondary-200">
                            <th className="p-3">Prospect</th>
                            <th className="p-3">Corporate Email</th>
                            <th className="p-3">Direct Phone</th>
                            <th className="p-3">Validation Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {srv1Results.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition">
                              <td className="p-3">
                                <span className="font-bold text-slate-850 block">{row.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{row.title} at {row.company}</span>
                              </td>
                              <td className="p-3 font-mono text-slate-700">{row.email}</td>
                              <td className="p-3 text-slate-500">{row.phone}</td>
                              <td className="p-3">
                                <span className="bg-emerald-50 text-emerald-800 text-[95%] border border-emerald-200 font-mono font-bold px-2 py-0.5 rounded-full inline-block">
                                  {row.certValue} Verified
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Simple CSV trigger action */}
                    <button
                      onClick={() => {
                        const csvHeaders = ['Name', 'Company', 'Email', 'Phone', 'Title', 'Location'];
                        const csvRows = srv1Results.map(r => [r.name, r.company, r.email, r.phone, r.title, r.location]);
                        const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders.join(','), ...csvRows.map(e => e.join(','))].join('\n');
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "advanced_leads_builder.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-[10px] px-3.5 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ml-auto shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Matches (CSV)
                    </button>
                  </motion.div>
                ) : (
                  !srv1Running && (
                    <div className="h-44 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-center p-6 space-y-2">
                      <SlidersHorizontal className="w-8 h-8 text-slate-300" />
                      <div>
                        <h5 className="font-semibold text-slate-700 text-xs">Run the Segment Simulator</h5>
                        <p className="text-[10px] max-w-sm">Tweak variables, hit query, and see the triple-verification loop match active leads in real-time.</p>
                      </div>
                    </div>
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ================= SERVICE 2 ================= */}
        {activeTab === 'srv-2' && (
          <motion.div
            key="srv-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Context parameters (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="bg-brand-50 text-brand-700 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100 shadow-sm">
                Outbound Engagement Suite
              </span>
              <h2 className="text-3xl font-display font-medium text-slate-900 tracking-tight leading-tight">
                Outbound Outreach &amp; Lead Generation
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect directly with premium decision-makers. We don't just dump lists; we script custom copywriting flows, manage secondary follow-up sequences, map active triggers, and put hot appointments right into your account calendars.
              </p>

              <div className="space-y-3.5 bg-slate-100/70 p-5 rounded-2xl border border-slate-200/50">
                <h4 className="text-xs font-mono font-black text-slate-700 uppercase tracking-widest">
                  Outbound Delivery Deliverables
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    'Technical mailbox heating and DKIM setup',
                    '2-step automated sequence follow-ups',
                    'High open rates (averaging 42%+ across tech)',
                    'Dedicated SDR manager assigned'
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200/50 text-xs text-orange-850 flex gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5 animate-pulse" />
                <p>
                  <strong>Copywriting Demo:</strong> Generate a customized multi-step outbound prospecting email flow on the right in just 1-click.
                </p>
              </div>
            </div>

            {/* Outreach sandbox (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-150/50 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/40 text-orange-600 flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Copywriting Sequence Generator</h3>
                  <p className="text-[10px] text-slate-500 font-mono">B2B COLD-OUT outreach SCRIPT BUILDER</p>
                </div>
              </div>

              <form onSubmit={handleSrv2Run} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Campaign Strategy Objective</label>
                    <select
                      value={srv2Goal}
                      onChange={(e) => setSrv2Goal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-medium"
                    >
                      <option value="Product Demo Booking">Product Demo Booking</option>
                      <option value="Marketing Call Intros">Marketing Intros</option>
                      <option value="Agency Partnership Query">Partnership Query</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Our Niche Offer / Product</label>
                    <input
                      type="text"
                      value={srv2Niche}
                      onChange={(e) => setSrv2Niche(e.target.value)}
                      placeholder="E.g., Automated Logistics Software"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={srv2Running || !srv2Niche.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/15"
                >
                  {srv2Running ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Structuring Copy Patterns...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      Draft Sequence Emails
                    </>
                  )}
                </button>
              </form>

              {/* Sequence Display terminal casing */}
              <AnimatePresence mode="wait">
                {srv2Sequence ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSrv2ActiveStep(1)}
                          className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md transition cursor-pointer ${
                            srv2ActiveStep === 1 ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Step 1: Introduction
                        </button>
                        <button
                          type="button"
                          onClick={() => setSrv2ActiveStep(2)}
                          className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md transition cursor-pointer ${
                            srv2ActiveStep === 2 ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Step 2: Check-in Bump
                        </button>
                      </div>

                      <button
                        onClick={() => copySequenceToClipboard(srv2ActiveStep === 1 ? srv2Sequence.emails[0] : srv2Sequence.emails[1])}
                        className="text-[10px] font-mono text-brand-600 hover:text-brand-700 flex items-center gap-1.5 font-bold cursor-pointer"
                      >
                        {copiedStatus ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Script
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 shadow-inner">
                      <div className="text-[10px] font-mono text-slate-500 pb-2 border-b border-white/5 space-y-1 mb-3">
                        <p><strong>Channel:</strong> {srv2Sequence.channel}</p>
                        <p><strong>Subject Line:</strong> <span className="text-amber-400 font-bold">"{srv2Sequence.subject}"</span></p>
                      </div>

                      <pre className="text-slate-350 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                        {srv2ActiveStep === 1 ? srv2Sequence.emails[0] : srv2Sequence.emails[1]}
                      </pre>
                    </div>

                    <p className="text-[9.5px] text-slate-400 font-mono text-right italic">
                      *Above placeholders (e.g. &#123;&#123;First Name&#125;&#125;) get automatically populated on list export sync matching.
                    </p>
                  </motion.div>
                ) : (
                  !srv2Running && (
                    <div className="h-44 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-center p-6 space-y-2">
                      <Mail className="w-8 h-8 text-slate-300" />
                      <div>
                        <h5 className="font-semibold text-slate-700 text-xs">Awaiting Strategist Criteria</h5>
                        <p className="text-[10px] max-w-sm">Define objectives, type your niche solution value proposition, and compose a ready sequence.</p>
                      </div>
                    </div>
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ================= SERVICE 3 ================= */}
        {activeTab === 'srv-3' && (
          <motion.div
            key="srv-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Information overview (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="bg-brand-50 text-brand-700 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100 shadow-sm">
                Data Enrichment Suite
              </span>
              <h2 className="text-3xl font-display font-medium text-slate-900 tracking-tight leading-tight">
                Intelligent B2B Data Appending / Enrichment
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Repopulate or wash old CRM directory records. Paste raw or partial business contact files; we append active email addresses, direct desk numbers, updated company scale size indices, and certified locations instantly.
              </p>

              <div className="space-y-3.5 bg-slate-100/70 p-5 rounded-2xl border border-slate-200/50">
                <h4 className="text-xs font-mono font-black text-slate-700 uppercase tracking-widest">
                  Append Scope Parameters
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    'Stale company job profile positions updated',
                    'Direct mobile-only indicator mappings',
                    'Full corporate URLs matched and appended',
                    'Dirty or bad domain prefixes filtered out'
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200/50 text-xs text-purple-850 flex gap-2.5">
                <Terminal className="w-4 h-4 text-purple-500 shrink-0 mt-0.5 animate-pulse" />
                <p>
                  <strong>Enrichment Sandbox:</strong> Try copy-pasting an unstructured contact string or click any prefilled sample on the right.
                </p>
              </div>
            </div>

            {/* Sandbox Appending tools (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-150/50 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/40 text-purple-600 flex items-center justify-center shadow-sm">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Dynamic Enrichment Console</h3>
                  <p className="text-[10px] text-slate-500 font-mono">B2B RECORD APPRECIATOR &amp; ENRICHMENT ENGINE</p>
                </div>
              </div>

              <form onSubmit={handleSrv3Run} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Unstructured / Stale Record Input</label>
                    <span className="text-[9px] font-mono text-slate-400">Can include commas, titles or just names</span>
                  </div>
                  <input
                    type="text"
                    value={srv3RawInput}
                    onChange={(e) => setSrv3RawInput(e.target.value)}
                    placeholder="E.g., Jessica, Product Lead, Shopify, Toronto"
                    className="w-full bg-slate-50 border border-slate-205 border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-mono focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Pre filled tag samples */}
                <div className="space-y-1.5">
                  <span className="text-[9.5px] font-mono text-slate-400 uppercase font-bold block">Or click a predefined template to load:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {appendSamples.map((samp, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setSrv3RawInput(samp.query);
                          setSrv3Result(null);
                        }}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-200/60 px-2.5 py-1.5 rounded-lg font-mono transition cursor-pointer"
                      >
                        + {samp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={srv3Running || !srv3RawInput.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/15"
                >
                  {srv3Running ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Appreciation Engine Calibrating Records...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      Run Record Enrichment
                    </>
                  )}
                </button>
              </form>

              {/* Append outputs display panel */}
              <AnimatePresence mode="wait">
                {srv3Result ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3 pt-2"
                  >
                    <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-500">
                      <span>Appended schema feedback stream:</span>
                      <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-bold border border-purple-100">MATCH FOUND</span>
                    </div>

                    <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Name</span>
                          <span className="font-bold text-slate-800">{srv3Result.firstName} {srv3Result.lastName}</span>
                        </div>
                        <div>
                          <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Role Title</span>
                          <span className="font-bold text-slate-850 text-slate-800">{srv3Result.title}</span>
                        </div>
                        <div>
                          <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Company Account</span>
                          <span className="font-mono font-bold text-slate-700">{srv3Result.company} <span className="text-[10px] text-slate-400">({srv3Result.size})</span></span>
                        </div>
                        <div>
                          <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Appended Business Email</span>
                          <span className="font-mono text-emerald-600 font-black">{srv3Result.email}</span>
                        </div>
                        <div>
                          <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Appended Desk Phone</span>
                          <span className="font-mono text-slate-700 font-bold">{srv3Result.phone}</span>
                        </div>
                        <div>
                          <span className="text-[9.5px] font-mono text-slate-400 uppercase block">Location Region</span>
                          <span className="font-mono text-slate-650">{srv3Result.domain}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
                        <span className="font-mono font-bold text-emerald-600">&#10003; Deliverability accuracy rating: {srv3Result.verifiedStatus}</span>
                        
                        <a
                          href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(srv3Result.firstName + ' ' + srv3Result.lastName + ' ' + srv3Result.company)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10.5px] text-brand-600 font-bold hover:underline flex items-center gap-1 shrink-0"
                        >
                          Verify index on LinkedIn
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  !srv3Running && (
                    <div className="h-44 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-center p-6 space-y-2">
                      <Layers className="w-8 h-8 text-slate-300" />
                      <div>
                        <h5 className="font-semibold text-slate-700 text-xs">Awaiting Inputs</h5>
                        <p className="text-[10px] max-w-sm">Load a predefined template to instantly preview enriched data structures.</p>
                      </div>
                    </div>
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ================= SERVICE 4 ================= */}
        {activeTab === 'srv-4' && (
          <motion.div
            key="srv-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Information overview (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="bg-brand-50 text-brand-700 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-100 shadow-sm">
                Event Demand Sourcing
              </span>
              <h2 className="text-3xl font-display font-medium text-slate-900 tracking-tight leading-tight">
                Event Promotion, Webinar &amp; Seat Filling
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Maximize the attendance and client conversion of your virtual web casts, private trade dinners, custom regional roundtables, and international exhibitions. We build hyper-targeted guest invite files specifically mapped to local executives in adjacent sectors.
              </p>

              <div className="space-y-3.5 bg-slate-100/70 p-5 rounded-2xl border border-slate-200/50">
                <h4 className="text-xs font-mono font-black text-slate-700 uppercase tracking-widest">
                  Event Sourcing Capabilities
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    'Geo-radius audience lookup boundaries',
                    'Specific event invite sequence mapping',
                    'Attendance benchmarks & feedback triggers',
                    'SaaS, clinical healthcare and enterprise audiences'
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/50 text-xs text-teal-850 flex gap-2.5">
                <Calendar className="w-4 h-4 text-teal-500 shrink-0 mt-0.5 animate-pulse" />
                <p>
                  <strong>ROI Predictor:</strong> Supply your desired attendance goals below and evaluate your campaign pacing index in real-time.
                </p>
              </div>
            </div>

            {/* Sandbox Calculator (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-md shadow-slate-150/50 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/40 text-teal-600 flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Attendance ROI Predictor</h3>
                  <p className="text-[10px] text-slate-500 font-mono">B2B EVENT SOURCING PIPELINE ANALYTICS</p>
                </div>
              </div>

              <form onSubmit={handleSrv4Run} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Event Classification</label>
                    <select
                      value={srv4Type}
                      onChange={(e) => setSrv4Type(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-medium"
                    >
                      <option value="Virtual Technical Webinar">Virtual Webinar</option>
                      <option value="Regional Dinner Roundtable">Regional Roundtable</option>
                      <option value="Trade Show Booth Promotion">Trade Show Booth</option>
                      <option value="Annual Enterprise Summit">Exhibition Summit</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Desired Attendees</label>
                    <input
                      type="number"
                      value={srv4Audience}
                      onChange={(e) => setSrv4Audience(Math.max(10, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Outlay Budget ($ USD)</label>
                    <input
                      type="number"
                      value={srv4Cost}
                      onChange={(e) => setSrv4Cost(Math.max(100, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-brand-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={srv4Running}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/15"
                >
                  {srv4Running ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Evaluating Event Conversion Ratios...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                      Evaluate Pacing &amp; Yields
                    </>
                  )}
                </button>
              </form>

              {/* Estimate ROI Output */}
              <AnimatePresence mode="wait">
                {srv4Estimate ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-1.5 border-b border-slate-100">
                      <span>Interactive Sponsoring Yield Metrics</span>
                      <span className="text-teal-600 font-bold">&#10003; Estimated Campaign Validated</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Outbound Targets</span>
                        <span className="text-base font-bold text-slate-800 font-mono">{srv4Estimate.totalInvitations.toLocaleString()} Execs</span>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Opens average (44%)</span>
                        <span className="text-base font-bold text-slate-850 font-mono text-slate-800">{srv4Estimate.emailOpens.toLocaleString()} Opens</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Est Attendance</span>
                        <span className="text-base font-bold text-brand-600 font-mono">{srv4Estimate.expectedAttendance.toLocaleString()} Seats</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Pacing Cost / guest</span>
                        <span className="text-base font-bold text-slate-800 font-mono">${srv4Estimate.costPerAttendee} / attendee</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 md:col-span-2">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Potential Pipeline Sourced (avg order)</span>
                        <span className="text-base font-bold text-emerald-600 font-mono">${srv4Estimate.pipelineOpportunity.toLocaleString()} ARR</span>
                      </div>
                    </div>

                    <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-200/50 text-[10.5px] text-teal-850 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <p>Our promotional squads execute complete sequences across email, LinkedIn and outbound phone calls to secure registrations.</p>
                    </div>
                  </motion.div>
                ) : (
                  !srv4Running && (
                    <div className="h-44 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-center p-6 space-y-2">
                      <Calendar className="w-8 h-8 text-slate-300" />
                      <div>
                        <h5 className="font-semibold text-slate-700 text-xs">Run ROI Predictor Tool</h5>
                        <p className="text-[10px] max-w-sm">Adjust required attendance numbers, budget limits, and event formats to observe pacing speeds.</p>
                      </div>
                    </div>
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ================= GET STARTED ================= */}
        {activeTab === 'get-started' && (
          <motion.div
            key="get-started"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto space-y-8"
          >
            {/* Upper Stepper Progress Banner */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shadow-sm">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] text-brand-600 font-mono font-bold uppercase tracking-wider block">GUIDED SETUP WORKFLOW</span>
                  <h3 className="text-lg font-display font-bold text-slate-850 text-slate-900">Get Started Interactive Tour</h3>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span>Screen progress:</span>
                <span className="text-brand-600">{gsStep} / 6</span>
              </div>
            </div>

            {/* Step Stepper Content render switch */}
            <div className="min-h-[290px] flex flex-col justify-between py-2">
              
              {/* STEP 1: WELCOME & OBJECTIVES */}
              {gsStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-mono text-xs">1</span>
                    Welcome! What are your core outbound targeting goals?
                  </h4>
                  <p className="text-slate-500 text-xs">Select any that apply to calibrate our diagnostic engine algorithms:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                    {[
                      { key: 'leads', title: 'Targeted B2B contact database building', desc: 'Secure direct email, titles and location tags.' },
                      { key: 'outreach', title: 'Cold email sequence curation & bookers', desc: 'Automated follow-ups mapped by experts.' },
                      { key: 'enrich', title: 'CRM data cleaning & verification', desc: 'Breathe new life into stale contact spreadsheets.' },
                      { key: 'event', title: 'Webinar & Roundtable attendance', desc: 'Get localized decision-makers in virtual seats.' }
                    ].map(goal => {
                      const selected = gsGoals.includes(goal.key);
                      return (
                        <button
                          type="button"
                          key={goal.key}
                          onClick={() => toggleGsGoal(goal.key)}
                          className={`text-left p-3.5 rounded-xl border-1 border transition duration-150 cursor-pointer flex items-start gap-3 ${
                            selected ? 'bg-brand-50/50 border-brand-500 ring-1 ring-brand-500/15' : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                            selected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {selected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{goal.title}</span>
                            <span className="text-[10px] text-slate-450 text-slate-500 block leading-tight mt-0.5">{goal.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: EMAIL LISTS BUILDER DEMO */}
              {gsStep === 2 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-mono text-xs">2</span>
                      Service Explainer #1: B2B Email List Custom Builder
                    </h4>
                    <span className="bg-brand-100 text-brand-800 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-brand-200 uppercase self-start sm:self-auto">DEMO PREVIEW</span>
                  </div>
                  
                  <p className="text-slate-500 text-xs">
                    Our dynamic database compiler evaluates demographic layers across 12 countries. Choose an industry below, hit "Generate Demonstration Leads" to watch Zrolodex match active profiles in real-time.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-400 font-bold uppercase block">Target Niche Vertical</label>
                        <select
                          value={gsSelectedIndustry}
                          onChange={(e) => setGsSelectedIndustry(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                        >
                          <option value="Technology & SaaS">Technology &amp; SaaS</option>
                          <option value="Healthcare & Life Sciences">Healthcare &amp; Biotech</option>
                          <option value="HVAC & Energy Services">HVAC &amp; Construction</option>
                          <option value="Finance & Banking">Banking &amp; FinTech</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleGsDemoRun}
                        disabled={gsDemoLoading}
                        className="w-full bg-slate-900 text-white text-[10.5px] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800"
                      >
                        {gsDemoLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Indexing...
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                            Generate Sample Leads
                          </>
                        )}
                      </button>
                    </div>

                    <div className="md:col-span-8 bg-white p-3 rounded-xl border border-slate-200/80 min-h-[140px] flex flex-col justify-center">
                      {gsDemoRan && gsDemoOutput ? (
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono font-bold text-emerald-600 block">&#10003; 3 Matching Leads Sourced</span>
                          <div className="space-y-2 text-[10.5px]">
                            {gsDemoOutput.map((l, i) => (
                              <div key={i} className="flex justify-between items-center bg-slate-50/50 p-1.5 rounded-md border border-slate-100 font-mono">
                                <span className="font-bold text-slate-800">{l.name} <span className="font-normal text-slate-400">({l.title})</span></span>
                                <span className="text-brand-600 text-[10px]">{l.email}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-slate-400 space-y-1 py-4">
                          <Database className="w-6 h-6 text-slate-300 mx-auto" />
                          <p className="text-[10px]">Select sector vertical and click "Generate Sample Leads" above.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: OUTBOUND OUTREACH DEMO */}
              {gsStep === 3 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-mono text-xs">3</span>
                      Service Explainer #2: Outbound Outreach Campaigns
                    </h4>
                    <span className="bg-orange-100 text-orange-850 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-orange-200 uppercase self-start sm:self-auto">OUTBOUND STEPS</span>
                  </div>
                  
                  <p className="text-slate-500 text-xs text-slate-600">
                    We create strategic, high-converting cold outreach sequencers to get localized decision makers in hot sales call cycles.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-205 border-slate-150 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <h5 className="text-[11.5px] font-bold text-slate-800 font-display block uppercase font-mono">Sequence Flow Architecture</h5>
                      <div className="space-y-2">
                        {[
                          { title: 'Step 1: Introduction Script', desc: 'Shorthand, conversational, with quick 10-min Tuesday booking query.' },
                          { title: 'Step 2: Simple Value Check-in', desc: 'Sent 3 days later, highlighting relevant customer metrics and free trial list.' },
                          { title: 'Step 3: LinkedIn Connect Request', desc: 'Direct message mapping to establish immediate professional connection.' }
                        ].map((s, idx) => (
                          <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200/60 leading-tight">
                            <span className="text-[10.5px] font-bold text-slate-800 block">{s.title}</span>
                            <span className="text-[9.5px] text-slate-500 block mt-0.5">{s.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 text-slate-350 p-4 rounded-xl font-mono text-[10.5px] max-w-sm md:w-[300px] border border-slate-800 shrink-0">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold border-b border-white/5 pb-1.5 mb-2 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-orange-400" /> Subject: ROI mapping template query
                      </span>
                      <p className="leading-relaxed">
                        "Hi {"{First Name}"}, <br/><br/>
                        Saw your team was pushing into outbound expansion workflows. I drafted a personalized sample targets sheet customized specifically for {"{Company Name}"}. <br/><br/>
                        Would you be open to an 8-minute sync?"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: DATA APPENDING DEMO */}
              {gsStep === 4 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-mono text-xs">4</span>
                      Service Explainer #3: B2B Data Appending / Enrichment
                    </h4>
                    <span className="bg-purple-100 text-purple-800 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-purple-200 uppercase self-start sm:self-auto">CRM ENRICH</span>
                  </div>
                  
                  <p className="text-slate-500 text-xs">
                    Do you have historical client records with missing emails or older mobile dials? Our appending tools match profiles to active corporate entities to refresh stale files.
                  </p>

                  <div className="border border-dashed border-slate-200 p-4 rounded-xl bg-slate-50/50 space-y-3">
                    <div className="text-[10.5px] font-mono grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-400 font-bold block">YOUR HISTORICAL UNSTRUCTURED RECORD</span>
                        <div className="bg-white p-2.5 rounded-lg border border-red-200 text-slate-600 line-through decoration-red-400">
                          "Rob, Logistics lead at Atlas Heavy Industry, London"
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] text-purple-605 text-purple-600 font-bold block">ZROLODEX RE-CALIBRATED RECORD</span>
                        <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-200 text-slate-800 font-bold space-y-0.5">
                          <p className="text-slate-900 block font-display">Robert Kingsley, Head of Procurement</p>
                          <p className="text-emerald-600 text-[10px] block font-mono">kingsley.m@atlasheavy.co.uk</p>
                          <p className="text-slate-500 text-[9px] block font-normal">+44 20 7946 0192 (Direct Dial)</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-[9.5px] text-slate-400 italic">
                      *We running dual pings to server ports to verify individual seat positions and filter duplicates before lists are downloaded.
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: EVENT PROMOTION DEMO */}
              {gsStep === 5 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-mono text-xs">5</span>
                      Service Explainer #4: Event Seat Promotion Solutions
                    </h4>
                    <span className="bg-teal-100 text-teal-850 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-teal-200 uppercase self-start sm:self-auto">DEMAND</span>
                  </div>
                  
                  <p className="text-slate-500 text-xs">
                    Get high-value directors, operators and buyers in event seats. We run hyper-focused sequencing invitations targeted by location radius to fill trade roundtable and virtual webinars.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1.5">
                    {[
                      { icon: Users, title: 'Attendee Radius Lookups', desc: 'Identify target company accounts within a 30-mile radius of your event venue.' },
                      { icon: Mail, title: 'Dual invitation Sequencing', desc: 'Combine cold invitation templates with professional LinkedIn introduction pings.' },
                      { icon: Calendar, title: 'Webinar conversion pacing', desc: 'Set up customized reminder calendar schedules to boost average turnout rates by 35%.' }
                    ].map((feat, idx) => {
                      const Icon = feat.icon;
                      return (
                        <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shadow-sm shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block font-display">{feat.title}</span>
                            <span className="text-[10px] text-slate-500 block leading-normal mt-0.5">{feat.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 6: SETUP COMPLETE */}
              {gsStep === 6 && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-mono text-xs">&#10003;</span>
                    Setup Configuration Complete! Let's build your plan
                  </h4>
                  <p className="text-slate-500 text-xs">
                    Submit your details below. Our technical demand generation squad will assemble a custom CRM-compatible target prospectus based on your responses and email it immediately.
                  </p>

                  {gsSubmitted ? (
                    <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-sm font-bold">✓</span>
                      <h5 className="font-bold text-slate-850 text-sm">Target Prospectus Requested Successfully!</h5>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">We have logged your preferred goals. A custom 25-contact verified sample list is being compiled and will arrive in your inbox in 15 minutes.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleGsSubmit} className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-lg mx-auto">
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Your Name</label>
                          <input
                            type="text"
                            required
                            value={gsContactName}
                            onChange={(e) => setGsContactName(e.target.value)}
                            placeholder="Alex Sterling"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Business Email</label>
                          <input
                            type="email"
                            required
                            value={gsContactEmail}
                            onChange={(e) => setGsContactEmail(e.target.value)}
                            placeholder="alex@shopify.com"
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono font-bold uppercase block">Describe your target Customer Archetype / Region</label>
                        <textarea
                          rows={2}
                          value={gsContactRequirements}
                          onChange={(e) => setGsContactRequirements(e.target.value)}
                          placeholder="e.g. looking for VPs of Engineering at logistics firms in Western Europe"
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 leading-normal"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition shadow-md shadow-brand-500/10 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Secure Free Custom Prospectus Report
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>

            {/* Stepper Navigation Actions */}
            <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setGsStep(prev => Math.max(1, prev - 1))}
                disabled={gsStep === 1}
                className="text-xs font-mono font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <button
                    key={i}
                    onClick={() => {
                      setGsStep(i);
                      setGsSubmitted(false);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      gsStep === i ? 'bg-brand-600 scale-120' : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              {gsStep === 6 ? (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="bg-slate-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  Exit to Landing
                  <Check className="w-4 h-4 text-emerald-400" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setGsStep(prev => Math.min(6, prev + 1))}
                  className="bg-brand-600 text-white text-xs font-semibold py-2.5 px-5 rounded-xl hover:bg-brand-700 flex items-center gap-1.5 cursor-pointer shadow-md shadow-brand-500/10"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

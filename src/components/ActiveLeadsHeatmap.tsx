import React, { useState, useEffect, useMemo } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { 
  Globe, 
  Database, 
  CheckCircle, 
  Smartphone, 
  Linkedin, 
  MapPin, 
  TrendingUp, 
  PieChart as PieIcon,
  Zap,
  Activity,
  Users2
} from 'lucide-react';

// Interfaces
interface Hotspot {
  id: string;
  name: string;
  lat: number; // For plotting
  lng: number; // For plotting
  x: number;   // Plot coordinate on map viewBox
  y: number;   // Plot coordinate on map viewBox
  count: string;
  countVal: number;
  region: 'na' | 'eu' | 'apac' | 'latam' | 'mea';
  accuracy: string;
  topIndustry: string;
}

// Map Hotspots
const HOTSPOTS: Hotspot[] = [
  { id: 'hs-1', name: 'Silicon Valley / San Francisco', lat: 37.77, lng: -122.41, x: 130, y: 155, count: '8.45M', countVal: 8450000, region: 'na', accuracy: '98.9%', topIndustry: 'SaaS & Enterprise AI' },
  { id: 'hs-2', name: 'New York / Boston Tech Hub', lat: 40.71, lng: -74.00, x: 220, y: 165, count: '11.20M', countVal: 11200000, region: 'na', accuracy: '98.5%', topIndustry: 'Fintech & Medtech' },
  { id: 'hs-3', name: 'Austin / Dallas Expansion', lat: 30.26, lng: -97.74, x: 170, y: 195, count: '4.80M', countVal: 4800000, region: 'na', accuracy: '98.1%', topIndustry: 'Hardware & E-commerce' },
  { id: 'hs-4', name: 'London / Dublin Markets', lat: 51.50, lng: -0.12, x: 490, y: 135, count: '9.50M', countVal: 9500000, region: 'eu', accuracy: '98.2%', topIndustry: 'Finance & Cybersecurity' },
  { id: 'hs-5', name: 'Frankfurt / Munich Hub', lat: 50.11, lng: 8.68, x: 530, y: 142, count: '7.10M', countVal: 7100000, region: 'eu', accuracy: '98.0%', topIndustry: 'Manufacturing & Biotech' },
  { id: 'hs-6', name: 'Paris Capital Hub', lat: 48.85, lng: 2.35, x: 508, y: 152, count: '4.90M', countVal: 4900000, region: 'eu', accuracy: '97.5%', topIndustry: 'Luxury Tech & Logistics' },
  { id: 'hs-7', name: 'Singapore Southeast Expansion', lat: 1.35, lng: 103.81, x: 775, y: 288, count: '5.32M', countVal: 5320000, region: 'apac', accuracy: '98.6%', topIndustry: 'Fintech & Maritime SaaS' },
  { id: 'hs-8', name: 'Tokyo Enterprise Hub', lat: 35.67, lng: 139.65, x: 845, y: 175, count: '3.18M', countVal: 3180000, region: 'apac', accuracy: '97.2%', topIndustry: 'Electronics & Automotive' },
  { id: 'hs-9', name: 'Bangalore / Mumbai Clusters', lat: 12.97, lng: 77.59, x: 712, y: 238, count: '6.84M', countVal: 6840000, region: 'apac', accuracy: '97.9%', topIndustry: 'IT, SaaS & Engineering' },
  { id: 'hs-10', name: 'Sydney Trade Segment', lat: -33.86, lng: 151.20, x: 890, y: 395, count: '4.10M', countVal: 4100000, region: 'apac', accuracy: '98.0%', topIndustry: 'Energy & Biotech' },
  { id: 'hs-11', name: 'São Paulo South Hub', lat: -23.55, lng: -46.63, x: 345, y: 342, count: '5.10M', countVal: 5100000, region: 'latam', accuracy: '96.2%', topIndustry: 'Agribusiness & Retail' },
  { id: 'hs-12', name: 'Mexico City Digital Core', lat: 19.43, lng: -99.13, x: 195, y: 235, count: '3.12M', countVal: 3120000, region: 'latam', accuracy: '95.8%', topIndustry: 'Telecom & Logistics' },
  { id: 'hs-13', name: 'Dubai / Riyadh Enterprise', lat: 25.20, lng: 55.27, x: 635, y: 218, count: '4.55M', countVal: 4550000, region: 'mea', accuracy: '97.1%', topIndustry: 'Infrastructure & Sovereign Growth' },
  { id: 'hs-14', name: 'Johannesburg Regional Segment', lat: -26.20, lng: 28.04, x: 575, y: 362, count: '2.25M', countVal: 2250000, region: 'mea', accuracy: '96.5%', topIndustry: 'Mining & Fin Services' }
];

// Lead Stream simulation initial data
const SAMPLE_TICKERS = [
  { name: 'Marcus A.', title: 'VP of Engineering', company: 'CloudScale Inc', loc: 'San Francisco, CA', score: '99.4%', method: 'Email', time: 'Just now' },
  { name: 'Sarah L.', title: 'Director of Growth', company: 'FinPath Corp', loc: 'London, UK', score: '98.9%', method: 'Direct Phone', time: '12s ago' },
  { name: 'Rajesh K.', title: 'VP Sales Asia', company: 'Nexus Logistics', loc: 'Singapore', score: '99.1%', method: 'LinkedIn Sync', time: '34s ago' },
  { name: 'Ana M.', title: 'Chief Operations Officer', company: 'Terra Food S.A.', loc: 'São Paulo, BR', score: '97.8%', method: 'Email', time: '1m ago' },
  { name: 'Faisal A.', title: 'Head of Enterprise Procurement', company: 'Gulf Energy', loc: 'Abu Dhabi, UAE', score: '98.5%', method: 'Dual-Verified', time: '2m ago' }
];

export default function ActiveLeadsHeatmap() {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'na' | 'eu' | 'apac' | 'latam' | 'mea'>('all');
  const [hoveredHub, setHoveredHub] = useState<Hotspot | null>(null);
  const [activeHub, setActiveHub] = useState<Hotspot | null>(null);
  const [metric, setMetric] = useState<'emails' | 'phones' | 'linkedin'>('emails');
  const [tickers, setTickers] = useState(SAMPLE_TICKERS);

  // Background map drawing: high-resolution visual dots representation
  const activeHotspots = useMemo(() => {
    if (selectedRegion === 'all') return HOTSPOTS;
    return HOTSPOTS.filter(hs => hs.region === selectedRegion);
  }, [selectedRegion]);

  // Aggregate stats based on chosen region
  const stats = useMemo(() => {
    let list = HOTSPOTS;
    if (selectedRegion !== 'all') {
      list = HOTSPOTS.filter(hs => hs.region === selectedRegion);
    }
    const totalCount = list.reduce((acc, curr) => acc + curr.countVal, 0);
    const avgAccuracyVal = list.reduce((acc, curr) => acc + parseFloat(curr.accuracy), 0) / list.length;
    
    // Scale stats based on metric selected
    let scaledTotal = totalCount;
    if (metric === 'phones') scaledTotal = Math.round(totalCount * 0.72); // 72% have direct dials
    if (metric === 'linkedin') scaledTotal = Math.round(totalCount * 0.88); // 88% have LinkedIn

    return {
      count: (scaledTotal / 1000000).toFixed(2) + 'M',
      rawCount: scaledTotal,
      accuracy: avgAccuracyVal.toFixed(2) + '%',
      centers: list.length
    };
  }, [selectedRegion, metric]);

  // Handle live ticker animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick random hub from active region
      const relevantHubs = selectedRegion === 'all' 
        ? HOTSPOTS 
        : HOTSPOTS.filter(hs => hs.region === selectedRegion);
      
      if (relevantHubs.length === 0) return;
      const hub = relevantHubs[Math.floor(Math.random() * relevantHubs.length)];

      const titles = ['VP of Product', 'Chief Architect', 'Director of Infrastructure', 'SVP Marketing', 'Head of Revenue Tech', 'Procurement Director', 'General Counsel'];
      const corporations = ['Apex Capital', 'NoviSaaS Tech', 'Cortex Medical', 'EnviroGrid', 'Pinnacle ERP', 'Zenith Global', 'Krypton Cyber'];
      const methods = ['Double-Audited Email', 'Direct Dial Line', 'LinkedIn Active Link', 'Triple-Verified Reach'];
      
      const newTicker = {
        name: `${['David', 'Liam', 'Elena', 'Amara', 'Arjun', 'Sophie', 'Tariq', 'Camila'][Math.floor(Math.random() * 8)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
        title: titles[Math.floor(Math.random() * titles.length)],
        company: corporations[Math.floor(Math.random() * corporations.length)],
        loc: hub.name.split(' / ')[0],
        score: (96 + Math.random() * 3.8).toFixed(1) + '%',
        method: methods[Math.floor(Math.random() * methods.length)],
        time: 'Just now'
      };

      setTickers(prev => [newTicker, ...prev.slice(0, 4)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [selectedRegion]);

  // Recharts Chart 1: Industry Breakdown by Region
  const industryChartData = useMemo(() => {
    // Return relative proportions based on region
    const base = [
      { name: 'SaaS & AI', value: 35 },
      { name: 'Healthcare', value: 20 },
      { name: 'Fintech', value: 18 },
      { name: 'Logistics', value: 15 },
      { name: 'Tech Service', value: 12 }
    ];

    if (selectedRegion === 'na') {
      return [
        { name: 'SaaS & AI', value: 45 },
        { name: 'Fintech', value: 22 },
        { name: 'Healthcare', value: 15 },
        { name: 'Manufacturing', value: 10 },
        { name: 'Other Services', value: 8 }
      ];
    } else if (selectedRegion === 'eu') {
      return [
        { name: 'Fintech', value: 35 },
        { name: 'SaaS & AI', value: 25 },
        { name: 'Manufacturing', value: 18 },
        { name: 'Logistics', value: 12 },
        { name: 'Energy Tech', value: 10 }
      ];
    } else if (selectedRegion === 'apac') {
      return [
        { name: 'SaaS & AI', value: 30 },
        { name: 'IT & Hardware', value: 28 },
        { name: 'Maritime SaaS', value: 16 },
        { name: 'Fintech', value: 14 },
        { name: 'E-commerce', value: 12 }
      ];
    } else if (selectedRegion === 'latam') {
      return [
        { name: 'Agribusiness', value: 28 },
        { name: 'Telecom & Tech', value: 25 },
        { name: 'Retail Tech', value: 20 },
        { name: 'Logistics', value: 17 },
        { name: 'Other Tech', value: 10 }
      ];
    } else if (selectedRegion === 'mea') {
      return [
        { name: 'Energy Services', value: 32 },
        { name: 'Infrastructure', value: 26 },
        { name: 'Sovereign Growth', value: 18 },
        { name: 'Fintech & SaaS', value: 14 },
        { name: 'Raw Material Tech', value: 10 }
      ];
    }

    return base;
  }, [selectedRegion]);

  // Recharts Chart 2: Verified Leads Speed Index (Historical Growth)
  const growthChartData = useMemo(() => {
    let scale = 1.0;
    if (selectedRegion === 'na') scale = 1.25;
    if (selectedRegion === 'eu') scale = 1.1;
    if (selectedRegion === 'apac') scale = 1.15;
    if (selectedRegion === 'latam') scale = 0.75;
    if (selectedRegion === 'mea') scale = 0.65;

    return [
      { month: 'Nov', verified: Math.round(58000 * scale), audited: Math.round(72000 * scale) },
      { month: 'Dec', verified: Math.round(64000 * scale), audited: Math.round(78000 * scale) },
      { month: 'Jan', verified: Math.round(72000 * scale), audited: Math.round(89000 * scale) },
      { month: 'Feb', verified: Math.round(79000 * scale), audited: Math.round(92000 * scale) },
      { month: 'Mar', verified: Math.round(88000 * scale), audited: Math.round(108000 * scale) },
      { month: 'Apr', verified: Math.round(99000 * scale), audited: Math.round(124000 * scale) },
      { month: 'May', verified: Math.round(112000 * scale), audited: Math.round(138000 * scale) }
    ];
  }, [selectedRegion]);

  // Custom colors for charts
  const CHART_COLORS = ['#38bdf8', '#0ea5e9', '#6366f1', '#4f46e5', '#a855f7'];

  return (
    <div id="leads-heatmap-dashboard" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
      {/* Decorative ambient blurs */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid structure dividing details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Side: interactive map controls */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono font-black text-brand-400 tracking-widest uppercase">Live Footprint Analytics</span>
              </div>
              <h3 className="text-2xl font-display font-medium text-white tracking-tight">
                Global Coverage & Lead Heatmap
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mt-0.5 leading-relaxed">
                Explore verified indexes. Click on regions to update database density grids, telemetry records, and deep breakdown indices.
              </p>
            </div>

            {/* Metric switches */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0 shadow-lg shadow-slate-950/50">
              <button 
                onClick={() => setMetric('emails')}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  metric === 'emails' 
                    ? 'bg-brand-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                Emails
              </button>
              <button 
                onClick={() => setMetric('phones')}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  metric === 'phones' 
                    ? 'bg-brand-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
                Direct Dials
              </button>
              <button 
                onClick={() => setMetric('linkedin')}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  metric === 'linkedin' 
                    ? 'bg-brand-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Linkedin className="w-3.5 h-3.5 text-emerald-300" />
                Social Profiles
              </button>
            </div>
          </div>

          {/* Region Tabs switcher */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: 'all', label: 'Global (All Reach)' },
              { id: 'na', label: 'North America' },
              { id: 'eu', label: 'Europe Market' },
              { id: 'apac', label: 'Asia Pac Hubs' },
              { id: 'latam', label: 'Latin America' },
              { id: 'mea', label: 'Middle East & Africa' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedRegion(tab.id as any);
                  setActiveHub(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 border ${
                  selectedRegion === tab.id
                    ? 'bg-slate-800 text-white border-brand-500 shadow-md ring-1 ring-brand-500/20'
                    : 'bg-slate-950/55 text-slate-400 border-slate-850 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Geographic SVG Heatmap Canvas Container */}
          <div className="relative bg-slate-950/80 rounded-2xl border border-slate-800 p-4 min-h-[300px] flex items-center justify-center overflow-hidden">
            {/* World grid projection decoration */}
            <svg 
              viewBox="0 0 1000 480" 
              className="w-full h-auto max-w-full relative opacity-90 select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Decorative clean abstract map silhouettes */}
              {/* North America */}
              <path d="M120,70 L280,60 L290,120 L270,165 L210,180 L230,220 L160,250 L100,180 Z" fill="#ffffff" fillOpacity="0.03" stroke="#f1f5f9" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3,3" />
              {/* South America */}
              <path d="M220,250 L270,240 L350,330 L370,410 L310,430 L270,360 L230,300 Z" fill="#ffffff" fillOpacity="0.03" stroke="#f1f5f9" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3,3" />
              {/* Europe */}
              <path d="M470,130 L550,110 L585,125 L580,180 L520,220 L480,190 Z" fill="#ffffff" fillOpacity="0.03" stroke="#f1f5f9" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3,3" />
              {/* Africa */}
              <path d="M470,225 L540,210 L600,240 L600,320 L575,395 L530,350 L490,280 Z" fill="#ffffff" fillOpacity="0.03" stroke="#f1f5f9" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3,3" />
              {/* Asia */}
              <path d="M560,95 L840,90 L900,170 L870,300 L760,320 L660,290 L610,215 Z" fill="#ffffff" fillOpacity="0.03" stroke="#f1f5f9" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3,3" />
              {/* Australia */}
              <path d="M780,360 L890,340 L930,390 L870,440 L825,410 Z" fill="#ffffff" fillOpacity="0.03" stroke="#f1f5f9" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3,3" />

              {/* Grid dots mapping geographic coordinates */}
              <g fill="#1e293b" opacity="0.35">
                {/* Visual horizontal/vertical references */}
                <line x1="50" y1="240" x2="950" y2="240" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="500" y1="40" x2="500" y2="440" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />
              </g>

              {/* Connecting routes: glowing network fibers between active query and hotspots */}
              <g stroke="#38bdf8" strokeWidth="1.2" fill="none">
                {activeHotspots.map((hs, idx) => (
                  <path
                    key={`route-${hs.id}`}
                    d={`M 170 175 Q ${(170 + hs.x) / 2} ${(175 + hs.y) / 2 - 40} ${hs.x} ${hs.y}`}
                    strokeWidth={activeHub?.id === hs.id ? 2 : 0.8}
                    strokeDasharray="4,4"
                    strokeOpacity={activeHub?.id === hs.id ? 0.7 : hoveredHub?.id === hs.id ? 0.5 : 0.15}
                    className="transition-all duration-300"
                  />
                ))}
              </g>

              {/* Interactive pulsing points of double verification */}
              <g>
                {activeHotspots.map((hs) => {
                  const isHovered = hoveredHub?.id === hs.id;
                  const isActive = activeHub?.id === hs.id;
                  
                  return (
                    <g 
                      key={hs.id}
                      className="cursor-pointer"
                      onClick={() => setActiveHub(isActive ? null : hs)}
                      onMouseEnter={() => setHoveredHub(hs)}
                      onMouseLeave={() => setHoveredHub(null)}
                    >
                      {/* Pulse Circle outer halo */}
                      <circle 
                        cx={hs.x} 
                        cy={hs.y} 
                        r={isActive ? 24 : isHovered ? 18 : 12} 
                        fill={hs.region === 'na' ? '#38bdf8' : hs.region === 'eu' ? '#818cf8' : hs.region === 'apac' ? '#34d399' : '#fbbf24'} 
                        fillOpacity={isActive ? 0.25 : isHovered ? 0.35 : 0.15} 
                        className="transition-all duration-300"
                      >
                        <animate 
                          attributeName="r" 
                          values={`${isActive ? 16 : 8};${isActive ? 32 : 20};${isActive ? 16 : 8}`} 
                          dur={hs.region === 'na' ? '3s' : '4s'} 
                          repeatCount="indefinite" 
                        />
                      </circle>

                      {/* Small focus core */}
                      <circle 
                        cx={hs.x} 
                        cy={hs.y} 
                        r={isActive ? 6 : isHovered ? 5 : 4.5} 
                        fill={hs.region === 'na' ? '#0ea5e9' : hs.region === 'eu' ? '#4f46e5' : hs.region === 'apac' ? '#10b981' : '#f59e0b'} 
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="transition-all duration-300 shadow-md"
                      />

                      {/* Floating mini labeling text */}
                      {isHovered && (
                        <text
                          x={hs.x}
                          y={hs.y - 14}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          className="bg-slate-900 border border-slate-700 px-2 py-1 pointer-events-none select-none text-shadow-md"
                        >
                          {hs.name.split(' / ')[0]} ({hs.count})
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Source verification center flag ("Zrolodex Database Origin" located in Silicon Valley/NY area) */}
              <g transform="translate(195,160)" className="pointer-events-none">
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                <path d="M0,0 Q-30,-30 -80,-30" stroke="#64748b" strokeWidth="0.8" strokeDasharray="3,3" fill="none" />
                <text x="-85" y="-27" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">CORE DATABASE ENGINE</text>
              </g>
            </svg>

            {/* Custom Interactive Hotspot overlay panel - shows detailed specs when hotspot clicked */}
            <AnimatePresence>
              {activeHub && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border border-slate-850 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl z-20 backdrop-blur-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4.5 h-4.5 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {activeHub.name}
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                          {activeHub.accuracy} Valid Email Ratio
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Principal Industries: <span className="text-brand-300 font-semibold">{activeHub.topIndustry}</span> &bull; Regional Lead Pools: <span className="text-white font-semibold font-mono">{activeHub.count} Prospects</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-stretch md:self-auto">
                    <button 
                      onClick={() => setActiveHub(null)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition"
                    >
                      Close Map Overlay
                    </button>
                    <a 
                      href="#calculator-section"
                      className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shrink-0 transition text-center flex-1 md:flex-none uppercase tracking-wider"
                    >
                      Extract Custom List
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Aggregate Telemetry metrics cards row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2 font-black">Region Scope</span>
              <span className="text-2xl font-bold text-white block capitalize font-display">
                {selectedRegion === 'all' ? 'Worldwide' : selectedRegion}
              </span>
              <span className="text-[9px] text-slate-500 font-medium font-mono mt-1 leading-none">{stats.centers} Central Hotspots mapped</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2 font-black">Verified Lead Count</span>
              <span className="text-2xl font-bold text-teal-400 block font-mono">
                {stats.count}
              </span>
              <span className="text-[9px] text-slate-500 font-medium font-mono mt-1 leading-none">Filtered: {metric}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2 font-black">Email Accuracy API</span>
              <span className="text-2xl font-bold text-brand-400 block font-mono">
                {stats.accuracy}
              </span>
              <span className="text-[9px] text-slate-500 font-medium font-mono mt-1 leading-none">Guaranteed deliverable baseline</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-black">Core Routing State</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold leading-tight">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <span>INDEXED_OK</span>
              </div>
              <span className="text-[9px] text-slate-500 font-medium font-mono mt-1.5 leading-none">Double-blind sanitization loop</span>
            </div>
          </div>
        </div>

        {/* Right Side: Recharts Charts & Stream Feed */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* Chart Cards segment */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-300">Region Industry Share</span>
              </div>
              <span className="text-[9px] text-slate-500 font-mono">Live Telemetry Breakdown</span>
            </div>

            {/* Recharts Bar Chart explaining industry coverage */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false} 
                    unit="%"
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#38bdf8', fontSize: '10px' }}
                  />
                  <Bar dataKey="value" name="Representation Ratio" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                    {industryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              Indices represent verified business sectors matching ZROLODEX live target classifications.
            </p>
          </div>

          {/* Chart Segment 2: Leads Sanitization Speed (Historical Data) */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-300">Sanitized Indices (Weekly)</span>
              </div>
              <span className="text-[9px] text-slate-500 font-mono">Verification Index Speed</span>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthChartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAudited" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    stroke="#475569" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="audited" name="Audited Data Inputs" stroke="#6366f1" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAudited)" />
                  <Area type="monotone" dataKey="verified" name="Triple-Cleaned Outputs" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVerified)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-time verified ticker feed box */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-3 shrink-0 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                  <span className="text-xs font-bold text-slate-300">Live Cleansing Stream</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">Syncing global feeds</span>
              </div>

              {/* Ticker rows with animated state changes */}
              <div className="space-y-2 max-h-[175px] overflow-hidden">
                {tickers.map((t, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 rounded-lg bg-slate-900 border border-slate-850/50 flex justify-between items-center text-left ${
                      idx === 0 ? 'animate-pulse border-brand-500/20 bg-brand-950/10' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 leading-none">
                        <span>{t.name}</span>
                        <span className="text-slate-500 text-[9px] font-normal font-mono">({t.title})</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1">
                        {t.company} &bull; <span className="font-semibold text-slate-300">{t.loc}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] font-mono text-emerald-400 font-bold leading-none">
                        {t.score} Valid
                      </div>
                      <div className="text-[8px] text-slate-500 mt-1 font-mono">
                        {t.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a 
                href="#calculator-section"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-300 hover:text-white rounded-xl text-center text-xs font-bold cursor-pointer transition flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Query live matching metrics list
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  Activity, 
  Users, 
  Zap, 
  Database,
  RefreshCw
} from 'lucide-react';

interface ActivityEvent {
  id: string;
  userType: string;
  city: string;
  country: string;
  quantity: number;
  roleType: string;
  industry: string;
  timeAgo: string;
  type: 'generate' | 'enrich' | 'verify';
  score: string;
}

const SIMULATED_EVENTS: ActivityEvent[] = [
  {
    id: 'ev-1',
    userType: 'Growth Director',
    city: 'San Francisco',
    country: 'USA',
    quantity: 1850,
    roleType: 'VPs of Engineering',
    industry: 'SaaS & DevOps',
    timeAgo: 'Just now',
    type: 'generate',
    score: '99.4%'
  },
  {
    id: 'ev-2',
    userType: 'Founder',
    city: 'London',
    country: 'UK',
    quantity: 3400,
    roleType: 'E-commerce CMOs',
    industry: 'Retail Tech',
    timeAgo: '12 seconds ago',
    type: 'verify',
    score: '98.9%'
  },
  {
    id: 'ev-3',
    userType: 'VP of Business Development',
    city: 'Chicago',
    country: 'USA',
    quantity: 920,
    roleType: 'Procurement Directors',
    industry: 'Logistics & Supply Chain',
    timeAgo: '45 seconds ago',
    type: 'enrich',
    score: '100% Validated'
  },
  {
    id: 'ev-4',
    userType: 'Outbound SDR Lead',
    city: 'Munich',
    country: 'Germany',
    quantity: 2150,
    roleType: 'Chief Technology Officers',
    industry: 'FinTech scaleup',
    timeAgo: '1 minute ago',
    type: 'generate',
    score: '99.2%'
  },
  {
    id: 'ev-5',
    userType: 'Marketing Agency Owner',
    city: 'Sydney',
    country: 'Australia',
    quantity: 4800,
    roleType: 'Heads of Growth',
    industry: 'Direct-to-Consumer Brands',
    timeAgo: '2 minutes ago',
    type: 'enrich',
    score: '98.5%'
  },
  {
    id: 'ev-6',
    userType: 'Sales Specialist',
    city: 'Austin',
    country: 'USA',
    quantity: 1200,
    roleType: 'Medical Procurement leads',
    industry: 'Private Healthcare Systems',
    timeAgo: '3 minutes ago',
    type: 'verify',
    score: '100% Deliverable'
  },
  {
    id: 'ev-7',
    userType: 'Enterprise AE',
    city: 'Toronto',
    country: 'Canada',
    quantity: 750,
    roleType: 'Information Security Officers',
    industry: 'Cybersecurity providers',
    timeAgo: '4 minutes ago',
    type: 'generate',
    score: '99.7%'
  }
];

export default function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState<ActivityEvent[]>(SIMULATED_EVENTS);

  // Set up periodic cycle and real-time feel
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4500);

    // Minor state modification to simulate real-time updates to 'timeAgo' dynamically
    const updateStatsInterval = setInterval(() => {
      setEvents((prevEvents) => {
        return prevEvents.map((evt, idx) => {
          if (idx === currentIndex) {
            return { ...evt, timeAgo: 'Just now' };
          }
          // Shift others incrementally
          if (evt.timeAgo === 'Just now') return { ...evt, timeAgo: '15 seconds ago' };
          if (evt.timeAgo === '12 seconds ago') return { ...evt, timeAgo: '30 seconds ago' };
          if (evt.timeAgo === '45 seconds ago') return { ...evt, timeAgo: '1 minute ago' };
          if (evt.timeAgo === '1 minute ago') return { ...evt, timeAgo: '2 minutes ago' };
          if (evt.timeAgo === '2 minutes ago') return { ...evt, timeAgo: '3 minutes ago' };
          return evt;
        });
      });
    }, 15000);

    return () => {
      clearInterval(cycleInterval);
      clearInterval(updateStatsInterval);
    };
  }, [currentIndex, events.length]);

  const activeEvent = events[currentIndex];

  return (
    <div className="w-full bg-slate-50 border-y border-slate-200/60 py-3.5 relative overflow-hidden" id="live-activity-ticker-container">
      {/* Decorative gradient shadows on left and right for visual framing */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 min-h-[36px]">
          
          {/* Real-time Indicator Tag */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>Real-Time Activity Feed</span>
            </div>
            <div className="w-px h-3.5 bg-slate-200 hidden md:block" />
          </div>

          {/* Active Event Dynamic Slide Panel */}
          <div className="flex-1 overflow-hidden relative min-h-[28px] md:min-h-[24px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-slate-700"
              >
                {/* Visual Icon Badge depending on activity type */}
                <div className="flex items-center gap-1">
                  {activeEvent.type === 'generate' && (
                    <span className="bg-brand-50 text-brand-700 border border-brand-100 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase inline-flex items-center gap-1">
                      <Database className="w-2.5 h-2.5" />
                      Generated List
                    </span>
                  )}
                  {activeEvent.type === 'verify' && (
                    <span className="bg-teal-50 text-teal-700 border border-teal-100 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase inline-flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-teal-600" />
                      SMTP Verified
                    </span>
                  )}
                  {activeEvent.type === 'enrich' && (
                    <span className="bg-purple-50 text-purple-700 border border-purple-100 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase inline-flex items-center gap-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
                      CRM Enriched
                    </span>
                  )}
                </div>

                {/* Event Description Content */}
                <span className="font-sans font-medium text-slate-800">
                  A <span className="font-bold text-slate-900">{activeEvent.userType}</span> in{' '}
                  <span className="text-slate-900 font-semibold">{activeEvent.city}, {activeEvent.country}</span>
                </span>

                <span className="text-slate-400 font-mono hidden sm:inline">•</span>

                <span className="font-sans text-slate-600">
                  compiled <span className="font-bold font-mono text-brand-705 text-brand-700">{activeEvent.quantity.toLocaleString()}</span>{' '}
                  verified profiles of <span className="font-medium text-slate-800">{activeEvent.roleType}</span> ({activeEvent.industry})
                </span>

                {/* Accuracy Match Tag Badge */}
                <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200/60 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold">
                  <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500/10" />
                  <span>{activeEvent.score}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Timing indicators / Metric */}
          <div className="shrink-0 flex items-center justify-between gap-5 self-end md:self-center">
            <span className="text-[10px] text-slate-400 font-mono font-medium block">
              {activeEvent.timeAgo}
            </span>
            <div className="hidden lg:flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer" title="Active Client Pipeline API State">
              <span>99.9% Pipeline SLA</span>
              <ArrowUpRight className="w-3 h-3 text-slate-405 text-slate-400" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

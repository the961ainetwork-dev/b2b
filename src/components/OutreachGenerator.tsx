import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Mail, 
  Linkedin, 
  PhoneCall, 
  MessageSquareCode,
  ArrowRight,
  Zap,
  HelpCircle
} from 'lucide-react';

interface Template {
  subject: string;
  body: string;
}

export default function OutreachGenerator({ selectedIndustry = 'Technology & SaaS', selectedJobLevel = 'C-Suite (CEO, Founder)' }) {
  const [objective, setObjective] = useState<'demo' | 'audit' | 'partnership'>('demo');
  const [channel, setChannel] = useState<'email' | 'linkedin' | 'coldcall'>('email');
  const [copied, setCopied] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  // Helper to extract clean tier name
  const levelName = selectedJobLevel.split(' ')[0] || 'Executive';
  const shortInd = selectedIndustry.split('&')[0]?.trim() || 'your sector';

  // Generated copy templates matching selection
  const templates: Record<'demo' | 'audit' | 'partnership', Record<'email' | 'linkedin' | 'coldcall', Template>> = {
    demo: {
      email: {
        subject: `Quick question regarding ${shortInd} operations at {{Company Name}}`,
        body: `Hi {{First Name}},\n\nI noticed you oversee management as the ${levelName} at {{Company Name}}. Given your focus on growth, I wanted to reach out regarding how you're currently navigating changes in the ${shortInd} space.\n\nWe recently helped a similar group scale their qualified pipelines by 38% while reducing client acquisition overhead by nearly half.\n\nWould you be open to a brief 7-minute introductory call next Tuesday at 10:00 AM to see if this aligns with {{Company Name}}'s priorities?\n\nBest regards,\n\n{{Your Name}}\n{{Your Company}}\n{{Your Phone}}`
      },
      linkedin: {
        subject: 'Connection Request',
        body: `Hi {{First Name}}, came across your profile and noticed your impressive work as the ${levelName} at {{Company Name}} in ${shortInd}. I'd love to connect, and share a quick deliverability checklist we put together for builders in your niche. Let's connect!`
      },
      coldcall: {
        subject: 'Cold Call Hook',
        body: `"Hi {{First Name}}, this is {{Your Name}} on a recorded line from {{Your Company}}. I know I caught you completely out of the blue, but do you have 45 seconds to talk about streamlining operations in ${selectedIndustry}? Our partners are currently seeing double-digit meeting volumes using verified BDM contact channels..."`
      }
    },
    audit: {
      email: {
        subject: `Complimentary audit of {{Company Name}}'s data channels for ${levelName}`,
        body: `Hi {{First Name}},\n\nAs the ${levelName} of {{Company Name}}, I assume ensuring strong data deliverability and campaign performance is top of mind for your team.\n\nMy engineers ran a quick assessment of public data sets in ${selectedIndustry} and mapped a few key areas where marketing assets are bouncing off targeted servers.\n\nI've consolidated a complimentary audit with 25 target profiles ready for you. Would you oppose a brief comparison overview this week?\n\nSincerely,\n\n{{Your Name}}\n{{Your Company}}`
      },
      linkedin: {
        subject: 'Data Audit',
        body: `Hi {{First Name}} – as the ${levelName} at {{Company Name}}, I appreciate how hard it is to maintain clean data pipelines right now. I prepared a custom report targeting ${shortInd} lists that could help your outbound reps. Let me know if you'd like a free copy!`
      },
      coldcall: {
        subject: 'Audit Hook',
        body: `"Hello {{First Name}}, I am calling because my research team noticed some stale addresses being targeted in your latest outbound events. As the ${levelName} at {{Company Name}} I thought you'd want to inspect the cost leakage on those campaigns. We have a triple-verified list sample of 25 matched contacts to show you..."`
      }
    },
    partnership: {
      email: {
        subject: `Strategic alignment: {{Your Company}} x {{Company Name}}`,
        body: `Hi {{First Name}},\n\nI hope you're having an excellent week.\n\nI've been tracking {{Company Name}}'s footprint in ${selectedIndustry}. Given your role as the ${levelName}, I'm reaching out to explore potential alliances that could broaden outreach capabilities for both of our user groups.\n\nWe provide verified contact networks to leading brands, and I think your client set is highly complementary to ours.\n\nCould we jump on a 10-minute call to see if a pilot collaboration is worth exploring?\n\nBest,\n\n{{Your Name}}\n{{Your Company}}`
      },
      linkedin: {
        subject: 'Partnership Inquiry',
        body: `Hello {{First Name}}, loved your recent updates. As the ${levelName} at {{Company Name}}, your perspective on ${selectedIndustry} is spot on. We are looking for select strategic partners in the region. Love to connect and share notes!`
      },
      coldcall: {
        subject: 'Partnership Pitch',
        body: `"Hi {{First Name}}, this is {{Your Name}} calling. We are currently rolling out strategic channel alliances in ${selectedIndustry} specifically configured to support executive leadership like yourself at {{Company Name}}. We wanted to establish a mutual referral channel. Do you run those partnerships?"`
      }
    }
  };

  const activeTemplate = templates[objective][channel];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTemplate.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden" id="outreach-generator">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-800/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        
        {/* Title */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-405 text-amber-400 w-5 h-5 animate-pulse" />
            <h4 className="font-display font-medium text-lg md:text-xl text-white">
              Instant Outreach Copy Builder
            </h4>
          </div>
          <span className="bg-slate-800 text-[10px] font-mono font-bold text-slate-300 px-2 py-1 rounded border border-white/5 uppercase">
            Data Activated
          </span>
        </div>

        <p className="text-slate-400 text-xs">
          Match your messaging instantly! The assistant automatically adjusts copy frameworks based on your selected Targeting criteria in the calculator above: <strong className="text-teal-400">{shortInd}</strong> targeting <strong className="text-teal-400">{levelName}</strong>.
        </p>

        {/* Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Column 1: Objectives */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              Campaign Objective
            </label>
            <div className="flex p-0.5 bg-slate-800 rounded-xl border border-white/5" id="outreach-objective">
              {(['demo', 'audit', 'partnership'] as const).map(obj => (
                <button
                  key={obj}
                  onClick={() => setObjective(obj)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition duration-150 cursor-pointer ${
                    objective === obj 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {obj === 'demo' ? 'Product Demo' : obj === 'audit' ? 'Free Audit' : 'Partnership'}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Channels */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              Outbound Channel
            </label>
            <div className="flex p-0.5 bg-slate-800 rounded-xl border border-white/5" id="outreach-channel">
              {(['email', 'linkedin', 'coldcall'] as const).map(ch => (
                <button
                  key={ch}
                  onClick={() => setChannel(ch)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                    channel === ch 
                      ? 'bg-brand-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ch === 'email' && <Mail className="w-3.5 h-3.5" />}
                  {ch === 'linkedin' && <Linkedin className="w-3.5 h-3.5" />}
                  {ch === 'coldcall' && <PhoneCall className="w-3.5 h-3.5" />}
                  {ch === 'email' ? 'Email' : ch === 'linkedin' ? 'LinkedIn' : 'Cold Hook'}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Output Sheet */}
        <div className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden p-5 space-y-4">
          
          {channel !== 'coldcall' && (
            <div className="border-b border-white/5 pb-3 flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Subject / Headline:</span>
                <p className="text-xs text-teal-300 font-semibold font-display mt-1">{activeTemplate.subject}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeTemplate.subject);
                  setCopiedSubject(true);
                  setTimeout(() => setCopiedSubject(false), 2000);
                }}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 font-medium font-mono text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                title="Copy Subject only"
              >
                {copiedSubject ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Message Content:</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeTemplate.body);
                  setCopiedBody(true);
                  setTimeout(() => setCopiedBody(false), 2000);
                }}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 font-medium font-mono text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                title="Copy body text only"
              >
                {copiedBody ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Body</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-xs text-slate-200 leading-relaxed font-sans mt-2 whitespace-pre-line antialiased">
              {activeTemplate.body.split(/({{[^}]+}})/g).map((chunk, index) => {
                const isToken = chunk.startsWith('{{') && chunk.endsWith('}}');
                return isToken ? (
                  <span key={index} className="bg-amber-500/10 text-amber-300 px-1 py-0.5 rounded border border-amber-500/20 font-mono font-medium text-[11px]">
                    {chunk}
                  </span>
                ) : (
                  chunk
                );
              })}
            </p>
          </div>

          {/* Copy Button */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Zap className="text-amber-400 w-3 h-3" />
              CRM Copy-Paste Ready
            </span>
            <button 
              onClick={handleCopy}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-md shadow-brand-950"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Successfully' : 'Copy Full Template'}
            </button>
          </div>

        </div>

        {/* Cold emailing tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-400">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5">
            <p className="font-semibold text-slate-300">💡 Performance Tip:</p>
            <p className="mt-1">For optimal deliverability, keep your cold outbound emails shorter than 150 words and never attach links on the first touch-point.</p>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5">
            <p className="font-semibold text-slate-300">🔒 Data Compliance Note:</p>
            <p className="mt-1">All contacts generated from our live database matches are legally cleared for unsolicited business-to-business introductions under the CAN-SPAM safe-harbor rule.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

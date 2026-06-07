import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  MailOpen, 
  PhoneCall, 
  Linkedin, 
  Layers, 
  Search, 
  CheckCircle, 
  BadgeAlert,
  SlidersHorizontal,
  Download,
  Building
} from 'lucide-react';
import { MOCK_CONTACTS } from '../data';
import { ContactRecord } from '../types';

export default function RecordPreview({ onTriggerSample }: { onTriggerSample: () => void }) {
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['ct-1', 'ct-3']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const toggleUnlock = (id: string) => {
    if (unlockedIds.includes(id)) {
      setUnlockedIds(prev => prev.filter(item => item !== id));
    } else {
      setUnlockedIds(prev => [...prev, id]);
    }
  };

  const industriesPresent = ['All', ...Array.from(new Set(MOCK_CONTACTS.map(c => c.industry)))];

  const filteredContacts = MOCK_CONTACTS.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'All' || contact.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden" id="record-preview-system">
      <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-150">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="font-display font-bold text-slate-800 text-lg md:text-xl">
              Live Database Prospect Explorer
            </h4>
            <p className="text-slate-500 text-xs mt-0.5">
              Interact with genuine sample entries to preview the granular demographic fields included with every order.
            </p>
          </div>
          <button 
            onClick={onTriggerSample}
            className="flex items-center gap-1.5 px-4 py-2 border border-brand-200 hover:border-brand-300 text-brand-700 bg-brand-50 hover:bg-brand-100/70 font-semibold text-xs rounded-xl transition cursor-pointer self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Unlock 25 Matches Custom
          </button>
        </div>

        {/* Filter controls inside explorer panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6">
          <div className="relative md:col-span-7">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by executive, job title, company..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="relative md:col-span-5">
            <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none appearance-none cursor-pointer"
            >
              {industriesPresent.map(ind => (
                <option key={ind} value={ind}>{ind === 'All' ? 'Filter by Industry: All' : ind}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[9px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Database Sheet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/40 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100 font-mono">
              <th className="py-4 px-6">Name / Title</th>
              <th className="py-4 px-4">Company Profile</th>
              <th className="py-4 px-4">Verified Business Email</th>
              <th className="py-4 px-4">Direct Dial</th>
              <th className="py-4 px-4">Region</th>
              <th className="py-4 px-6 text-center">Data Integrity Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => {
                const isUnlocked = unlockedIds.includes(contact.id);
                return (
                  <tr key={contact.id} className="hover:bg-slate-50/55 transition group">
                    
                    {/* Name / Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {contact.firstName[0]}{contact.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mt-0.5">
                            {contact.title}
                            {contact.linkedin && (
                              <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 transition">
                                <Linkedin className="w-3 h-3 inline" />
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company info */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-slate-700 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {contact.company}
                        </p>
                        <p className="text-slate-400 text-[10px] mt-0.5 font-mono">
                          {contact.industry} • Rev: {contact.revenue}
                        </p>
                      </div>
                    </td>

                    {/* Verified Email with interactive locked toggles */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {isUnlocked ? (
                          <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="bg-emerald-50 text-emerald-800 font-mono px-2.5 py-1 rounded border border-emerald-100 flex items-center gap-1.5"
                          >
                            <MailOpen className="w-3.5 h-3.5 text-emerald-500" />
                            {contact.email}
                          </motion.div>
                        ) : (
                          <span 
                            onClick={() => toggleUnlock(contact.id)}
                            className="bg-slate-100 text-slate-400 font-mono px-2.5 py-1 rounded border border-slate-200 inline-flex items-center gap-1.5 select-none cursor-pointer hover:bg-slate-200 transition text-[10px]"
                          >
                            <Lock className="w-3 h-3 text-slate-400" />
                            {contact.email.split('@')[0].slice(0, 2)}••••••@{contact.email.split('@')[1]}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Direct phone with lock option */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {isUnlocked ? (
                          <span className="font-mono text-slate-700 flex items-center gap-1">
                            <PhoneCall className="w-3 h-3 text-slate-400" />
                            {contact.phone}
                          </span>
                        ) : (
                          <span 
                            onClick={() => toggleUnlock(contact.id)}
                            className="text-slate-350 font-mono cursor-pointer hover:text-slate-500 transition flex items-center gap-1 select-none text-[10px]"
                          >
                            <Lock className="w-3 h-3 text-slate-300" />
                            +1 (•••) •••-••••
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Region */}
                    <td className="py-4 px-4 font-semibold text-slate-600 font-mono text-xs">
                      {contact.country}
                    </td>

                    {/* Accuracy status */}
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                        contact.verifiedStatus === 'Verified' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        <CheckCircle className="w-3 h-3" />
                        {contact.verifiedStatus}
                      </span>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium font-display">
                  No prospects matched your current search filters. Try selecting another industry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Explorer Footer with statistics */}
      <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between text-xs gap-3">
        <p className="text-slate-500 font-medium flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          Showing {filteredContacts.length} verified sample records list index database structure.
        </p>
        <p className="text-slate-400 text-[11px]">
          Demo Tip: Click the <Lock className="w-3 h-3 inline text-slate-400 mx-0.5" /> lock icons in rows to see email formatting.
        </p>
      </div>

    </div>
  );
}

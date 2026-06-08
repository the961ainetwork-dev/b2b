import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Building,
  X,
  Sparkles,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { MOCK_CONTACTS } from '../data';
import { ContactRecord } from '../types';

export default function RecordPreview({ onTriggerSample }: { onTriggerSample: () => void }) {
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['ct-1', 'ct-3']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info'; visible: boolean } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type, visible: true });
  };

  const handleCopySelectedEmails = () => {
    try {
      const selectedContacts = MOCK_CONTACTS.filter(c => selectedIds.includes(c.id));
      const emails = selectedContacts.map(c => c.email).join(', ');
      navigator.clipboard.writeText(emails);
      showToast(`Successfully copied matches! ${selectedIds.length} B2B digital emails transferred to clipboard. (${selectedIds.length} rows processed)`, 'success');
    } catch (err) {
      console.warn('Clipboard writing error:', err);
      showToast('Error transferring emails to clipboard.', 'info');
    }
  };

  const handleDownloadSelectedCSV = () => {
    try {
      const selectedContacts = MOCK_CONTACTS.filter(c => selectedIds.includes(c.id));
      const headers = ['First Name', 'Last Name', 'Title', 'Email', 'Phone', 'Company', 'Industry', 'Revenue', 'Country', 'Status'];
      const csvRows = [
        headers.join(','),
        ...selectedContacts.map(c => [
          `"${c.firstName}"`,
          `"${c.lastName}"`,
          `"${c.title}"`,
          `"${c.email}"`,
          `"${c.phone}"`,
          `"${c.company}"`,
          `"${c.industry}"`,
          `"${c.revenue}"`,
          `"${c.country}"`,
          `"${c.verifiedStatus}"`
        ].join(','))
      ];
      
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Zrolodex_Selected_Leads_${selectedIds.length}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast(`Exported successfully! Zrolodex_Selected_Leads_${selectedIds.length}.csv file download initialized. (${selectedIds.length} rows processed)`, 'success');
    } catch (err) {
      console.warn('CSV export error:', err);
      showToast('Failed to export selected leads.', 'info');
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (contactsList: ContactRecord[]) => {
    const activeContactIds = contactsList.map(c => c.id);
    const allSelectedOnPage = activeContactIds.length > 0 && activeContactIds.every(id => selectedIds.includes(id));
    
    if (allSelectedOnPage) {
      // Unselect all of these active filtered contacts
      setSelectedIds(prev => prev.filter(id => !activeContactIds.includes(id)));
    } else {
      // Select all of these active filtered contacts
      setSelectedIds(prev => {
        const unionSet = new Set([...prev, ...activeContactIds]);
        return Array.from(unionSet);
      });
    }
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors
      const primaryColor = '#0f172a'; // Deep slate (slate-900)
      const accentColor = '#b45309'; // Amber-700
      const successColor = '#047857'; // Emerald-700
      const textColor = '#334155'; // Slate-700 text color

      // Headings
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(primaryColor);
      doc.text('Zrolodex B2B Database Record', 20, 22);

      // Gold line separator
      doc.setDrawColor(217, 119, 6); // amber-600
      doc.setLineWidth(1);
      doc.line(20, 26, 190, 26);

      // Label metadata
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);
      doc.text('STANDARD METADATA: TRIPLE-VERIFIED OUTBOUND DIRECT EXPANSION LIST', 20, 32);
      doc.text('GENERATED: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 190, 32, { align: 'right' });

      // Highlight description
      doc.setFontSize(10.5);
      doc.setTextColor(textColor);
      doc.text('This record snippet previews the precision quality formatting of direct prospect rosters on orders.', 20, 40);
      doc.text('Every custom lead delivered is passed through our rigid validation sequence before release.', 20, 45);

      // Table Header Row Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(primaryColor);
      doc.text('SAMPLED OUTBOUND LEADS (5 REPORTED ROWS)', 20, 56);

      // Draw Table Header Background
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(20, 61, 170, 8, 'F');

      doc.setFontSize(9);
      doc.setTextColor(primaryColor);
      doc.text('Contact Name / Role', 23, 66.5);
      doc.text('Corporate Email Code', 70, 66.5);
      doc.text('Target Organism Profile', 115, 66.5);
      doc.text('Validation Audit', 162, 66.5);

      const rows = [
        { name: 'Sarah Jenkins', role: 'VP of Growth', email: 'sarah.jenkins@stripe.com', company: 'Stripe, Inc.', domain: 'stripe.com', status: 'Triple Verified' },
        { name: 'Marcus Chen', role: 'Director of Demand Gen', email: 'marcus.chen@airbnb.com', company: 'Airbnb', domain: 'airbnb.com', status: 'Triple Verified' },
        { name: 'Elena Rostova', role: 'Head of Outbound Strategy', email: 'elena.rostova@datadoghq.com', company: 'Datadog EMEA', domain: 'datadoghq.com', status: 'Triple Verified' },
        { name: 'David Kofman', role: 'Senior Growth Lead', email: 'd.kofman@canva.com', company: 'Canva HQ', domain: 'canva.com', status: 'Triple Verified' },
        { name: 'Amina Diallo', role: 'VP Corporate Strategy', email: 'amina.diallo@retrieval.io', company: 'Retrieval AI', domain: 'retrieval.io', status: 'Triple Verified' }
      ];

      let currentY = 69;
      rows.forEach((row, idx) => {
        // Draw row divider line
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.3);
        doc.line(20, currentY + 12, 190, currentY + 12);

        // Contact Info
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(primaryColor);
        doc.text(row.name, 23, currentY + 4.5);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(textColor);
        doc.text(row.role, 23, currentY + 8.5);

        // Corporate Email Info
        doc.setFont('courier', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(primaryColor);
        doc.text(row.email, 70, currentY + 6.5);

        // Organization Info
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(textColor);
        doc.text(row.company, 115, currentY + 4.5);
        
        doc.setFont('courier', 'normal');
        doc.setFontSize(7.5);
        doc.text(row.domain, 115, currentY + 8.5);

        // Verification Status Stamp
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(successColor);
        doc.text(row.status, 162, currentY + 6.5);

        currentY += 12;
      });

      // Verification Overview
      currentY += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(primaryColor);
      doc.text('3-LEVEL INTEGRITY EVALUATION PROTOCOL SUMMARY:', 20, currentY);

      currentY += 5;
      // Step 1
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(accentColor);
      doc.text('1. SMTP Handshake Validation Loop', 22, currentY + 2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textColor);
      doc.text('Establishes live connections with third-party email nodes to guarantee active mailboxes.', 22, currentY + 6);

      currentY += 11;
      // Step 2
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(accentColor);
      doc.text('2. LinkedIn Cross-Profile Correlation', 22, currentY + 2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textColor);
      doc.text('Matches corporate titles with live directory trees in our secure background database indexer.', 22, currentY + 6);

      currentY += 11;
      // Step 3
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(accentColor);
      doc.text('3. Catch-All Domain Signature Filtering', 22, currentY + 2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textColor);
      doc.text('Removes catch-all configurations, honey-pots, corporate blocks and spam traps dynamically.', 22, currentY + 6);

      // --- Footer ---
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(20, 274, 190, 274);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(textColor);
      doc.text('* Preview complies strictly with corporate rules, international GDPR mandates & state CAN-SPAM direct indexing rules.', 20, 279);
      doc.text('Zrolodex B2B Database & Custom Outbound Pipelines. To request dynamic high-yield orders, request a Custom Quote.', 20, 283);

      doc.save('Zrolodex_Data_Sample_Report.pdf');
      showToast('Zrolodex_Data_Sample_Report.pdf download started successfully! (5 sample rows processed)', 'success');
    } catch (err) {
      console.error('JS PDF structure generation occurred:', err);
      showToast('Fallback warning: Failed to output PDF document.', 'info');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyEmail = (email: string) => {
    try {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2000);
      showToast(`Copied ${email} to clipboard! (1 record processed)`, 'success');
    } catch (err) {
      console.warn('Clipboard writing error:', err);
      showToast('Failed to copy text to clipboard.', 'info');
    }
  };

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
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 self-start md:self-auto">
            <button 
              onClick={() => setIsSampleModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-amber-200 hover:border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100/70 font-semibold text-xs rounded-xl transition cursor-pointer"
              id="view-data-sample-btn"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              View Data Sample (.CSV)
            </button>
            <button 
              onClick={onTriggerSample}
              className="flex items-center gap-1.5 px-4 py-2 border border-brand-200 hover:border-brand-300 text-brand-700 bg-brand-50 hover:bg-brand-100/70 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Unlock 25 Matches Custom
            </button>
          </div>
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
        <table className="w-full text-left border-collapse" id="preview-data-table">
          <thead>
            <tr className="bg-slate-100/40 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100 font-mono">
              <th className="py-4 px-4 text-center w-12">
                <input
                  type="checkbox"
                  checked={filteredContacts.length > 0 && filteredContacts.every(c => selectedIds.includes(c.id))}
                  onChange={() => handleSelectAll(filteredContacts)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  title="Toggle all matching prospects"
                  id="select-all-contacts-checkbox"
                />
              </th>
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
                const isSelected = selectedIds.includes(contact.id);
                return (
                  <tr 
                    key={contact.id} 
                    className={`transition group border-b border-slate-100/70 cursor-default ${
                      isSelected 
                        ? 'bg-amber-50/30 hover:bg-amber-50/50' 
                        : 'hover:bg-slate-50/55'
                    }`}
                    id={`row-${contact.id}`}
                  >
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(contact.id)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        id={`select-contact-${contact.id}`}
                      />
                    </td>
                    
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
                            className="bg-emerald-50 text-emerald-800 font-mono px-2.5 py-1 rounded border border-emerald-100 flex items-center gap-1.5 group/email relative"
                          >
                            <MailOpen className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{contact.email}</span>
                            <button
                              onClick={() => handleCopyEmail(contact.email)}
                              title="Copy email to clipboard"
                              className="ml-1 p-1 hover:bg-emerald-100/80 rounded text-emerald-600 hover:text-emerald-900 transition flex items-center justify-center cursor-pointer"
                              id={`copy-email-${contact.id}`}
                            >
                              {copiedEmail === contact.email ? (
                                <Check className="w-3 h-3 text-emerald-700 font-bold animate-fade-in" />
                              ) : (
                                <Copy className="w-3 h-3 opacity-60 group-hover/email:opacity-100 transition-opacity" />
                              )}
                            </button>
                            {copiedEmail === contact.email && (
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-lg font-sans font-medium whitespace-nowrap animate-bounce z-25">
                                Copied!
                              </span>
                            )}
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
                <td colSpan={7} className="py-12 text-center text-slate-400 font-medium font-display">
                  No prospects matched your current search filters. Try selecting another industry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating/Bottom Action Bar for selection status */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 text-white border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs overflow-hidden"
            id="selection-actions-bar"
          >
            <div className="flex items-center gap-2 font-display">
              <span className="bg-amber-500 text-slate-950 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center justify-center min-w-[24px]">
                {selectedIds.length}
              </span>
              <span className="text-slate-200">
                {selectedIds.length === 1 ? 'Prospect record selected' : 'Prospect records selected'} for customized lead list order
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={handleCopySelectedEmails}
                className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg font-semibold transition cursor-pointer bg-slate-900 flex items-center gap-1.5"
                id="copy-selected-emails-btn"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                Copy Emails
              </button>
              <button
                onClick={handleDownloadSelectedCSV}
                className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg font-semibold transition cursor-pointer bg-slate-900 flex items-center gap-1.5"
                id="export-selected-csv-btn"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                Download CSV
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 border border-slate-750 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-lg font-semibold transition cursor-pointer bg-slate-900"
                id="clear-selection-btn"
              >
                Clear Selection
              </button>
              <button
                onClick={onTriggerSample}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
                id="extract-selected-contacts-btn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Unlock Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Visual Data Sample Modal */}
      <AnimatePresence>
        {isSampleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSampleModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-xl"
              id="sample-modal-backdrop"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl relative w-full max-w-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
              id="sample-modal-content"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-mono font-extrabold pb-0.5 uppercase px-2.5 py-0.5 rounded-full border border-amber-200">
                      Standard Outbound Format
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-extrabold pb-0.5 uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Triple-Verified
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl flex items-center gap-2 mt-1">
                    <Layers className="w-5 h-5 text-brand-600" />
                    Pristine CSV Lead Sample Record Preview
                  </h3>
                  <p className="text-slate-500 text-xs font-sans font-medium">
                    Behold our strict 3-tier validation standard. Every delivered list matches this high structural integrity.
                  </p>
                </div>
                <button
                  onClick={() => setIsSampleModalOpen(false)}
                  className="p-1.5 hover:bg-slate-150 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer bg-slate-100"
                  id="close-sample-modal-x-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Table Data Preview */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50/30">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-slate-100/60 border-b border-slate-150 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4 font-bold">Contact Name</th>
                          <th className="py-3 px-4 font-bold">Corporate Email</th>
                          <th className="py-3 px-4 font-bold">Company Target</th>
                          <th className="py-3 px-4 font-bold text-center">Verified Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { name: 'Sarah Jenkins', role: 'VP of Growth', email: 'sarah.jenkins@stripe.com', company: 'Stripe, Inc.', domain: 'stripe.com', status: 'Triple Verified' },
                          { name: 'Marcus Chen', role: 'Director of Demand Gen', email: 'marcus.chen@airbnb.com', company: 'Airbnb', domain: 'airbnb.com', status: 'Triple Verified' },
                          { name: 'Elena Rostova', role: 'Head of Outbound Strategy', email: 'elena.rostova@datadoghq.com', company: 'Datadog EMEA', domain: 'datadoghq.com', status: 'Triple Verified' },
                          { name: 'David Kofman', role: 'Senior Growth Lead', email: 'd.kofman@canva.com', company: 'Canva HQ', domain: 'canva.com', status: 'Triple Verified' },
                          { name: 'Amina Diallo', role: 'VP Corporate Strategy', email: 'amina.diallo@retrieval.io', company: 'Retrieval AI', domain: 'retrieval.io', status: 'Triple Verified' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition">
                            <td className="py-3.5 px-4 font-sans">
                              <span className="font-semibold text-slate-800 block">{row.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium block">{row.role}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600 font-sans">
                              <span className="bg-slate-100/80 px-2.5 py-1 rounded border border-slate-200/50 text-[11px] inline-flex items-center gap-1.5 group/modal-email relative">
                                <span>{row.email}</span>
                                <button
                                  onClick={() => handleCopyEmail(row.email)}
                                  title="Copy email"
                                  className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition flex items-center justify-center cursor-pointer"
                                  id={`copy-modal-email-${idx}`}
                                >
                                  {copiedEmail === row.email ? (
                                    <Check className="w-3 h-3 text-emerald-600 font-bold animate-fade-in" />
                                  ) : (
                                    <Copy className="w-3 h-3 opacity-60 group-hover/modal-email:opacity-100 transition-opacity" />
                                  )}
                                </button>
                                {copiedEmail === row.email && (
                                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow-lg font-sans font-medium whitespace-nowrap animate-bounce z-25">
                                    Copied!
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-sans">
                              <span className="font-medium text-slate-700 block">{row.company}</span>
                              <span className="text-[10px] text-slate-400 font-mono block">{row.domain}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                                <CheckCircle className="w-3 h-3 text-emerald-500 animate-pulse" />
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Validation Steps Explanation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-teal-50/40 border border-teal-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-teal-800 font-semibold text-xs font-display">
                      <div className="w-5 h-5 rounded-md bg-teal-100 flex items-center justify-center font-bold text-xs">1</div>
                      SMTP Handshake
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      Connects directly to the recipient mail server live to confirm exact mailbox storage space.
                    </p>
                  </div>
                  <div className="p-3 bg-brand-50/40 border border-brand-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-brand-800 font-semibold text-xs font-display">
                      <div className="w-5 h-5 rounded-md bg-brand-100 flex items-center justify-center font-bold text-xs">2</div>
                      Social Handle Cross
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      Crosscheck target identity profile across LinkedIn API and direct corporate directories.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs font-display">
                      <div className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center font-bold text-xs">3</div>
                      Domain Validation
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      Continuous monitoring of Domain Keys, MX Records, SPF configurations, and catch-all traps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-[10px] font-medium text-slate-400 font-sans hidden sm:inline">
                  * All files comply fully with GDPR & CAN-SPAM direct-mail rules.
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setIsSampleModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-xs transition cursor-pointer bg-white"
                    id="sample-modal-cancel-btn"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPdf}
                    className="px-4 py-2 border border-brand-200 hover:border-brand-300 text-brand-700 bg-brand-50 hover:bg-brand-100/70 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    id="sample-modal-pdf-btn"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-600" />
                    {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Report'}
                  </button>
                  <button
                    onClick={() => {
                      setIsSampleModalOpen(false);
                      onTriggerSample();
                    }}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs transition shadow-md shadow-brand-500/10 flex items-center gap-1.5 cursor-pointer"
                    id="sample-modal-submit-btn"
                  >
                    Request Custom Quote
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

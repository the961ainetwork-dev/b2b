import React, { useState, useEffect, useMemo } from 'react';
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
  FileText,
  HelpCircle,
  CheckSquare,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { MOCK_CONTACTS } from '../data';
import { ContactRecord } from '../types';

export default function RecordPreview({ onTriggerSample }: { onTriggerSample: () => void }) {
  const [contacts, setContacts] = useState<ContactRecord[]>(MOCK_CONTACTS);
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['ct-1', 'ct-3']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isCrmGuideModalOpen, setIsCrmGuideModalOpen] = useState(false);
  const [crmTab, setCrmTab] = useState<'hubspot' | 'salesforce'>('hubspot');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const checklistSteps = [
    { id: 1, text: "Ensure First and Last Names are split into distinct columns to avoid bulk merging anomalies." },
    { id: 2, text: "Verify email strings contain exactly one '@' separator to evade invalid string skips." },
    { id: 3, text: "Match country inputs to standard 2-digit ISO codes or validated text configurations." },
    { id: 4, text: "Set up a fallback team member owner before initiating your bulk integration process." },
    { id: 5, text: "Scrub currency prefixes from estimate inputs as standard systems require raw integers." },
    { id: 6, text: "Disable automated CRM alert sequences during the seed-in step to avoid spam triggers." }
  ];
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info'; visible: boolean } | null>(null);
  
  // Sorting states
  const [sortField, setSortField] = useState<'name' | 'company' | 'email' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'name' | 'company' | 'email') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

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
      const selectedContacts = contacts.filter(c => selectedIds.includes(c.id));
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
      const selectedContacts = contacts.filter(c => selectedIds.includes(c.id));
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

  const handleRemoveSelected = () => {
    const idsToRemove = [...selectedIds];
    const removedCount = idsToRemove.length;
    setContacts(prev => prev.filter(c => !idsToRemove.includes(c.id)));
    setSelectedIds([]);
    showToast(`Removed ${removedCount} records from active preview.`, 'info');
  };

  const handleRestoreContacts = () => {
    setContacts(MOCK_CONTACTS);
    setSelectedIds([]);
    showToast("Restored initial verified prospect list.", "success");
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

  const industriesPresent = ['All', ...Array.from(new Set(contacts.map(c => c.industry)))];

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return selectedIndustry === 'All' || contact.industry === selectedIndustry;

    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const company = contact.company.toLowerCase();
    const email = contact.email.toLowerCase();
    const title = contact.title.toLowerCase();
    const firstName = contact.firstName.toLowerCase();
    const lastName = contact.lastName.toLowerCase();

    const matchesSearch = 
      firstName.includes(query) ||
      lastName.includes(query) ||
      fullName.includes(query) ||
      company.includes(query) ||
      email.includes(query) ||
      title.includes(query);
    
    const matchesIndustry = selectedIndustry === 'All' || contact.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  const sortedContacts = useMemo(() => {
    if (!sortField) return filteredContacts;
    return [...filteredContacts].sort((a, b) => {
      let valA = '';
      let valB = '';
      if (sortField === 'name') {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortField === 'company') {
        valA = a.company.toLowerCase();
        valB = b.company.toLowerCase();
      } else if (sortField === 'email') {
        valA = a.email.toLowerCase();
        valB = b.email.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredContacts, sortField, sortOrder]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative" id="record-preview-system">
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
              onClick={() => setIsCrmGuideModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-blue-200 hover:border-blue-300 text-blue-800 bg-blue-50 hover:bg-blue-100/70 font-semibold text-xs rounded-xl transition cursor-pointer"
              id="view-crm-guide-btn"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              CRM Import Guide
            </button>
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
          <div className="relative md:col-span-7 flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Company, or Email in real-time..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-24 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              id="realtime-search-input"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 select-none pointer-events-none">
              <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold px-2.5 py-1 rounded-lg font-mono flex items-center shadow-sm">
                {filteredContacts.length} {filteredContacts.length === 1 ? 'record' : 'records'}
              </span>
            </div>
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
                  checked={sortedContacts.length > 0 && sortedContacts.every(c => selectedIds.includes(c.id))}
                  onChange={() => handleSelectAll(sortedContacts)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  title="Toggle all matching prospects"
                  id="select-all-contacts-checkbox"
                />
              </th>
              <th 
                onClick={() => handleSort('name')}
                className="py-4 px-6 cursor-pointer hover:bg-slate-200/50 hover:text-slate-800 transition select-none group/th"
                id="header-sort-name"
                title="Sort by Name"
              >
                <div className="flex items-center gap-1.5">
                  <span>Name / Title</span>
                  <span className="text-[10px] text-slate-400 group-hover/th:text-brand-600 transition">
                    {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('company')}
                className="py-4 px-4 cursor-pointer hover:bg-slate-200/50 hover:text-slate-800 transition select-none group/th"
                id="header-sort-company"
                title="Sort by Company"
              >
                <div className="flex items-center gap-1.5">
                  <span>Company Profile</span>
                  <span className="text-[10px] text-slate-400 group-hover/th:text-brand-600 transition">
                    {sortField === 'company' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('email')}
                className="py-4 px-4 cursor-pointer hover:bg-slate-200/50 hover:text-slate-800 transition select-none group/th"
                id="header-sort-email"
                title="Sort by Email"
              >
                <div className="flex items-center gap-1.5">
                  <span>Verified Business Email</span>
                  <span className="text-[10px] text-slate-400 group-hover/th:text-brand-600 transition">
                    {sortField === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </span>
                </div>
              </th>
              <th className="py-4 px-4">Direct Dial</th>
              <th className="py-4 px-4">Region</th>
              <th className="py-4 px-6 text-center">Data Integrity Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sortedContacts.length > 0 ? (
              sortedContacts.map((contact) => {
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

      {/* Floating Action Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40" id="floating-toolbar-wrapper">
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 350 }}
              className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-800 px-5 py-3.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs"
              id="selection-actions-bar"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span className="bg-amber-500 text-slate-950 font-mono text-xs px-2.5 py-1 rounded-lg font-bold flex items-center justify-center min-w-[24px] shadow-md animate-pulse">
                    {selectedIds.length}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-slate-100 flex items-center gap-1.5 leading-tight">
                    <span>{selectedIds.length === 1 ? 'Prospect Selected' : 'Prospects Selected'}</span>
                  </p>
                  <p className="text-slate-400 text-[10px] hidden sm:block font-sans">
                    Apply instant workflows or bulk edits to selection
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopySelectedEmails}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-755 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-650 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                  id="copy-selected-emails-btn"
                  title="Copy selected contact emails to clipboard"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-450" />
                  <span>Copy Emails</span>
                </button>

                <button
                  onClick={handleDownloadSelectedCSV}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-755 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-650 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                  id="export-selected-csv-btn"
                  title="Export selected contacts to CSV format"
                >
                  <Download className="w-3.5 h-3.5 text-slate-450" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={handleRemoveSelected}
                  className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/50 text-rose-455 hover:text-rose-300 border border-rose-900/40 hover:border-rose-800/60 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                  id="remove-selected-btn"
                  title="Remove selected prospects temporarily from this view-list"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Selected</span>
                </button>

                <div className="w-px h-5 bg-slate-800 mx-1 hidden sm:block" />

                <button
                  onClick={() => setSelectedIds([])}
                  className="px-2.5 py-2 hover:bg-slate-850 text-slate-450 hover:text-slate-200 rounded-xl font-medium transition cursor-pointer"
                  id="clear-selection-btn"
                  title="Clear all selections"
                >
                  <X className="w-4 h-4" />
                </button>

                <button
                  onClick={onTriggerSample}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 duration-150"
                  id="extract-selected-contacts-btn"
                  title="Request verified payload delivery"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Unlock</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Explorer Footer with statistics */}
      <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between text-xs gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            Showing {filteredContacts.length} verified sample records database entries.
          </p>
          {contacts.length < MOCK_CONTACTS.length && (
            <button
              onClick={handleRestoreContacts}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 transition cursor-pointer bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-200"
              id="restore-database-btn"
              title="Reset any deleted records and restore initial database sample"
            >
              <RotateCcw className="w-3 h-3 animate-spin duration-1000" style={{ animationDuration: '3s' }} />
              Restore Deleted ({MOCK_CONTACTS.length - contacts.length})
            </button>
          )}
        </div>
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

      {/* CRM Import Guide Modal */}
      <AnimatePresence>
        {isCrmGuideModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCrmGuideModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-xl"
              id="crm-modal-backdrop"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl relative w-full max-w-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
              id="crm-modal-content"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-mono font-extrabold pb-0.5 uppercase px-2.5 py-0.5 rounded-full border border-blue-200">
                      CRM Best Practices Handbook
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-extrabold pb-0.5 uppercase px-2.5 py-0.5 rounded-full border border-emerald-250 border-emerald-200">
                      Interactive Schema Vetting
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl flex items-center gap-2 mt-1">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    Interactive CRM Import Checklist &amp; Guide
                  </h3>
                  <p className="text-slate-500 text-xs font-sans font-medium">
                    Run through this quick sanity check to guarantee 100% duplicate-free, high-deliverability integration with HubSpot or Salesforce.
                  </p>
                </div>
                <button
                  onClick={() => setIsCrmGuideModalOpen(false)}
                  className="p-1.5 hover:bg-slate-150 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer bg-slate-100"
                  id="close-crm-modal-x-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Scroll Container */}
              <div className="p-6 overflow-y-auto space-y-6">

                {/* Interactive Checklist Section */}
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-150 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        Pre-Import Integrity Checklist
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans">Click steps to audit your export preparation</p>
                    </div>
                    {/* Completion Badge */}
                    <div className="text-right">
                      <span className="bg-blue-100 text-blue-800 font-mono text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                        {completedSteps.length} of {checklistSteps.length} Verified
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${(completedSteps.length / checklistSteps.length) * 100}%` }}
                    />
                  </div>

                  {/* Checklist items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {checklistSteps.map((step) => {
                      const isCompleted = completedSteps.includes(step.id);
                      return (
                        <button
                          key={step.id}
                          onClick={() => {
                            setCompletedSteps(prev => 
                              prev.includes(step.id) 
                                ? prev.filter(id => id !== step.id) 
                                : [...prev, step.id]
                            );
                          }}
                          className={`text-left p-3 rounded-xl border transition flex items-start gap-2 text-xs font-medium cursor-pointer ${
                            isCompleted 
                              ? 'bg-emerald-50/50 border-emerald-200 text-slate-750' 
                              : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600'
                          }`}
                          id={`crm-checklist-step-${step.id}`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                            isCompleted 
                              ? 'bg-emerald-500 border-emerald-600 text-white' 
                              : 'bg-white border-slate-300'
                          }`}>
                            {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span>{step.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive checklist state feedbacks */}
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-505 pt-1">
                    <div className="flex items-center gap-1 font-sans font-semibold text-slate-600">
                      {completedSteps.length === checklistSteps.length ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 animate-pulse bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-lg">
                          ✨ 100% Ready! Your file checklist is verified!
                        </span>
                      ) : (
                        <span>Verify all items to minimize duplicate risks.</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (completedSteps.length === checklistSteps.length) {
                            setCompletedSteps([]);
                          } else {
                            setCompletedSteps(checklistSteps.map(s => s.id));
                          }
                        }}
                        className="text-brand-600 hover:text-brand-700 transition cursor-pointer font-bold underline"
                      >
                        {completedSteps.length === checklistSteps.length ? 'Reset All' : 'Select All'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* CRM Specific Tabs */}
                <div className="space-y-4">
                  <div className="flex border-b border-slate-150">
                    <button
                      onClick={() => setCrmTab('hubspot')}
                      className={`px-4 py-2 text-xs font-bold font-display border-b-2 transition cursor-pointer -mb-px flex items-center gap-2 ${
                        crmTab === 'hubspot' 
                          ? 'border-orange-500 text-orange-600' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                      id="tab-hubspot-guide"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2.2]" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="7" r="2.5" />
                        <circle cx="7" cy="15.5" r="2.5" />
                        <circle cx="17" cy="15.5" r="2.5" />
                        <line x1="12" y1="9.5" x2="12" y2="13.5" />
                        <line x1="12" y1="13.5" x2="8.75" y2="13.5" />
                        <line x1="12" y1="13.5" x2="15.25" y2="13.5" />
                      </svg>
                      HubSpot Import Strategy
                    </button>
                    <button
                      onClick={() => setCrmTab('salesforce')}
                      className={`px-4 py-2 text-xs font-bold font-display border-b-2 transition cursor-pointer -mb-px flex items-center gap-2 ${
                        crmTab === 'salesforce' 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                      id="tab-salesforce-guide"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.1 10.3c-.2-.1-.4-.2-.6-.2h-.1c-1.1-2.4-3.5-3.9-6.1-3.6-2.1.2-3.9 1.5-4.7 3.4-.6-.4-1.3-.5-2-.4-1.7.3-3 1.8-3 3.5 0 2 1.6 3.6 3.6 3.6H19c1.7 0 3-1.4 3-3.1 0-1.8-1.3-3.1-2.9-3.2z" />
                      </svg>
                      Salesforce Import Strategy
                    </button>
                  </div>

                  {crmTab === 'hubspot' ? (
                    <div className="space-y-3">
                      <div className="bg-orange-50/40 p-4 border border-orange-100 rounded-2xl text-xs space-y-2 font-sans">
                        <span className="font-bold text-orange-850 uppercase tracking-wider text-[10px] bg-orange-100 px-2.5 py-0.5 rounded border border-orange-200">Vetted HubSpot Tactics</span>
                        <p className="text-slate-600 leading-relaxed text-xs">
                          HubSpot uses the <strong>Email</strong> property as the primary deduplication key for contacts, and <strong>Company Domain Name</strong> for companies. Ensure to map Zrolodex's Corporate Email exact string to HubSpot's email attribute; HubSpot will automatically create related company hubs for you as a native helper tool.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-blue-50/40 p-4 border border-blue-100 rounded-2xl text-xs space-y-2 font-sans">
                        <span className="font-bold text-blue-850 uppercase tracking-wider text-[10px] bg-blue-100 px-2.5 py-0.5 rounded border border-blue-200">Vetted Salesforce Tactics</span>
                        <p className="text-slate-600 leading-relaxed text-xs">
                          Salesforce imports should ideally go through the <strong>Data Import Wizard</strong> or <strong>Dataloader.io</strong>. Set up a custom deduplication rule on CRM Lead objects using <code>Email</code> to prevent redundant SDR allocation. Map Zrolodex's Revenue strings cleanly to your Annual Revenue numbers.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Header/Field Mapping Table */}
                  <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50/30">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-slate-100/60 border-b border-slate-150 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                            <th className="py-2.5 px-4 font-bold">Zrolodex CSV Column</th>
                            <th className="py-2.5 px-4 font-bold">Recommended CRM Property</th>
                            <th className="py-2.5 px-4 font-bold">Data Type</th>
                            <th className="py-2.5 px-4 font-bold">Import Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { col: 'First Name', crm: 'First Name / FirstName', type: 'Text (String)', req: 'Required' },
                            { col: 'Last Name', crm: 'Last Name / LastName', type: 'Text (String)', req: 'Required' },
                            { col: 'Email', crm: 'Email / Email Address', type: 'Email String', req: 'Required (De-duplicator)' },
                            { col: 'Phone', crm: 'Phone / MobilePhone', type: 'Phone Number', req: 'Optional' },
                            { col: 'Company', crm: 'Company Name / Company', type: 'Text (String)', req: 'Recommended' },
                            { col: 'Industry', crm: 'Industry / Sector', type: 'Dropdown Select', req: 'Optional' },
                            { col: 'Revenue', crm: 'Annual Revenue', type: 'Number (Currency)', req: 'Optional' },
                            { col: 'Country', crm: 'Billing Country / Region', type: 'Text (String)', req: 'Optional' }
                          ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition">
                              <td className="py-2.5 px-4 font-mono text-slate-750 text-[11px] font-semibold">
                                {row.col}
                              </td>
                              <td className="py-2.5 px-4 text-slate-650 font-medium">
                                {row.crm}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-slate-400 text-[10px]">
                                {row.type}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                  row.req.includes('Required') 
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {row.req}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-[10px] font-medium text-slate-400 font-sans hidden sm:inline">
                  Follow these rules to ensure perfect platform alignment.
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setCompletedSteps(checklistSteps.map(s => s.id));
                      showToast('All pre-import criteria confirmed!', 'success');
                    }}
                    className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-xs transition cursor-pointer bg-white"
                  >
                    Set All Verified
                  </button>
                  <button
                    onClick={() => setIsCrmGuideModalOpen(false)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                    id="close-crm-guide-btn-bottom"
                  >
                    Done Vetting
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

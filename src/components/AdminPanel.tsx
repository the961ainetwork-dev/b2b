import React, { useState } from 'react';
import { 
  Shield, 
  Settings, 
  FileText, 
  Layers, 
  Plus, 
  Check, 
  Trash2, 
  PenTool, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Globe, 
  Save, 
  RefreshCw,
  Search,
  MessageSquare,
  Activity,
  Award,
  Download
} from 'lucide-react';
import { TestimonialItem } from '../types';

export interface AdminSectionConfig {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  isVisible: boolean;
  order: number;
}

interface AdminPanelProps {
  onClose: () => void;
  // Shared Site Sections Configurations
  sections: AdminSectionConfig[];
  onUpdateSections: (newSections: AdminSectionConfig[]) => void;
  // Shared Stories Configurations
  stories: TestimonialItem[];
  onUpdateStories: (newStories: TestimonialItem[]) => void;
  // Site Name Settings
  siteTitle: string;
  onUpdateSiteTitle: (title: string) => void;
}

export default function AdminPanel({ 
  onClose, 
  sections, 
  onUpdateSections, 
  stories, 
  onUpdateStories,
  siteTitle,
  onUpdateSiteTitle
}: AdminPanelProps) {
  
  const [activeTab, setActiveTab] = useState<'sections' | 'stories' | 'branding'>('sections');
  
  // Alert banner states
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  const handleExportCMS = () => {
    try {
      const configPayload = {
        siteTitle,
        sections,
        stories,
        timestamp: new Date().toISOString(),
        environment: "Zrolodex CMS Engine"
      };
      
      const fileContent = JSON.stringify(configPayload, null, 2);
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const formattedTitle = siteTitle.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') || 'zrolodex_cms';
      a.download = `cms_config_${formattedTitle}_backup.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      triggerBanner("CMS configuration exported successfully! Check your downloads.");
    } catch (err) {
      console.error("Export failure", err);
      triggerBanner("Error: Could not compiled or initiate JSON download.");
    }
  };

  // States for creating a story
  const [storyName, setStoryName] = useState('');
  const [storyRole, setStoryRole] = useState('');
  const [storyCompany, setStoryCompany] = useState('');
  const [storyQuote, setStoryQuote] = useState('');
  const [storyRating, setStoryRating] = useState<number>(5);

  // States for creating a section
  const [secId, setSecId] = useState('');
  const [secName, setSecName] = useState('');
  const [secTitle, setSecTitle] = useState('');
  const [secSubtitle, setSecSubtitle] = useState('');

  const triggerBanner = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => {
      setSaveBanner(null);
    }, 4000);
  };

  // Section Manipulation
  const handleToggleSectionVisibility = (id: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s);
    onUpdateSections(updated);
    triggerBanner(`Section Visibility of "${id}" successfully updated in active preview!`);
  };

  const handleEditSectionText = (id: string, title: string, subtitle: string) => {
    const updated = sections.map(s => s.id === id ? { ...s, title, subtitle } : s);
    onUpdateSections(updated);
    triggerBanner(`Updated titles for section "${id}" in real time.`);
  };

  const handleMoveSection = (id: string, direction: 'up' | 'down') => {
    const targetIdx = sections.findIndex(s => s.id === id);
    if (targetIdx === -1) return;

    const newSections = [...sections];
    const swapWithIdx = direction === 'up' ? targetIdx - 1 : targetIdx + 1;

    if (swapWithIdx >= 0 && swapWithIdx < newSections.length) {
      // Swap order numbers
      const tempOrder = newSections[targetIdx].order;
      newSections[targetIdx].order = newSections[swapWithIdx].order;
      newSections[swapWithIdx].order = tempOrder;

      // Sort by order
      newSections.sort((a, b) => a.order - b.order);
      onUpdateSections(newSections);
      triggerBanner('Section layout order updated and propagated successfully.');
    }
  };

  // Create customized section
  const handleAddCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secId || !secName || !secTitle) {
      alert('Please fill out Section ID, Name, and Main Title.');
      return;
    }

    // Clean section ID to match anchor guidelines
    const sanitizedId = secId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    // Check duplication
    if (sections.some(s => s.id === sanitizedId)) {
      alert('A section with this ID already exists. Please choose a unique key.');
      return;
    }

    const nextOrder = Math.max(...sections.map(s => s.order), 0) + 1;
    const newSection: AdminSectionConfig = {
      id: sanitizedId,
      name: secName.trim(),
      title: secTitle.trim(),
      subtitle: secSubtitle.trim(),
      isVisible: true,
      order: nextOrder
    };

    onUpdateSections([...sections, newSection]);
    triggerBanner(`Custom section "${newSection.name}" has been created! Active on index layout.`);
    
    // Reset inputs
    setSecId('');
    setSecName('');
    setSecTitle('');
    setSecSubtitle('');
  };

  // Remove section
  const handleDeleteSection = (id: string) => {
    if (confirm(`Are you sure you want to remove section "${id}" from the main config?`)) {
      const updated = sections.filter(s => s.id !== id);
      onUpdateSections(updated);
      triggerBanner(`Section ${id} successfully removed from navigation tree and homepage.`);
    }
  };

  // Stories Manipulation
  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyName || !storyCompany || !storyQuote) {
      alert('Please fill in Name, Company, and Story quote text.');
      return;
    }

    const newStory: TestimonialItem = {
      id: `t-custom-${Date.now()}`,
      name: storyName.trim(),
      role: storyRole.trim() || 'Client Decision Maker',
      company: storyCompany.trim(),
      quote: storyQuote.trim(),
      rating: storyRating
    };

    onUpdateStories([newStory, ...stories]);
    triggerBanner(`Published success story by ${newStory.name} successfully updated list!`);

    // Reset inputs
    setStoryName('');
    setStoryRole('');
    setStoryCompany('');
    setStoryQuote('');
    setStoryRating(5);
  };

  const handleDeleteStory = (id: string) => {
    if (confirm('Are you sure you want to delete this success story?')) {
      const updated = stories.filter(st => st.id !== id);
      onUpdateStories(updated);
      triggerBanner('Deleted success story element on client-evaluations pipeline.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans text-base" id="admin-panel-canvas">
      
      {/* 1. Header Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-[110] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between" id="admin-nav-bar">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold uppercase tracking-widest text-amber-500">System Dashboard Portal</span>
              <span className="bg-slate-800 text-[11px] text-slate-400 font-mono font-medium px-1.5 py-0.5 rounded border border-slate-700">Root Accs</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
              CMS Engine &amp; Content Customizer
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCMS}
            className="bg-indigo-600 hover:bg-indigo-750 border border-indigo-500 hover:border-indigo-400 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer select-none flex items-center gap-1.5 shadow-lg shadow-indigo-600/10"
            id="export-cms-configs-btn"
            title="Download modern JSON backup of all sections and user stories"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CMS Configurations</span>
            <span className="sm:hidden">Export CMS</span>
          </button>

          <button 
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-slate-100 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer select-none"
            id="exit-admin-sandbox"
          >
            Return to App Homepage
          </button>
        </div>
      </nav>

      {/* Real-time sync notifications alert bar */}
      <div className="fixed top-20 right-6 z-[120] max-w-sm w-full space-y-2 pointer-events-none">
        {saveBanner && (
          <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500 flex items-start gap-3 pointer-events-auto animate-fade-in">
            <Check className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="text-sm font-mono font-bold block uppercase tracking-wide">Live Propagation Success</span>
              <p className="text-[13px] opacity-90 leading-tight">{saveBanner}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Core Columns Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="admin-main-grid">
        
        {/* Intro Alert */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden" id="admin-overview-jumbotron">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-1 text-amber-500 font-mono text-[12px] font-extrabold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Access Administration Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">
              Client-Side Dynamic CMS Workspace
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Welcome to the administrator hub. Here you have deep capabilities to toggle homepage section visibility, dynamically re-order index sequences, append and view mock customer stories, and update global parameters. Any tweaks committed here instantly update standard components without code recompilation.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shrink-0 self-start md:self-center">
            <Activity className="w-8 h-8 text-amber-500 animate-pulse" />
            <div className="space-y-0.5">
              <span className="text-[12px] text-slate-400 font-mono uppercase block">Active Sections</span>
              <span className="text-2xl font-mono font-black text-white leading-none">
                {sections.filter(s => s.isVisible).length} / {sections.length}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Controls: Navigator tabs */}
          <div className="lg:col-span-3 space-y-3.5">
            <span className="text-[12px] font-mono font-black text-slate-400 uppercase tracking-widest block px-1">
              Configuration Modules
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('sections')}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center gap-3.5 ${
                  activeTab === 'sections' 
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <Layers className="w-5 h-5 shrink-0" />
                <div className="text-left font-sans">
                  <span className="block text-sm font-bold leading-none">Homepage Sections</span>
                  <span className={`block text-[11px] mt-1 font-mono ${activeTab === 'sections' ? 'text-slate-900' : 'text-slate-500'}`}>
                    Portray &amp; Edit structural layouts
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stories')}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center gap-3.5 ${
                  activeTab === 'stories' 
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <FileText className="w-5 h-5 shrink-0" />
                <div className="text-left font-sans">
                  <span className="block text-sm font-bold leading-none">Published Stories</span>
                  <span className={`block text-[11px] mt-1 font-mono ${activeTab === 'stories' ? 'text-slate-900' : 'text-slate-500'}`}>
                    Formulate &amp; Correct case logs
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('branding')}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center gap-3.5 ${
                  activeTab === 'branding' 
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <div className="text-left font-sans">
                  <span className="block text-sm font-bold leading-none">Site Settings</span>
                  <span className={`block text-[11px] mt-1 font-mono ${activeTab === 'branding' ? 'text-slate-900' : 'text-slate-500'}`}>
                    Site title &amp; target parameters
                  </span>
                </div>
              </button>
            </div>

            {/* Quick Helper card */}
            <div className="bg-slate-900 border border-slate-800 uppercase p-4 rounded-2xl space-y-2 mt-4 text-[12px] text-slate-400 font-mono">
              <span className="font-extrabold text-amber-500 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Live Sandbox Synced
              </span>
              <p className="normal-case text-slate-500 leading-snug">
                Modifications committed here instantly manipulate components in the primary viewport overlay using React state propagation.
              </p>
            </div>
          </div>

          {/* Right Column content panel */}
          <div className="lg:col-span-9">
            
            {/* TAB 1: SECTION PORTRAYAL & EDITING */}
            {activeTab === 'sections' && (
              <div className="space-y-8 animate-fade-in" id="admin-tab-sections">
                
                {/* Visual grid layout list of all current sections */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                        Active Layout Tree
                      </h3>
                      <p className="text-sm text-slate-400">
                        Drag, adjust, rename, or toggle active state of pages sections. Lower items load first in scroll flow.
                      </p>
                    </div>
                    <span className="text-sm bg-slate-800 px-3 py-1 rounded text-slate-400 font-mono font-bold">
                      {sections.length} Sections Configured
                    </span>
                  </div>

                  <div className="space-y-3">
                    {sections.map((section, index) => {
                      return (
                        <div 
                          key={section.id}
                          className={`bg-slate-950 border p-4.5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition duration-150 ${
                            section.isVisible ? 'border-slate-800 hover:border-slate-700' : 'border-slate-900 opacity-50 bg-slate-950'
                          }`}
                        >
                          {/* Left handle, index order, names */}
                          <div className="flex items-start gap-3.5 min-w-0 flex-1">
                            {/* Order arrows */}
                            <div className="flex flex-col gap-1 items-center justify-center pt-0.5 shrink-0">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveSection(section.id, 'up')}
                                className="p-1 hover:bg-slate-800 text-slate-400 disabled:opacity-20 hover:text-white rounded transition"
                                title="Move Section Up"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <span className="text-[12px] font-mono font-bold text-slate-400">
                                {section.order}
                              </span>
                              <button
                                type="button"
                                disabled={index === sections.length - 1}
                                onClick={() => handleMoveSection(section.id, 'down')}
                                className="p-1 hover:bg-slate-800 text-slate-400 disabled:opacity-20 hover:text-white rounded transition"
                                title="Move Section Down"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Section info */}
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[11px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold">
                                  ID: {section.id}
                                </span>
                                <h4 className="text-sm font-bold text-slate-200">
                                  {section.name}
                                </h4>
                                {!section.isVisible && (
                                  <span className="text-[11px] bg-red-950/50 border border-red-900/50 text-red-400 px-1.5 py-0.2 rounded font-mono font-bold">
                                    HIDDEN
                                  </span>
                                )}
                              </div>
                              <div className="space-y-2 mt-2">
                                <input 
                                  type="text" 
                                  value={section.title}
                                  onChange={(e) => handleEditSectionText(section.id, e.target.value, section.subtitle)}
                                  className="w-full text-sm font-semibold bg-slate-900 border border-slate-800 focus:border-amber-500 focus:outline-none rounded px-2.5 py-1 text-white placeholder-slate-500 font-sans"
                                  placeholder="Active Title text parameter"
                                />
                                <input 
                                  type="text" 
                                  value={section.subtitle}
                                  onChange={(e) => handleEditSectionText(section.id, section.title, e.target.value)}
                                  className="w-full text-[13px] bg-slate-900 border border-slate-800 focus:border-amber-500 focus:outline-none rounded px-2.5 py-1 text-slate-400 placeholder-slate-500 font-sans"
                                  placeholder="Active Tagline/Subtitle text parameter"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Action elements right side */}
                          <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleSectionVisibility(section.id)}
                              className={`p-2.5 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                                section.isVisible 
                                  ? 'bg-slate-900 border-slate-800 text-amber-500 hover:text-amber-400 hover:bg-slate-820'
                                  : 'bg-red-950 border-red-900/50 text-red-400 hover:bg-red-900'
                              }`}
                              title={section.isVisible ? 'Hide Section' : 'Show Section'}
                            >
                              {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            {/* Delete custom ones safeguard */}
                            {section.id.startsWith('c-') || section.id.startsWith('custom-') ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteSection(section.id)}
                                className="p-2.5 bg-slate-900 border border-slate-800 text-red-400 hover:text-red-350 hover:bg-slate-850 rounded-xl transition cursor-pointer"
                                title="Delete Custom Section"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : null}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* FORM: Add Customized Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Plus className="w-5 h-5 text-amber-500 animate-pulse" />
                      Add a New Customized Section
                    </h3>
                    <p className="text-sm text-slate-400">
                      Generate a custom informational page drawer block to present custom corporate summaries. This will automatically inject layout items in the visual sequence.
                    </p>
                  </div>

                  <form onSubmit={handleAddCustomSection} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Unique Section Anchor ID * (e.g. "custom-special-offer")
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="custom-special-ads"
                        value={secId}
                        onChange={(e) => setSecId(e.target.value)}
                        className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Visual Component Admin Name * (e.g. "Summer Promo")
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Promo banner"
                        value={secName}
                        onChange={(e) => setSecName(e.target.value)}
                        className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2 col-span-1">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Homepage Display Header Title *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Direct access to 50,000+ localized verified phone indices"
                        value={secTitle}
                        onChange={(e) => setSecTitle(e.target.value)}
                        className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2 col-span-1">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Subtext / Tagline description paragraph
                      </label>
                      <input 
                        type="text" 
                        placeholder="Get custom enterprise integration metrics that match CRM inputs instantaneously..."
                        value={secSubtitle}
                        onChange={(e) => setSecSubtitle(e.target.value)}
                        className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white"
                      />
                    </div>

                    <div className="md:col-span-2 pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm px-5 py-3 rounded-2xl transition duration-150 cursor-pointer shadow-lg shadow-amber-500/10 flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Inject Custom Section into Homepage</span>
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* TAB 2: MANAGE STORIES & TESTIMONIALS */}
            {activeTab === 'stories' && (
              <div className="space-y-8 animate-fade-in" id="admin-tab-stories">
                
                {/* Visual List of Published Stories */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <MessageSquare className="w-5 h-5 text-amber-500 animate-pulse" />
                        Already Published Customer Success Stories ({stories.length})
                      </h3>
                      <p className="text-sm text-slate-400">
                        These stories are currently active on the main testimonials visual section of the site.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stories.map((story) => (
                      <div 
                        key={story.id}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative hover:border-slate-700 transition space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-base font-bold text-white leading-tight">
                                {story.name}
                              </h4>
                              <p className="text-[12px] text-amber-500 font-mono font-medium">
                                {story.role} at <span className="font-sans font-bold text-slate-300">{story.company}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded text-sm font-bold text-amber-500 border border-slate-800">
                              ★ <span>{story.rating}</span>
                            </div>
                          </div>

                          <p className="text-sm text-slate-400 italic leading-relaxed font-sans pt-1">
                            "{story.quote}"
                          </p>
                        </div>

                        {/* Control block */}
                        <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                            ID: {story.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteStory(story.id)}
                            className="text-[12px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Unpublish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create Fresh Story form */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <PenTool className="w-4 h-4 text-amber-500" />
                      Create &amp; Publish a New Success Story
                    </h3>
                    <p className="text-sm text-slate-400">
                      Add a simulation customer proof to showcase list quality or outbound volume capabilities dynamically on the client evaluations drawer.
                    </p>
                  </div>

                  <form onSubmit={handleAddStory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Customer Lead Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Richard Hendricks"
                        value={storyName}
                        onChange={(e) => setStoryName(e.target.value)}
                        className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Company Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. PiedPiper Technologies"
                        value={storyCompany}
                        onChange={(e) => setStoryCompany(e.target.value)}
                        className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Job Title/Role (optional)
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. VP of Enterprise Sales"
                        value={storyRole}
                        onChange={(e) => setStoryRole(e.target.value)}
                        className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Rating Assessment (1-5 Star Scale)
                      </label>
                      <select 
                        value={storyRating}
                        onChange={(e) => setStoryRating(parseInt(e.target.value))}
                        className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white"
                      >
                        <option value="5">★★★★★ - 5 Star Professional</option>
                        <option value="4">★★★★ - 4 Star Solid</option>
                        <option value="3">★★★ - 3 Star Average</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2 col-span-1">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Story Quote / Client Feedback Testimonial *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="We generated 250 enterprise SQL opportunities with Verified Lead Indexer. Their API appended missing direct mobiles automatically saving us hours..."
                        value={storyQuote}
                        onChange={(e) => setStoryQuote(e.target.value)}
                        className="w-full text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white font-sans"
                      />
                    </div>

                    <div className="md:col-span-2 pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm px-5 py-3 rounded-2xl transition duration-150 cursor-pointer shadow-lg shadow-amber-500/10 flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Publish Success Story Live</span>
                      </button>
                    </div>

                  </form>
                </div>

              </div>
            )}

            {/* TAB 3: SYSTEM CONFIG & BRANDING */}
            {activeTab === 'branding' && (
              <div className="space-y-8 animate-fade-in" id="admin-tab-branding">
                
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                      Global Client Branding Parameters
                    </h3>
                    <p className="text-sm text-slate-400">
                      Manage visual identity metadata parsed across header scopes and footers.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Active Portal Brand Site Title
                      </label>
                      <div className="flex gap-2">
                        <input 
                           type="text" 
                           value={siteTitle}
                           onChange={(e) => onUpdateSiteTitle(e.target.value)}
                           className="flex-1 text-sm bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:outline-none text-white font-bold"
                           placeholder="e.g. Verified Lead Indexer"
                        />
                        <button
                          type="button"
                          onClick={() => triggerBanner('Branding title applied live.')}
                          className="bg-slate-800 hover:bg-slate-750 text-white font-mono text-sm px-4 rounded-xl border border-slate-700 font-bold"
                        >
                          Verify Update
                        </button>
                      </div>
                    </div>

                    {/* Metadata summary */}
                    <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-2xl space-y-2 text-sm">
                      <span className="font-mono text-[11px] font-extrabold text-amber-500 uppercase block tracking-wider">
                        Virtual API Pipeline Environment variables
                      </span>
                      <div className="grid grid-cols-2 gap-3 text-slate-400 font-mono text-[12px]">
                        <div>SLA Deliverability target: <strong className="text-white">95% Guaranteed</strong></div>
                        <div>CRM Endpoints: <strong className="text-white">DNC Active check</strong></div>
                        <div>Primary Index scope: <strong className="text-white">7.2M Active corporate rows</strong></div>
                        <div>API Handshake key: <strong className="text-white">System AES-256</strong></div>
                      </div>
                    </div>

                    {/* Backup & Export segment */}
                    <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3" id="cms-backup-settings-card">
                      <div>
                        <span className="font-mono text-[11px] font-extrabold text-indigo-400 uppercase block tracking-wider">
                          Configuration Backup &amp; Portability
                        </span>
                        <h4 className="text-sm font-bold text-slate-200 mt-1">
                          Export Layout Configurations
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">
                          Compile your configured homepage layouts, metadata, custom titles, reordered hierarchies, and active success stories into a standardized JSON schema file. Use this file to migrate settings or preserve backups.
                        </p>
                      </div>

                      <div className="pt-2 flex">
                        <button
                          type="button"
                          onClick={handleExportCMS}
                          className="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:scale-[1.02] active:scale-95 duration-150"
                          id="export-cms-branding-tab-btn"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Configs Payload (.json)</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  Search, 
  Loader2, 
  Sparkles, 
  Database, 
  AlertCircle,
  Mail,
  Server,
  Fingerprint,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface ValidationStep {
  id: 'syntax' | 'mx' | 'smtp' | 'catchall';
  label: string;
  description: string;
  status: 'idle' | 'checking' | 'success' | 'failed' | 'warning';
  outputLog?: string;
}

export default function EmailVerifierWidget() {
  const [emailInput, setEmailInput] = useState('satya.nadella@microsoft.com');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [showResultCard, setShowResultCard] = useState(false);
  const [qualityScore, setQualityScore] = useState<number>(0);
  const [verdict, setVerdict] = useState<'deliverable' | 'risky' | 'undeliverable' | null>(null);
  const [verdictReason, setVerdictReason] = useState('');
  
  // Log flow details
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [steps, setSteps] = useState<ValidationStep[]>([
    { id: 'syntax', label: 'Syntax Structure Check', description: 'Validate local-part, character sets, and @ format structure conforms to RFC standard.', status: 'idle' },
    { id: 'mx', label: 'Domain MX Record Resolution', description: 'Query nameservers to fetch active mail exchanger (MX) priority records.', status: 'idle' },
    { id: 'smtp', label: 'SMTP Connection Handshake', description: 'Establish deep virtual connection layer to query inbox existence without sending mail.', status: 'idle' },
    { id: 'catchall', label: 'Catch-All Server Safeguard', description: 'Verify if domain dynamically maps all incoming emails regardless of local name prefix.', status: 'idle' }
  ]);

  // Demo suggestions
  const SUGGESTIONS = [
    { email: 'satya.nadella@microsoft.com', label: 'Valid Brand Corp' },
    { email: 'bill.gates@foundations.org', label: 'Non-Profit VIP' },
    { email: 'contact@bogus-bouncing-domain.xyz', label: 'Fake/Dead Domain' },
    { email: 'support@gmail.com', label: 'Catch-All Consumer' }
  ];

  // Auto scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (msg: string, delay: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
        resolve();
      }, delay);
    });
  };

  const updateStepStatus = (id: string, status: ValidationStep['status'], logOutput?: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status, outputLog: logOutput } : s));
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput || isRunning) return;

    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle', outputLog: undefined })));
    setLogs([]);
    setIsRunning(true);
    setShowResultCard(false);
    setCurrentStepIndex(0);

    const targetEmail = emailInput.trim();
    const domain = targetEmail.split('@')[1] || '';
    const username = targetEmail.split('@')[0] || '';

    await addLog(`Initializing real-time lookup for target: ${targetEmail}`, 100);

    // 1. SYNTAX CHECK
    setCurrentStepIndex(0);
    updateStepStatus('syntax', 'checking');
    await addLog(`Syntax analysis: validating string pattern against RFC-5322...`, 400);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidSyntax = emailRegex.test(targetEmail) && username.length > 0 && domain.length > 0;

    if (!isValidSyntax) {
      updateStepStatus('syntax', 'failed', 'Invalid format detected. Missing @ symbol or top-level-domain suffix.');
      await addLog(`🔴 Syntax Validation Failed: Format does not match general mail exchange paradigms.`, 200);
      setVerdict('undeliverable');
      setQualityScore(0);
      setVerdictReason('The syntax format is incorrect. Ensure there are no invalid special characters, double dots or spacing issues.');
      setShowResultCard(true);
      setIsRunning(false);
      return;
    }

    updateStepStatus('syntax', 'success', 'Valid RFC syntax structure.');
    await addLog(`🟢 Syntax Validation Passed. Local-part length: ${username.length} characters. Domain: ${domain}`, 300);

    // 2. MX RECORD RESOLUTION
    setCurrentStepIndex(1);
    updateStepStatus('mx', 'checking');
    await addLog(`MX query: Resolving DNS record for host "${domain}"...`, 605);

    const isBogusDomain = domain.includes('bogus-bouncing-domain') || domain.endsWith('.xyz') && !targetEmail.includes('nadella');
    
    if (isBogusDomain) {
      updateStepStatus('mx', 'failed', `NXDOMAIN error pointing to "${domain}". No MX pointers located.`);
      await addLog(`🔴 DNS Query Failed: MX records not found for host "${domain}". Domain is likely offline or inactive.`, 300);
      setVerdict('undeliverable');
      setQualityScore(12);
      setVerdictReason(`DNS resolution failed. "${domain}" has no registered MX priority entries in global nameservers. Emails will bounce instantly.`);
      setShowResultCard(true);
      setIsRunning(false);
      return;
    }

    // Standard simulated mail servers
    const mxHost = `mx1.${domain}.mail.protection.outlook.com`;
    updateStepStatus('mx', 'success', `DNS Resolved: 1 primary MX record found (${mxHost}, Priority: 10)`);
    await addLog(`🟢 MX records resolved successfully for host "${domain}". Pointing server: ${mxHost}`, 400);

    // 3. SMTP CONNECTION HANDSHAKE
    setCurrentStepIndex(2);
    updateStepStatus('smtp', 'checking');
    await addLog(`SMTP Handshake: Establishing secure socket layer block on port 25...`, 500);
    await addLog(`>>> CONNECT to ${mxHost}:25 [Status: CONNECTING]`, 200);
    await addLog(`<<< 220 Microsoft ESMTP MAIL Service ready at ${new Date().toUTCString()}`, 300);
    await addLog(`>>> EHLO mail.verified-indexer-copilot.org`, 200);
    await addLog(`<<< 250-nd1-mail-protection.microsoft.com Hello, pleased to meet you`, 300);
    await addLog(`>>> MAIL FROM:<sdr-verifier@verified-lead-indexer.com>`, 200);
    await addLog(`<<< 250 2.1.0 Sender OK`, 250);
    await addLog(`>>> RCPT TO:<${targetEmail}>`, 300);

    const isDeadInbox = targetEmail.includes('bouncing') || targetEmail.includes('dead') || targetEmail.includes('bounces');
    
    if (isDeadInbox) {
      await addLog(`<<< 550 5.1.1 User "${username}" is unavailable or disabled at recipient address block`, 300);
      updateStepStatus('smtp', 'failed', 'SMTP 550: Mailbox unavailable / Recipient disabled.');
      await addLog(`🔴 SMTP handshake failed: 550 User Unknown error code response. Inboxes do not exist.`, 200);
      setVerdict('undeliverable');
      setQualityScore(15);
      setVerdictReason(`The user inbox does not exist on target host "${domain}". Recipient server rejected user address parameter explicitly.`);
      setShowResultCard(true);
      setIsRunning(false);
      return;
    }

    await addLog(`<<< 250 2.1.5 Recipient test address OK`, 300);
    await addLog(`>>> QUIT`, 150);
    await addLog(`<<< 221 2.0.0 Service closing transmission channel`, 200);
    
    updateStepStatus('smtp', 'success', 'SMTP recipient valid: 250 OK Address accepted.');
    await addLog(`🟢 SMTP handshake complete. Real-time handshake confirms target mailbox exist in ACTIVE state.`, 300);

    // 4. CATCH-ALL SERVER SAFEGUARD
    setCurrentStepIndex(3);
    updateStepStatus('catchall', 'checking');
    await addLog(`Catch-All scanning: generating randomized verification probe address...`, 500);
    
    const randomPrefix = `probe_${Math.random().toString(36).substring(4, 10)}`;
    const randomProbeEmail = `${randomPrefix}@${domain}`;
    await addLog(`>>> Verification probe sent to: ${randomProbeEmail}`, 200);

    const isGmailOrConsumer = domain === 'gmail.com' || domain === 'yahoo.com' || domain === 'outlook.com';
    const isCatchAllDomain = isGmailOrConsumer || domain.includes('foundations');

    if (isCatchAllDomain) {
      await addLog(`<<< 250 2.1.5 Recipient probe address OK (Catch-All Server detected)`, 400);
      updateStepStatus('catchall', 'warning', 'Catch-all setting detected. Domain accepts custom wildcards.');
      await addLog(`⚠️ Server Safeguard Alert: Host accepts all mail traffic. Validation depth shifted to primary index analysis.`, 200);
      
      setVerdict('risky');
      setQualityScore(72);
      setVerdictReason(`This domain is set as a Catch-All. It accepts all custom prefixes to avoid revealing actual accounts. Deliverability is moderately high but requires secondary verification.`);
    } else {
      await addLog(`<<< 550 5.1.1 User "${randomPrefix}" rejected (Verified Non-Catch-All Domain)`, 400);
      updateStepStatus('catchall', 'success', 'Verified dedicated mailbox. Catch-all disabled.');
      await addLog(`🟢 Catch-All scan passed: Server isolates true addresses.`, 200);

      setVerdict('deliverable');
      setQualityScore(98);
      setVerdictReason(`Successfully fully-verified. The target email matches an active human inbox on hosting servers and is completely safe to email.`);
    }

    setShowResultCard(true);
    setIsRunning(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 md:p-8 space-y-6" id="realtime-email-verifier">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Mail className="w-4 h-4 text-brand-600" />
            <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-brand-600">SMTP Handshake Simulation</span>
          </div>
          <h3 className="text-xl font-display font-medium text-slate-900">
            Real-Time Triple Email Verifier
          </h3>
          <p className="text-xs text-slate-500">
            Test any single address inside our Sandbox to observe syntax compliance, DNS records lookup, and custom SMTP handshake query loops.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full text-brand-700 text-[10px] font-mono font-bold shrink-0 self-start sm:self-center uppercase">
          <Fingerprint className="w-3.5 h-3.5" />
          <span>RFC Syntax Standard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Control Input Block */}
        <div className="lg:col-span-5 space-y-5">
          <form onSubmit={handleVerify} className="space-y-3.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono block">
              Enter target email to probe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                @
              </span>
              <input
                type="text"
                placeholder="e.g. name@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={isRunning}
                className="w-full pl-8 pr-12 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 focus:outline-none placeholder-slate-400 text-slate-800 text-sm font-sans transition shadow-inner"
              />
              {emailInput && !isRunning && (
                <button
                  type="button"
                  onClick={() => setEmailInput('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isRunning || !emailInput}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs select-none shadow-md transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isRunning 
                  ? 'bg-slate-100 text-slate-404 text-slate-400 cursor-not-allowed border border-slate-200' 
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/10'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning Mailbox Server...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Verify Deliverability Now</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox Target Suggestions */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
              Sandbox Test Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTIONS.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  disabled={isRunning}
                  onClick={() => setEmailInput(preset.email)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition duration-150 cursor-pointer ${
                    emailInput === preset.email 
                      ? 'bg-brand-50 border-brand-500 text-brand-900 font-medium' 
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="font-bold block truncate text-[10px] sm:text-[11px] leading-tight">
                    {preset.label}
                  </span>
                  <span className="font-mono text-[9px] text-slate-400 block truncate mt-0.5">
                    {preset.email}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Verification Steps Dashboard Pipeline list */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
              Validation Pipeline Status
            </span>
            <div className="space-y-2.5">
              {steps.map((step, idx) => (
                <div 
                  key={step.id}
                  className={`flex gap-3 items-start text-xs p-2 rounded-xl transition ${
                    step.status === 'checking' ? 'bg-slate-50 border border-slate-200/50' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {step.status === 'idle' && (
                      <div className="w-4.5 h-4.5 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 font-bold text-[9px]">
                        {idx + 1}
                      </div>
                    )}
                    {step.status === 'checking' && (
                      <Loader2 className="w-4.5 h-4.5 text-brand-600 animate-spin" />
                    )}
                    {step.status === 'success' && (
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    {step.status === 'warning' && (
                      <div className="w-4.5 h-4.5 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                        <AlertCircle className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    {step.status === 'failed' && (
                      <div className="w-4.5 h-4.5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                        <X className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-bold transition ${
                        step.status === 'checking' ? 'text-brand-600' :
                        step.status === 'success' ? 'text-slate-800' :
                        step.status === 'failed' ? 'text-red-700' : 'text-slate-700'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      {step.outputLog || step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Output Verdict & Logs Console Block */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Server Query Dialog Log Box */}
          <div className="bg-slate-950 rounded-2xl p-4 md:p-5 flex-1 flex flex-col min-h-[180px] font-mono border border-slate-800 relative shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                Live Handshake Logs
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto text-[10px] sm:text-[11px] text-slate-300 space-y-1.5 max-h-[220px]">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-550 text-slate-600 space-y-2 py-8 select-none">
                  <TerminalIcon className="w-6 h-6 text-slate-700" />
                  <p>Console idle. Feed target address and run to observe TCP logs.</p>
                </div>
              ) : (
                logs.map((log, lIdx) => (
                  <div key={lIdx} className="leading-relaxed">
                    {log.includes('🟢') && <span className="text-emerald-400">{log}</span>}
                    {log.includes('🔴') && <span className="text-red-400">{log}</span>}
                    {log.includes('⚠️') && <span className="text-amber-400">{log}</span>}
                    {!log.includes('🟢') && !log.includes('🔴') && !log.includes('⚠️') && <span>{log}</span>}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Quality Deliverability Verdict Card */}
          <AnimatePresence>
            {showResultCard && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Scan Verdict Outcome</span>
                    <h4 className="text-sm font-bold text-slate-800 leading-none">
                      Verification Result:
                    </h4>
                  </div>
                  <div>
                    {verdict === 'deliverable' && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Deliverable</span>
                      </span>
                    )}
                    {verdict === 'risky' && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-100 font-mono font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Catch-All Info</span>
                      </span>
                    )}
                    {verdict === 'undeliverable' && (
                      <span className="bg-red-50 text-red-800 border border-red-105 font-mono font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                        <X className="w-4 h-4 text-red-600" />
                        <span>Undeliverable</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Score circle gauge */}
                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-150/80 shadow-sm relative">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-black tracking-wider block mb-1">
                      Deliverability
                    </span>
                    <div className="relative flex items-center justify-center">
                      {/* SVG Gauge loop background */}
                      <svg className="w-18 h-18 transform -rotate-90">
                        <circle cx="36" cy="36" r="30" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                        <circle 
                          cx="36" 
                          cy="36" 
                          r="30" 
                          fill="transparent" 
                          stroke={verdict === 'deliverable' ? '#10b981' : verdict === 'risky' ? '#f59e0b' : '#ef4444'} 
                          strokeWidth="6" 
                          strokeDasharray={2 * Math.PI * 30}
                          strokeDashoffset={2 * Math.PI * 30 * (1 - qualityScore / 100)}
                        />
                      </svg>
                      <span className="absolute text-sm font-semibold font-mono text-slate-800">
                        {qualityScore}%
                      </span>
                    </div>
                  </div>

                  {/* Informational Reason details */}
                  <div className="sm:col-span-8 text-xs text-slate-600 leading-relaxed font-sans space-y-1.5">
                    <p className="font-bold text-slate-800">Diagnostic Details:</p>
                    <p>{verdictReason}</p>
                  </div>
                  
                </div>

                {/* Footnote banner */}
                <div className="bg-white border border-slate-150 p-3 rounded-xl flex items-start gap-2.5 text-[10px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                  <p className="leading-normal font-sans">
                    To automate this sandbox validation flow at scale, upload CSV sheets directly in our <strong className="text-slate-600">B2B Data Appending Sandbox</strong> panel down below. Verified Lead Indexer safeguards your send reputability.
                  </p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}

// Inline fallback mini helper for terminal visual
function TerminalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

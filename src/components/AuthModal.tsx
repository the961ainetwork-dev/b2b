import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Briefcase, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onLoginSuccess: (email: string, name: string, isAdmin: boolean) => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Registration States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regIndustry, setRegIndustry] = useState('Technology & SaaS');
  const [regIsAdmin, setRegIsAdmin] = useState(false);

  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper to retrieve users from localStorage
  const getStoredUsers = () => {
    try {
      const users = localStorage.getItem('zrolodex_users');
      if (users) return JSON.parse(users);
    } catch (e) {
      console.error('Error reading localStorage users', e);
    }
    return [
      {
        email: 'admin@zrolodex.live',
        password: 'admin',
        name: 'GTM Operations Lead',
        company: 'Zrolodex Admin Desk',
        industry: 'B2B Leads Provider',
        isAdmin: true
      },
      {
        email: 'demo@zrolodex.live',
        password: 'demo',
        name: 'Jane Doe',
        company: 'Growth Corp',
        industry: 'Technology & SaaS',
        isAdmin: false
      }
    ];
  };

  const handleDemoSignIn = (type: 'admin' | 'user') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setMode('signin');
    if (type === 'admin') {
      setLoginEmail('admin@zrolodex.live');
      setLoginPassword('admin');
    } else {
      setLoginEmail('demo@zrolodex.live');
      setLoginPassword('demo');
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please fulfill all credentials fields.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getStoredUsers();
      const matchedUser = users.find(
        (u: any) => u.email.toLowerCase().trim() === loginEmail.toLowerCase().trim()
      );

      if (!matchedUser) {
        setErrorMsg('Invalid email. Try using demo@zrolodex.live or admin@zrolodex.live');
        setIsLoading(false);
        return;
      }

      if (matchedUser.password !== loginPassword) {
        setErrorMsg('Incorrect password. (Admin is "admin", Demo is "demo")');
        setIsLoading(false);
        return;
      }

      // Success Login
      setSuccessMsg(`Welcome back, ${matchedUser.name}!`);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(matchedUser.email, matchedUser.name, !!matchedUser.isAdmin);
        onClose();
        // Reset states
        setLoginEmail('');
        setLoginPassword('');
      }, 1000);
    }, 1200);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Please fulfill all required fields.');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg('Password should be at least 4 characters for testing.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const currentUsers = getStoredUsers();
      const userExists = currentUsers.some(
        (u: any) => u.email.toLowerCase().trim() === regEmail.toLowerCase().trim()
      );

      if (userExists) {
        setErrorMsg('This business email is already registered here.');
        setIsLoading(false);
        return;
      }

      // Create new user object
      const newUser = {
        name: regName.trim(),
        email: regEmail.toLowerCase().trim(),
        password: regPassword,
        company: regCompany.trim() || 'Unlisted Company',
        industry: regIndustry,
        isAdmin: regIsAdmin
      };

      const updatedUsers = [...currentUsers, newUser];
      try {
        localStorage.setItem('zrolodex_users', JSON.stringify(updatedUsers));
      } catch (err) {
        console.error('LocalStorage write error', err);
      }

      setSuccessMsg(`Account created for ${newUser.name}! Redirecting to Sign In...`);
      
      setTimeout(() => {
        setIsLoading(false);
        // Switch mode to signin
        setMode('signin');
        setLoginEmail(newUser.email);
        setLoginPassword(newUser.password);
        setSuccessMsg(null);
        // Clear registration states
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegCompany('');
        setRegIsAdmin(false);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        id="auth-modal-backdrop"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden z-10 font-sans"
        id="auth-modal-panel"
      >
        {/* Banner with style accent */}
        <div className="bg-gradient-to-r from-brand-700 to-indigo-650 p-6 text-white relative">
          <div className="absolute right-4 top-4">
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-1 pr-10">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-amber-300">
                Authorized GTM Space
              </span>
            </div>
            <h3 className="text-xl font-bold font-display tracking-tight text-white">
              {mode === 'signin' ? 'Sign In to Your Workspace' : 'Instantiate GTM Campaign Profile'}
            </h3>
            <p className="text-xs text-brand-100 font-normal">
              {mode === 'signin' 
                ? 'Resume triple-verified bulk exports and direct outreach flows.' 
                : 'Join 2,000+ demand planners and configure verification bounds.'}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Tabs header selector */}
          <div className="grid grid-cols-2 bg-slate-100 rounded-xl p-1 text-xs">
            <button
              onClick={() => { setMode('signin'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 px-3 rounded-lg font-bold transition duration-150 cursor-pointer ${
                mode === 'signin' 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 px-3 rounded-lg font-bold transition duration-150 cursor-pointer ${
                mode === 'signup' 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-850'
              }`}
            >
              Create Account (Sign Up)
            </button>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-xs flex items-start gap-2"
              id="auth-error-alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-semibold leading-relaxed">{errorMsg}</p>
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex items-start gap-2"
              id="auth-success-alert"
            >
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <p className="font-semibold leading-relaxed">{successMsg}</p>
            </motion.div>
          )}

          {/* FORMS CONTAINER */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4" id="signin-interactive-form">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Business Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. planner@growthcorp.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Workspace Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl pl-9 pr-10 py-2.5 text-xs focus:outline-none transition-all duration-200 font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-650 hover:bg-brand-750 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer shadow-lg shadow-brand-550/10 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying Workspace...</span>
                  </>
                ) : (
                  <span>Access Secure Dashboard</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-4" id="signup-interactive-form">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Corporate Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. jane@acme.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Set Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="At least 4 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Niche Focus Focus
                  </label>
                  <select
                    value={regIndustry}
                    onChange={(e) => setRegIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl px-2.5 py-2.5 text-xs focus:outline-none text-slate-700 cursor-pointer"
                  >
                    <option value="Technology & SaaS">Technology &amp; SaaS</option>
                    <option value="Medical & BioTech">Medical &amp; BioTech</option>
                    <option value="Legal & Advisory">Legal &amp; Advisory</option>
                    <option value="Real Estate & Dev">Real Estate &amp; Dev</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-1 flex flex-col justify-end">
                  <label className="flex items-center gap-2 py-2 px-1 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={regIsAdmin}
                      onChange={(e) => setRegIsAdmin(e.target.checked)}
                      className="ml-2 w-4 h-4 accent-amber-500 cursor-pointer rounded"
                    />
                    <div className="text-left">
                      <span className="block text-[9.5px] font-extrabold text-slate-750 uppercase leading-none">
                        Admin Privileges
                      </span>
                      <span className="block text-[8px] text-slate-400 -mt-0.5 font-normal">
                        Grant CMS access
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-655 bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer shadow-lg shadow-indigo-500/10 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Generating Credentials...</span>
                  </>
                ) : (
                  <span>Compile GTM Account</span>
                )}
              </button>
            </form>
          )}

          {/* Quick Sandbox Demolink Shortcuts wrapper */}
          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs" id="auth-sandbox-quicktest">
            <span className="font-mono text-[9px] text-slate-400 font-extrabold uppercase block tracking-wider">
              Quick Test Demo Actions (Click to Auto-fill credentials)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoSignIn('admin')}
                className="flex items-center gap-1.5 p-2 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-200 rounded-xl transition text-left cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <div>
                  <span className="block leading-tight">Admin CMS Desk</span>
                  <span className="block text-[8.5px] text-amber-700 font-mono font-medium -mt-0.5">admin@zrolodex.live</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn('user')}
                className="flex items-center gap-1.5 p-2 bg-blue-50/60 hover:bg-blue-100/80 text-blue-950 font-bold border border-blue-200 rounded-xl transition text-left cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <div>
                  <span className="block leading-tight">Standard Demo User</span>
                  <span className="block text-[8.5px] text-blue-700 font-mono font-medium -mt-0.5">demo@zrolodex.live</span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

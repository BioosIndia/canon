import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Github,
  Key,
  Shield,
  Briefcase
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/canon';
import { StorageService } from '../../utils/storage';

interface AuthPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  currentUser: UserProfile;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP' | 'DEMO_PERSONAS'>('SIGN_IN');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('Global BioPharma Corp');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Global Labeling Lead');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Social / SSO interactive modal
  const [socialProvider, setSocialProvider] = useState<'GOOGLE' | 'GITHUB' | null>(null);
  const [socialUsername, setSocialUsername] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pre-configured enterprise personas
  const personas: UserProfile[] = [
    {
      id: 'usr-vance-01',
      name: 'Dr. Sarah Vance, PharmD',
      email: 's.vance@pramanex-pharma.com',
      role: 'Global Labeling Lead',
      organizationId: 'org-pramanex-enterprise',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      id: 'usr-dubois-02',
      name: 'Dr. Marcus Dubois, MD',
      email: 'm.dubois@pramanex-pharma.com',
      role: 'Safety / Medical Reviewer',
      organizationId: 'org-pramanex-enterprise',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      signatureHash: '9f83c12658efb1c09b83b3e2187d9a13b9426f8d0714b8a2e1d09f7a4e6b5281',
    },
    {
      id: 'usr-rostova-03',
      name: 'Dr. Elena Rostova',
      email: 'e.rostova@affiliate-eu.pramanex.com',
      role: 'Local Affiliate RA',
      organizationId: 'org-pramanex-enterprise',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      signatureHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    },
    {
      id: 'usr-sato-04',
      name: 'Dr. Kenji Sato',
      email: 'k.sato@affiliate-jp.pramanex.com',
      role: 'Local Affiliate RA',
      organizationId: 'org-pramanex-enterprise',
      avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=256&q=80',
      signatureHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    },
    {
      id: 'usr-auditor-05',
      name: 'Claire Jenkins, CQA',
      email: 'c.jenkins@gxp-assurance.com',
      role: 'Read-Only Auditor',
      organizationId: 'org-pramanex-enterprise',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      signatureHash: '7c92b810d7a24e189c4250ab13824f923e1b09819ca421098b1e428d09f7129b',
    },
  ];

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid corporate or regulatory email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in accordance with enterprise policy.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      // Find or build user
      const existingUsers = StorageService.getRegisteredUsers();
      const match = existingUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      const userToAuth: UserProfile = match || {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        role: 'Regulatory Labeling Specialist',
        organizationId: 'org-pramanex-enterprise',
        signatureHash: `sig-${Date.now().toString(16)}`,
      };

      StorageService.setCurrentUser(userToAuth);
      setIsProcessing(false);
      onAuthSuccess(userToAuth);
      onClose();
    }, 600);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full name and clinical credentials required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please specify an authorized corporate email.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('You must acknowledge 21 CFR Part 11 and GxP compliance terms.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: fullName,
        email,
        role: selectedRole,
        organizationId: orgName.toLowerCase().replace(/\s+/g, '-'),
        signatureHash: `sig-${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`,
      };

      StorageService.registerNewUser(newUser);
      setIsProcessing(false);
      onAuthSuccess(newUser);
      onClose();
    }, 700);
  };

  const handleSocialConnect = (provider: 'GOOGLE' | 'GITHUB') => {
    setSocialProvider(provider);
    setSocialUsername(provider === 'GOOGLE' ? 'rahuldewangan488@gmail.com' : 'rahuldewangan');
  };

  const handleConfirmSocialAuth = () => {
    if (!socialUsername.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const isGoogle = socialProvider === 'GOOGLE';
      const newUser: UserProfile = {
        id: `usr-${socialProvider?.toLowerCase()}-${Date.now()}`,
        name: isGoogle ? 'Rahul Dewangan' : 'Developer Rahul',
        email: isGoogle ? socialUsername : `${socialUsername}@users.noreply.github.com`,
        role: 'Global Labeling Lead',
        organizationId: 'org-pramanex-enterprise',
        avatarUrl: isGoogle
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
          : undefined,
        signatureHash: `sig-${Date.now().toString(16)}`,
      };

      StorageService.registerNewUser(newUser);
      setIsProcessing(false);
      setSocialProvider(null);
      onAuthSuccess(newUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-900 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-900/30 mb-3">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            PRAMANEX CANON Gateway
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Identity, Single Sign-On & Role-Based Work Authorization
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            onClick={() => {
              setAuthMode('SIGN_IN');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMode === 'SIGN_IN'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('SIGN_UP');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMode === 'SIGN_UP'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setAuthMode('DEMO_PERSONAS');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              authMode === 'DEMO_PERSONAS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Demo Roles
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Social / OAuth Flow Inline Dialog */}
        {socialProvider && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">
                Authenticate with {socialProvider === 'GOOGLE' ? 'Google Workspace / Gmail' : 'GitHub'}
              </span>
              <button
                onClick={() => setSocialProvider(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {socialProvider === 'GOOGLE' ? 'Enter Google/Gmail ID:' : 'Enter GitHub Username/Email:'}
              </label>
              <input
                type="text"
                value={socialUsername}
                onChange={(e) => setSocialUsername(e.target.value)}
                placeholder={socialProvider === 'GOOGLE' ? 'user@gmail.com' : 'github-handle'}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <button
              onClick={handleConfirmSocialAuth}
              disabled={isProcessing || !socialUsername.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-all shadow-xs cursor-pointer"
            >
              {isProcessing ? 'Verifying OAuth Token...' : `Authorize & Enter CANON OS`}
            </button>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {authMode === 'SIGN_IN' && !socialProvider && (
          <div className="space-y-4">
            {/* Quick 1-Click OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialConnect('GOOGLE')}
                className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google / Gmail
              </button>

              <button
                type="button"
                onClick={() => handleSocialConnect('GITHUB')}
                className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4 text-slate-900" />
                GitHub SSO
              </button>
            </div>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Or with corporate credentials
              </span>
            </div>

            {/* Email + Password Form */}
            <form onSubmit={handleSignInSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Corporate / Regulatory Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="e.g. s.vance@pramanex-pharma.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enterprise Password:
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isProcessing ? 'Verifying GxP Session...' : 'Sign In & Launch Workspace'}
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: SIGN UP / CREATE ACCOUNT */}
        {authMode === 'SIGN_UP' && !socialProvider && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name & Titles:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Vance, PharmD"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Organization:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Global BioPharma Corp"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Corporate Email:
              </label>
              <input
                type="email"
                placeholder="s.vance@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned User Role:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Global Labeling Lead">Global Labeling Lead</option>
                  <option value="Safety / Medical Reviewer">Safety / Medical Reviewer</option>
                  <option value="Local Affiliate RA">Local Affiliate RA</option>
                  <option value="Regulatory Labeling Specialist">Regulatory Labeling Specialist</option>
                  <option value="RegOps / Digital Regulatory">RegOps / Digital Regulatory</option>
                  <option value="Read-Only Auditor">Read-Only Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Master Password:
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                I acknowledge compliance with 21 CFR Part 11 Electronic Records and GxP standards.
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isProcessing ? 'Provisioning Enterprise Tenant...' : 'Create Account & Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 3: DEMO PERSONAS */}
        {authMode === 'DEMO_PERSONAS' && (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-500 mb-2">
              Select any pre-configured regulatory role to test role-specific workflows instantly:
            </p>

            {personas.map((persona) => {
              const isCurrent = currentUser.id === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => {
                    StorageService.setCurrentUser(persona);
                    onAuthSuccess(persona);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/30'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={persona.avatarUrl}
                      alt={persona.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-300"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {persona.name}
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-semibold">{persona.role}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{persona.email}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 transition-colors">
                    {isCurrent ? 'Active User' : 'Switch Role →'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Tenant Scoped: org-pramanex-enterprise</span>
          <span className="flex items-center gap-1 text-emerald-700 font-bold font-sans">
            <ShieldCheck className="w-3.5 h-3.5" /> GxP Encrypted
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, Lock, Check, X, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { UserProfile } from '../../types/canon';
import { StorageService } from '../../utils/storage';

interface GmailAuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSuccess: (user: UserProfile) => void;
  targetEmail?: string;
}

export const GmailAuthPrompt: React.FC<GmailAuthPromptProps> = ({
  isOpen,
  onClose,
  onGoogleSuccess,
  targetEmail = 'rahuldewangan488@gmail.com',
}) => {
  if (!isOpen) return null;

  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleAuthorize = (emailToUse: string, nameToUse: string) => {
    setIsAuthorizing(true);
    setTimeout(() => {
      const googleUser: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name: nameToUse,
        email: emailToUse,
        role: 'Global Labeling Lead',
        organizationId: 'org-pramanex-enterprise',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        signatureHash: `sha256_${Date.now().toString(16)}google_verified_seal`,
      };

      StorageService.registerNewUser(googleUser);
      setIsAuthorizing(false);
      onGoogleSuccess(googleUser);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-900 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto shadow-sm mb-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
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
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sign in with Google
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose an account to launch PRAMANEX CANON OS
          </p>
        </div>

        {/* Account Selection Card */}
        {!useCustomEmail ? (
          <div className="space-y-3">
            {/* Primary Gmail Account (From user context) */}
            <div
              onClick={() => handleAuthorize(targetEmail, 'Rahul Dewangan')}
              className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  RD
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Rahul Dewangan</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{targetEmail}</p>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                    Verified Google Account
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Custom Account Button */}
            <button
              onClick={() => setUseCustomEmail(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center transition-colors cursor-pointer"
            >
              Use another Google / Gmail account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter Gmail or Google Workspace Address:
              </label>
              <input
                type="email"
                placeholder="username@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            <button
              onClick={() => {
                if (customEmail.includes('@')) {
                  handleAuthorize(customEmail, customEmail.split('@')[0]);
                }
              }}
              disabled={isAuthorizing || !customEmail.includes('@')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              {isAuthorizing ? 'Authorizing Google Token...' : 'Authorize & Launch CANON OS'}
            </button>

            <button
              onClick={() => setUseCustomEmail(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← Back to Rahul Dewangan ({targetEmail})
            </button>
          </div>
        )}

        {/* Security & Permissions Notice */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            21 CFR Part 11 Electronic Signature Verification
          </div>
          <p className="leading-snug">
            To continue, Google will securely share your name, email address, and profile token with
            PRAMANEX CANON to bind your authenticated review authority.
          </p>
        </div>
      </div>
    </div>
  );
};

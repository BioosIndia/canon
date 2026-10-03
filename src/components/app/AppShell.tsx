import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  UploadCloud,
  GitCompare,
  Globe2,
  ShieldAlert,
  GitFork,
  ShieldCheck,
  FileCheck,
  QrCode,
  History,
  Sparkles,
  Lock,
  ChevronRight,
  ExternalLink,
  Search,
  Bell,
  User,
  LogOut,
  Building2,
  Download,
  Cpu,
  Award,
  MessageSquare,
  BarChart3,
  Target
} from 'lucide-react';
import { CommandCenter } from './CommandCenter';
import { ProductRegistry } from './ProductRegistry';
import { LabelIntake } from './LabelIntake';
import { VersionComparison } from './VersionComparison';
import { CrossMarketMatrix } from './CrossMarketMatrix';
import { SignalIntake } from './SignalIntake';
import { ImpactGraph } from './ImpactGraph';
import { HumanReviewQueue } from './HumanReviewQueue';
import { ImplementationTracker } from './ImplementationTracker';
import { StructuredWorkbench } from './StructuredWorkbench';
import { ProvenanceReplay } from './ProvenanceReplay';
import { GeminiChatbot } from './GeminiChatbot';
import { AuditLogView } from './AuditLogView';
import { ActivityLogView } from './ActivityLogView';
import { ComplianceAuditReport } from './ComplianceAuditReport';
import { AgentSwarmOrchestration } from './AgentSwarmOrchestration';
import { AiSummarizerDrawer } from './AiSummarizerDrawer';
import { InfographicVisualDashboard } from './InfographicVisualDashboard';
import { GoalInterpreterStudio } from './GoalInterpreterStudio';
import { UserProfile, UserRole } from '../../types/canon';
import { NotificationCenter } from '../layout/NotificationCenter';
import { GlobalSearchBar } from '../layout/GlobalSearchBar';

interface AppShellProps {
  onExitToPublic: () => void;
  initialTab?: string;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onSignOut?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  onExitToPublic,
  initialTab = 'dashboard',
  currentUser,
  onUpdateUser,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAiSummarizerOpen, setIsAiSummarizerOpen] = useState(false);
  const [aiContextTitle, setAiContextTitle] = useState('Section 4.4 Special Warnings & Precautions');
  const [aiContextText, setAiContextText] = useState(
    'KEYTRUDA Section 4.4 / 5.1 Special Warnings: Mandates baseline and periodic liver function monitoring (AST/ALT/bilirubin) before each infusion and introduces permanent discontinuation rule for Grade 3 or Grade 4 immune-mediated hepatitis.'
  );

  const handleOpenAiSummarizer = (title: string, text: string) => {
    setAiContextTitle(title);
    setAiContextText(text);
    setIsAiSummarizerOpen(true);
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    const updated = { ...currentUser, role: newRole };
    onUpdateUser(updated);
  };

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, badge: 'Live' },
    { id: 'infographics', label: 'Infographic Dashboard', icon: BarChart3, badge: 'Visual' },
    { id: 'goal-schema', label: 'Goal & Plan Schema', icon: Target, badge: 'Schema' },
    { id: 'activity-roles', label: 'Activity Log & Roles', icon: ShieldCheck, badge: 'RBAC' },
    { id: 'swarm', label: 'Multi-Agent AI Swarm', icon: Cpu, badge: 'HITL' },
    { id: 'compliance', label: 'Compliance Audit & Export', icon: Award, badge: 'Part 11' },
    { id: 'products', label: 'Product & Version Registry', icon: Layers },
    { id: 'intake', label: 'Multi-Format Label Intake', icon: UploadCloud },
    { id: 'compare', label: 'Deterministic Diff Engine', icon: GitCompare, badge: 'Core' },
    { id: 'cross-market', label: 'Global-to-Local Matrix', icon: Globe2 },
    { id: 'signals', label: 'Regulatory & Safety Triggers', icon: ShieldAlert },
    { id: 'impact', label: 'Cascading Impact Topology', icon: GitFork },
    { id: 'reviews', label: 'Human Review Queue', icon: ShieldCheck, badge: '3' },
    { id: 'tasks', label: 'Implementation Tracker', icon: FileCheck },
    { id: 'structured', label: 'SPL / ePI & QR Integrity', icon: QrCode },
    { id: 'provenance', label: 'Provenance Lineage & Replay', icon: History },
    { id: 'gemini', label: 'Gemini AI Assistant', icon: Sparkles, badge: 'Flash-Lite' },
    { id: 'audit', label: 'Audit Trail & Telemetry', icon: Lock },
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } bg-[#062016] text-white flex flex-col justify-between shrink-0 transition-all border-r border-emerald-950/80 z-20`}
      >
        {/* Top Brand */}
        <div className="p-4 border-b border-emerald-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <span className="font-extrabold text-sm tracking-tight block">PRAMANEX CANON</span>
                <span className="text-[10px] text-emerald-300 tracking-wider uppercase font-semibold">
                  Global Label OS
                </span>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="mt-4 p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-semibold text-[11px] text-emerald-100">
                  Global BioPharma Corp
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          )}
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer font-medium ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-950/40'
                    : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                {!sidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-900/60 text-emerald-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile & Exit */}
        <div className="p-3 border-t border-emerald-950 space-y-2">
          {!sidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-emerald-400"
              />
              <div className="truncate text-xs flex-1">
                <span className="font-bold block truncate text-white leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-emerald-300 block truncate">
                  {currentUser.role}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={onExitToPublic}
              className="flex-1 py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Public Overview"
            >
              <LogOut className="w-3.5 h-3.5 rotate-180" />
              {!sidebarCollapsed && 'Public Site'}
            </button>

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="py-2 px-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                {!sidebarCollapsed && 'Log Out'}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-slate-900 capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <span className="hidden sm:inline-block text-slate-300">•</span>
            <span className="hidden sm:inline-block text-xs text-slate-500 font-mono">
              Session Hash: e3b0c44298fc...
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <div className="hidden md:block">
              <GlobalSearchBar
                isDarkTheme={false}
                onSelectResult={(tab) => setActiveTab(tab)}
              />
            </div>

            {/* Regulatory Notifications Dropdown */}
            <NotificationCenter
              isDarkTheme={false}
              onSelectAction={(tab) => setActiveTab(tab)}
            />

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              GxP Validated
            </div>

            <button
              onClick={() => setActiveTab('gemini')}
              className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
              title="Open Gemini AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Quick Export Dossier Button */}
            <button
              onClick={() => setActiveTab('compliance')}
              className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Open Compliance & Audit Export Suite"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export GxP Dossier</span>
            </button>

            <button
              onClick={onExitToPublic}
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Public View
            </button>

            {/* Header Log Out Button */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Log out of CANON OS session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <CommandCenter onNavigate={(tab) => setActiveTab(tab)} />}
            {activeTab === 'infographics' && <InfographicVisualDashboard />}
            {activeTab === 'goal-schema' && <GoalInterpreterStudio />}
            {activeTab === 'activity-roles' && (
              <ActivityLogView
                currentRole={currentUser.role}
                onSimulateRoleSwitch={handleRoleSwitch}
              />
            )}
            {activeTab === 'swarm' && <AgentSwarmOrchestration />}
            {activeTab === 'compliance' && <ComplianceAuditReport />}
            {activeTab === 'products' && (
              <ProductRegistry
                onSelectVersionForDiff={() => setActiveTab('compare')}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'intake' && (
              <LabelIntake onIntakeComplete={() => setActiveTab('compare')} />
            )}
            {activeTab === 'compare' && (
              <VersionComparison
                onRouteToReview={() => setActiveTab('reviews')}
                onOpenAiSummarizer={handleOpenAiSummarizer}
              />
            )}
            {activeTab === 'cross-market' && (
              <CrossMarketMatrix
                onSelectAlignment={() => setActiveTab('compare')}
                onOpenAiSummarizer={handleOpenAiSummarizer}
              />
            )}
            {activeTab === 'signals' && (
              <SignalIntake onOpenAiSummarizer={handleOpenAiSummarizer} />
            )}
            {activeTab === 'impact' && <ImpactGraph />}
            {activeTab === 'reviews' && (
              <HumanReviewQueue onOpenAiSummarizer={handleOpenAiSummarizer} />
            )}
            {activeTab === 'tasks' && (
              <ImplementationTracker onOpenAiSummarizer={handleOpenAiSummarizer} />
            )}
            {activeTab === 'structured' && <StructuredWorkbench />}
            {activeTab === 'provenance' && <ProvenanceReplay />}
            {activeTab === 'gemini' && <GeminiChatbot />}
            {activeTab === 'audit' && <AuditLogView />}
          </div>

          {/* Floating AI Copilot & Summarizer Trigger */}
          <button
            onClick={() =>
              handleOpenAiSummarizer(
                `Active Screen Context (${navItems.find((n) => n.id === activeTab)?.label || 'Overview'})`,
                `User is currently working in the "${navItems.find((n) => n.id === activeTab)?.label}" module for Keytruda (pembrolizumab) under role "${currentUser.role}". CCDS Rev 15 active harmonization.`
              )
            }
            className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-slate-950 text-white border border-purple-500/50 shadow-2xl hover:shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer group"
            title="Open AI Regulatory Copilot"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold bg-gradient-to-r from-purple-200 via-white to-emerald-200 bg-clip-text text-transparent">
              AI Copilot & Summarizer
            </span>
          </button>

          {/* AI Summarizer Drawer Component */}
          <AiSummarizerDrawer
            isOpen={isAiSummarizerOpen}
            onClose={() => setIsAiSummarizerOpen(false)}
            activeContextTitle={aiContextTitle}
            activeContextText={aiContextText}
          />
        </main>
      </div>
    </div>
  );
};

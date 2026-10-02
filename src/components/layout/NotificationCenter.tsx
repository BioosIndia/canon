import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  FileCheck,
  QrCode,
  X,
  ChevronRight,
  Trash2
} from 'lucide-react';

export interface RegulatoryNotification {
  id: string;
  title: string;
  message: string;
  category: 'SAFETY_ALERT' | 'REVIEW_REQUEST' | 'DEADLINE_URGENT' | 'DIFF_READY' | 'QR_WARNING';
  timestamp: string;
  read: boolean;
  actionTab?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFICATIONS: RegulatoryNotification[] = [
  {
    id: 'notif-1',
    title: 'PRAC Urgent Safety Recommendation',
    message: 'Mandatory transaminase baseline check mandated prior to each infusion for Keytruda (anti-PD-1).',
    category: 'SAFETY_ALERT',
    timestamp: '10 mins ago',
    read: false,
    actionTab: 'signals',
    actionLabel: 'Inspect Signal',
  },
  {
    id: 'notif-2',
    title: 'Named Human Review Assigned',
    message: 'Dr. Marcus Dubois, MD assigned to review Section 4.4 hepatic contraindication expansion.',
    category: 'REVIEW_REQUEST',
    timestamp: '35 mins ago',
    read: false,
    actionTab: 'reviews',
    actionLabel: 'Open Review Gate',
  },
  {
    id: 'notif-3',
    title: 'Packaging QR Superseded Target Detected',
    message: 'Ozempic 1mg packaging 2D barcode still points to superseded US PI v8.0 instead of v8.1.',
    category: 'QR_WARNING',
    timestamp: '2 hours ago',
    read: false,
    actionTab: 'structured',
    actionLabel: 'Verify 2D Code',
  },
  {
    id: 'notif-4',
    title: 'Upcoming Affiliate Submission Deadline',
    message: 'Japan PMDA Minor Notification XML redraft is due in 14 days (Owner: Dr. Kenji Sato).',
    category: 'DEADLINE_URGENT',
    timestamp: '5 hours ago',
    read: true,
    actionTab: 'tasks',
    actionLabel: 'View Task',
  },
  {
    id: 'notif-5',
    title: 'Deterministic Exact Diff Locked',
    message: 'Keytruda US PI v14.2 ↔ v15.0 diff generated with 32 additions and 14 deletions.',
    category: 'DIFF_READY',
    timestamp: '1 day ago',
    read: true,
    actionTab: 'compare',
    actionLabel: 'Open Triple Diff',
  },
];

interface NotificationCenterProps {
  onSelectAction?: (tab: string) => void;
  isDarkTheme?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onSelectAction,
  isDarkTheme = false,
}) => {
  const [notifications, setNotifications] = useState<RegulatoryNotification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => (filter === 'UNREAD' ? !n.read : true));

  const getCategoryIcon = (category: RegulatoryNotification['category']) => {
    switch (category) {
      case 'SAFETY_ALERT':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'REVIEW_REQUEST':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'QR_WARNING':
        return <QrCode className="w-4 h-4 text-orange-500" />;
      case 'DEADLINE_URGENT':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'DIFF_READY':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all cursor-pointer ${
          isDarkTheme
            ? 'text-emerald-200 hover:text-white hover:bg-white/10'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="Regulatory Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900">
                  Regulatory Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-3.5 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 font-bold text-slate-600">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('UNREAD')}
                  className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    filter === 'UNREAD' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[10px] cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Notification Items List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-500 opacity-60" />
                  All regulatory alerts and deadlines acknowledged!
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${
                      item.read ? 'bg-white hover:bg-slate-50/80' : 'bg-emerald-50/40 hover:bg-emerald-50/70'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">{getCategoryIcon(item.category)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{item.message}</p>

                      {item.actionTab && (
                        <div className="pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.id);
                              setIsOpen(false);
                              if (onSelectAction && item.actionTab) {
                                onSelectAction(item.actionTab);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                          >
                            {item.actionLabel || 'View Record'} <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400 font-medium">
              Synchronized with GxP Regulatory Event Bus
            </div>
          </div>
        </>
      )}
    </div>
  );
};

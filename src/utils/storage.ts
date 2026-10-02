/**
 * PRAMANEX CANON — Persistent Storage & State Synchronizer
 * Persists application state (Users, Reviews, Tasks, Activity Logs, Versions)
 * seamlessly across browser sessions and reloads.
 */

import {
  UserProfile,
  HumanReviewRecord,
  ImplementationTask,
  AuditEvent,
  LabelVersion,
  CrossMarketAlignment
} from '../types/canon';
import {
  CURRENT_USER,
  MOCK_REVIEWS,
  MOCK_TASKS,
  MOCK_AUDIT_EVENTS,
  MOCK_LABEL_VERSIONS,
  MOCK_CROSS_MARKET
} from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'canon_current_user',
  USERS_LIST: 'canon_registered_users',
  REVIEWS: 'canon_reviews',
  TASKS: 'canon_tasks',
  AUDIT_LOGS: 'canon_audit_logs',
  VERSIONS: 'canon_label_versions',
  CROSS_MARKET: 'canon_cross_market',
};

// Safe JSON parser helper
function getStoredItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Failed to read ${key} from storage:`, err);
    return fallback;
  }
}

function setStoredItem<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to save ${key} to storage:`, err);
  }
}

export const StorageService = {
  getCurrentUser(): UserProfile {
    return getStoredItem<UserProfile>(STORAGE_KEYS.USER, CURRENT_USER);
  },

  setCurrentUser(user: UserProfile): void {
    setStoredItem(STORAGE_KEYS.USER, user);
    this.logActivity({
      actor: user.name,
      actorRole: user.role,
      action: 'USER_AUTHENTICATED',
      resource: `User:${user.id}`,
      resourceId: user.id,
      details: `Authenticated into organization session as ${user.role}.`,
      severity: 'INFO',
    });
  },

  getRegisteredUsers(): UserProfile[] {
    return getStoredItem<UserProfile[]>(STORAGE_KEYS.USERS_LIST, [CURRENT_USER]);
  },

  registerNewUser(newUser: UserProfile): void {
    const existing = this.getRegisteredUsers();
    const updated = [newUser, ...existing.filter((u) => u.email !== newUser.email)];
    setStoredItem(STORAGE_KEYS.USERS_LIST, updated);
    this.setCurrentUser(newUser);
  },

  getReviews(): HumanReviewRecord[] {
    return getStoredItem<HumanReviewRecord[]>(STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
  },

  saveReviews(reviews: HumanReviewRecord[]): void {
    setStoredItem(STORAGE_KEYS.REVIEWS, reviews);
  },

  getTasks(): ImplementationTask[] {
    return getStoredItem<ImplementationTask[]>(STORAGE_KEYS.TASKS, MOCK_TASKS);
  },

  saveTasks(tasks: ImplementationTask[]): void {
    setStoredItem(STORAGE_KEYS.TASKS, tasks);
  },

  getAuditLogs(): AuditEvent[] {
    return getStoredItem<AuditEvent[]>(STORAGE_KEYS.AUDIT_LOGS, MOCK_AUDIT_EVENTS);
  },

  logActivity(event: Omit<AuditEvent, 'id' | 'timestamp' | 'correlationId' | 'ipAddress'>): AuditEvent {
    const existing = this.getAuditLogs();
    const newLog: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      correlationId: `corr-tx-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(16).slice(-4)}`,
      ipAddress: '192.168.1.104 (Authenticated Session)',
      ...event,
    };
    const updated = [newLog, ...existing];
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, updated);
    return newLog;
  },

  getLabelVersions(): LabelVersion[] {
    return getStoredItem<LabelVersion[]>(STORAGE_KEYS.VERSIONS, MOCK_LABEL_VERSIONS);
  },

  saveLabelVersions(versions: LabelVersion[]): void {
    setStoredItem(STORAGE_KEYS.VERSIONS, versions);
  },

  getCrossMarket(): CrossMarketAlignment[] {
    return getStoredItem<CrossMarketAlignment[]>(STORAGE_KEYS.CROSS_MARKET, MOCK_CROSS_MARKET);
  },

  resetToDefaultSeeds(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.VERSIONS);
  },
};

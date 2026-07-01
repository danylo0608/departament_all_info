/**
 * Google Analytics and Session Interaction Tracking Utility
 */

export interface AppAnalyticsEvent {
  timestamp: string;
  category: string;
  action: string;
  label: string;
  value?: number;
}

// Global typing for gtag
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Memory queue of in-session events to display in the Admin Dashboard
const sessionEvents: AppAnalyticsEvent[] = [];
let sessionStartTime = Date.now();

// Listeners list for real-time dashboard updates
const listeners: (() => void)[] = [];

export function subscribeToEvents(callback: () => void) {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function notifyListeners() {
  listeners.forEach(fn => fn());
}

/**
 * Log an event to both the live Google Analytics (if configured)
 * and the local session database for the live interactive admin dashboard.
 */
export function trackEvent(category: string, action: string, label: string, value?: number) {
  const timestamp = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const newEvent: AppAnalyticsEvent = { timestamp, category, action, label, value };
  
  // Push to local list (keep last 50 events)
  sessionEvents.unshift(newEvent);
  if (sessionEvents.length > 50) {
    sessionEvents.pop();
  }

  // Send to live Google Analytics if active
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  notifyListeners();
}

/**
 * Initialize Google Analytics dynamically
 */
export function initGoogleAnalytics(measurementId: string) {
  if (!measurementId || typeof window === 'undefined') return;

  // Clear any existing scripts
  const existingScript = document.getElementById('google-analytics-script');
  const existingConfig = document.getElementById('google-analytics-config');
  if (existingScript) existingScript.remove();
  if (existingConfig) existingConfig.remove();

  // Inject tracking code
  const script = document.createElement('script');
  script.id = 'google-analytics-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  const configScript = document.createElement('script');
  configScript.id = 'google-analytics-config';
  configScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { 'anonymize_ip': true });
  `;
  document.head.appendChild(configScript);
  
  console.log(`[Google Analytics] Initialized with ID: ${measurementId}`);
}

/**
 * Retrieve session event metrics for the dashboard
 */
export function getSessionMetrics() {
  const durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
  const totalClicks = sessionEvents.length;
  
  // Calculate category breakdowns
  const categoryCounts: Record<string, number> = {};
  const actionCounts: Record<string, number> = {};
  
  sessionEvents.forEach(evt => {
    categoryCounts[evt.category] = (categoryCounts[evt.category] || 0) + 1;
    const actionKey = `${evt.category}: ${evt.action}`;
    actionCounts[actionKey] = (actionCounts[actionKey] || 0) + 1;
  });

  return {
    events: [...sessionEvents],
    durationSeconds,
    totalClicks,
    categoryCounts,
    actionCounts,
    activeUsers: totalClicks > 0 ? 1 : 0
  };
}

// Analytics and tracking utilities for MedFellow Platform

// Types
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  userId?: string;
}

// Google Analytics 4
export function trackGA4Event(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
    (window as unknown as { gtag: Function }).gtag('event', eventName, params);
  }
}

// Generic analytics tracker that can be extended
class Analytics {
  private userId: string | null = null;
  private sessionId: string | null = null;

  setUser(userId: string) {
    this.userId = userId;
    
    // Set user in GA4
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
      (window as unknown as { gtag: Function }).gtag('set', { user_id: userId });
    }
  }

  clearUser() {
    this.userId = null;
  }

  track(event: AnalyticsEvent) {
    const payload = {
      ...event,
      userId: event.userId || this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    // Send to GA4
    trackGA4Event(event.name, event.properties);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', payload);
    }

    // Send to your backend for custom analytics
    this.sendToBackend(payload);
  }

  private async sendToBackend(payload: Record<string, unknown>) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // Silently fail analytics
    }
  }

  // Pre-defined events
  pageView(pageName: string, properties?: Record<string, unknown>) {
    this.track({
      name: 'page_view',
      properties: { page_name: pageName, ...properties },
    });
  }

  courseStarted(courseId: string, courseName: string) {
    this.track({
      name: 'course_started',
      properties: { course_id: courseId, course_name: courseName },
    });
  }

  lessonCompleted(lessonId: string, courseId: string, duration: number) {
    this.track({
      name: 'lesson_completed',
      properties: { lesson_id: lessonId, course_id: courseId, duration_seconds: duration },
    });
  }

  courseCompleted(courseId: string, courseName: string, duration: number) {
    this.track({
      name: 'course_completed',
      properties: { course_id: courseId, course_name: courseName, total_duration: duration },
    });
  }

  aiChatStarted(mode: string) {
    this.track({
      name: 'ai_chat_started',
      properties: { mode },
    });
  }

  aiChatMessage(mode: string, messageLength: number) {
    this.track({
      name: 'ai_chat_message',
      properties: { mode, message_length: messageLength },
    });
  }

  vrSessionStarted(scenarioId: string, scenarioName: string) {
    this.track({
      name: 'vr_session_started',
      properties: { scenario_id: scenarioId, scenario_name: scenarioName },
    });
  }

  vrSessionCompleted(scenarioId: string, score: number, duration: number) {
    this.track({
      name: 'vr_session_completed',
      properties: { scenario_id: scenarioId, score, duration_seconds: duration },
    });
  }

  achievementUnlocked(achievementId: string, achievementName: string) {
    this.track({
      name: 'achievement_unlocked',
      properties: { achievement_id: achievementId, achievement_name: achievementName },
    });
  }

  certificateEarned(certificateId: string, courseName: string) {
    this.track({
      name: 'certificate_earned',
      properties: { certificate_id: certificateId, course_name: courseName },
    });
  }

  subscriptionStarted(plan: string, amount: number) {
    this.track({
      name: 'subscription_started',
      properties: { plan, amount },
    });
  }

  searchPerformed(query: string, resultsCount: number) {
    this.track({
      name: 'search_performed',
      properties: { query, results_count: resultsCount },
    });
  }

  error(errorMessage: string, errorStack?: string) {
    this.track({
      name: 'error',
      properties: { error_message: errorMessage, error_stack: errorStack },
    });
  }
}

export const analytics = new Analytics();

// Hook for React components
export function useAnalytics() {
  return analytics;
}

// Higher-order function for tracking API calls
export function withAnalytics<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  eventName: string
): T {
  return (async (...args: unknown[]) => {
    const startTime = Date.now();
    try {
      const result = await fn(...args);
      analytics.track({
        name: `${eventName}_success`,
        properties: { duration_ms: Date.now() - startTime },
      });
      return result;
    } catch (error) {
      analytics.track({
        name: `${eventName}_error`,
        properties: { 
          duration_ms: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }) as T;
}


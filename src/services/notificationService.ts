export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  category: 'quiz' | 'career' | 'resources' | 'general';
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  constructor() {
    // Initialize with some sample notifications
    this.initializeSampleNotifications();
    // Load notifications from localStorage if available
    this.loadFromStorage();
  }

  private initializeSampleNotifications() {
    const sampleNotifications: Notification[] = [
      {
        id: 'welcome',
        title: 'Welcome to CareerDisha! 🎉',
        message: 'Complete your career assessment quiz to get personalized career recommendations.',
        type: 'info',
        timestamp: new Date(),
        read: false,
        category: 'quiz'
      },
      {
        id: 'new-resources',
        title: 'New Resources Added',
        message: '5 new career guidance videos and PDFs have been added to our library.',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        category: 'resources'
      },
      {
        id: 'ai-chatbot',
        title: 'AI Assistant Available',
        message: 'Need career guidance? Chat with our AI assistant powered by Google AI.',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false,
        category: 'general'
      }
    ];

    // Only add sample notifications if no notifications exist
    if (this.notifications.length === 0) {
      this.notifications = sampleNotifications;
      this.saveToStorage();
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('careerdisha_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Error loading notifications from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('careerdisha_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.warn('Error saving notifications to storage:', error);
    }
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveToStorage();
    this.notifyListeners();

    return newNotification;
  }

  getNotifications(): Notification[] {
    return [...this.notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();
    this.notifyListeners();
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  clearAllNotifications() {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    // Immediately call with current notifications
    listener(this.getNotifications());

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    const notifications = this.getNotifications();
    this.listeners.forEach(listener => listener(notifications));
  }

  // Career-specific notification methods
  addQuizCompletionNotification(quizTitle: string, topCareer: string) {
    this.addNotification({
      title: 'Quiz Completed! 🎯',
      message: `You completed "${quizTitle}" and your top match is ${topCareer}. Check resources for this career!`,
      type: 'success',
      category: 'quiz'
    });
  }

  addResourceNotification(resourceType: string, title: string) {
    this.addNotification({
      title: `New ${resourceType} Available`,
      message: `"${title}" has been added to help with your career planning.`,
      type: 'info',
      category: 'resources'
    });
  }

  addCareerInsightNotification(career: string) {
    this.addNotification({
      title: `Career Insight: ${career}`,
      message: `New trends and opportunities in ${career} field. Explore the latest industry insights.`,
      type: 'info',
      category: 'career'
    });
  }
}

export const notificationService = new NotificationService();
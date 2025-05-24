
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useNotifications = () => {
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title: string, body: string, options?: NotificationOptions) => {
    // Show toast notification
    toast({
      title,
      description: body,
    });

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  };

  const checkOverdueTasks = (tasks: any[]) => {
    const now = new Date();
    const overdueTasks = tasks.filter(task => 
      new Date(task.deadline) < now && task.status !== 'completed'
    );

    if (overdueTasks.length > 0) {
      showNotification(
        'Overdue Tasks Alert!',
        `You have ${overdueTasks.length} overdue task(s). Please review them.`,
        { tag: 'overdue-tasks' }
      );
    }
  };

  const checkUpcomingTasks = (tasks: any[]) => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const upcomingTasks = tasks.filter(task => {
      const deadline = new Date(task.deadline);
      return deadline >= now && deadline <= tomorrow && task.status !== 'completed';
    });

    if (upcomingTasks.length > 0) {
      showNotification(
        'Upcoming Tasks',
        `You have ${upcomingTasks.length} task(s) due tomorrow. Stay prepared!`,
        { tag: 'upcoming-tasks' }
      );
    }
  };

  const sendDailyDigest = (tasks: any[]) => {
    const today = new Date();
    const todayTasks = tasks.filter(task => {
      const deadline = new Date(task.deadline);
      return deadline.toDateString() === today.toDateString() && task.status !== 'completed';
    });

    if (todayTasks.length > 0) {
      showNotification(
        'Daily Task Digest',
        `Good morning! You have ${todayTasks.length} task(s) scheduled for today.`,
        { tag: 'daily-digest' }
      );
    }
  };

  const notifyTaskUpdate = (taskName: string, action: string) => {
    showNotification(
      'Task Updated',
      `${taskName} has been ${action}`,
      { tag: 'task-update' }
    );
  };

  const notifyProductivityMilestone = (completedCount: number) => {
    const milestones = [5, 10, 25, 50, 100];
    if (milestones.includes(completedCount)) {
      showNotification(
        'Productivity Milestone!',
        `Congratulations! You've completed ${completedCount} tasks. Keep up the great work!`,
        { tag: 'milestone' }
      );
    }
  };

  const scheduleRecurringReminders = (tasks: any[]) => {
    // Schedule reminders for tasks due in the next 2 hours
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    const urgentTasks = tasks.filter(task => {
      const deadline = new Date(task.deadline);
      return deadline >= now && deadline <= twoHoursLater && task.status !== 'completed';
    });

    urgentTasks.forEach(task => {
      setTimeout(() => {
        showNotification(
          'Task Reminder',
          `"${task.name}" is due soon! Time to focus.`,
          { tag: `reminder-${task.id}` }
        );
      }, Math.max(0, new Date(task.deadline).getTime() - now.getTime() - 30 * 60 * 1000)); // 30 minutes before
    });
  };

  return {
    showNotification,
    checkOverdueTasks,
    checkUpcomingTasks,
    sendDailyDigest,
    notifyTaskUpdate,
    notifyProductivityMilestone,
    scheduleRecurringReminders,
  };
};

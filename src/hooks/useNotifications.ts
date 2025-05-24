
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

  const notifyTaskUpdate = (taskName: string, action: string) => {
    showNotification(
      'Task Updated',
      `${taskName} has been ${action}`,
      { tag: 'task-update' }
    );
  };

  return {
    showNotification,
    checkOverdueTasks,
    notifyTaskUpdate,
  };
};

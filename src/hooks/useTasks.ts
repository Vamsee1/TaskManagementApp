
import { useState, useEffect } from 'react';
import { Task, TaskStats } from '@/types/task';
import { useNotifications } from './useNotifications';

const STORAGE_KEY = 'taskmaster-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { checkOverdueTasks, notifyTaskUpdate } = useNotifications();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        deadline: new Date(task.deadline),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
      setTasks(parsedTasks);
      
      // Check for overdue tasks on app load
      setTimeout(() => {
        checkOverdueTasks(parsedTasks);
      }, 2000);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    notifyTaskUpdate(newTask.name, 'created');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, ...updates, updatedAt: new Date() };
        notifyTaskUpdate(updatedTask.name, 'updated');
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    if (task) {
      notifyTaskUpdate(task.name, 'deleted');
    }
  };

  const getTaskStats = (): TaskStats => {
    const now = new Date();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => new Date(t.deadline) < now && t.status !== 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
    };
  };

  const getTasksByPriority = () => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return [...tasks].sort((a, b) => {
      // Sort by priority first, then by deadline
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      new Date(task.deadline) < now && task.status !== 'completed'
    );
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskStats,
    getTasksByPriority,
    getOverdueTasks,
  };
};

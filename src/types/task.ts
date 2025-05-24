
export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'personal' | 'work' | 'learning' | 'health';
  deadline: Date;
  status: 'todo' | 'in-progress' | 'blocked' | 'completed';
  effort: string; // e.g., "30 min", "2 hrs", "1 day"
  dependencies?: string[]; // Array of task IDs
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  inProgress: number;
  blocked: number;
}

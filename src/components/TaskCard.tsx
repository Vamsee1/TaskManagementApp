
import React from 'react';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Flag, User, AlertCircle, CheckCircle, Play, Pause } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const now = new Date();
  const isOverdue = isBefore(task.deadline, now) && task.status !== 'completed';
  const isDueSoon = isAfter(task.deadline, now) && isBefore(task.deadline, addDays(now, 2));

  const priorityColors = {
    urgent: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'blocked': 'bg-red-100 text-red-800',
    'completed': 'bg-green-100 text-green-800',
  };

  const categoryColors = {
    personal: 'bg-purple-100 text-purple-800',
    work: 'bg-blue-100 text-blue-800',
    learning: 'bg-indigo-100 text-indigo-800',
    health: 'bg-green-100 text-green-800',
  };

  const handleStatusChange = () => {
    const statusFlow = {
      'todo': 'in-progress',
      'in-progress': 'completed',
      'blocked': 'in-progress',
      'completed': 'todo',
    } as const;
    
    onUpdate(task.id, { status: statusFlow[task.status] });
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Play className="w-4 h-4" />;
      case 'blocked': return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className={`task-card ${isOverdue ? 'border-red-300 bg-red-50' : isDueSoon ? 'border-yellow-300 bg-yellow-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">{task.name}</h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            )}
          </div>
          {isOverdue && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={`priority-badge ${priorityColors[task.priority]}`}>
            <Flag className="w-3 h-3 mr-1" />
            {task.priority.toUpperCase()}
          </Badge>
          <Badge className={`status-badge ${statusColors[task.status]}`}>
            {getStatusIcon()}
            <span className="ml-1">{task.status.replace('-', ' ').toUpperCase()}</span>
          </Badge>
          <Badge className={categoryColors[task.category]}>
            <User className="w-3 h-3 mr-1" />
            {task.category.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span className={isOverdue ? 'text-red-600 font-medium' : isDueSoon ? 'text-yellow-600 font-medium' : ''}>
              {format(task.deadline, 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{task.effort}</span>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleStatusChange} 
            size="sm" 
            variant={task.status === 'completed' ? 'secondary' : 'default'}
            className="flex-1"
          >
            {task.status === 'completed' ? 'Reopen' : 'Next Status'}
          </Button>
          <Button 
            onClick={() => onDelete(task.id)} 
            size="sm" 
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

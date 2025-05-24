
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskStats } from '@/types/task';
import { CheckCircle, Clock, AlertCircle, Pause, BarChart3 } from 'lucide-react';

interface StatsCardProps {
  stats: TaskStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      label: 'Blocked',
      value: stats.blocked,
      icon: Pause,
      color: 'bg-red-100 text-red-800',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-800',
    },
  ];

  return (
    <Card className="task-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Task Statistics</span>
          <Badge className="bg-gradient-to-r from-gradient-from to-gradient-to text-white">
            {completionRate}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="text-center space-y-2">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {stats.total > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-gradient-from to-gradient-to h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;

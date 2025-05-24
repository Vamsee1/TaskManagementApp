
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/types/task';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { format, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

interface AnalyticsDashboardProps {
  tasks: Task[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks }) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');

  const getAnalyticsData = () => {
    const now = new Date();
    const completed = tasks.filter(t => t.status === 'completed');
    const overdue = tasks.filter(t => new Date(t.deadline) < now && t.status !== 'completed');
    
    const productivityScore = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
    
    // Time-based analytics
    const getCompletionTrend = () => {
      let intervals: Date[] = [];
      const startDate = timeRange === 'daily' ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7) :
                       timeRange === 'weekly' ? startOfWeek(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 28)) :
                       timeRange === 'monthly' ? startOfMonth(new Date(now.getFullYear(), now.getMonth() - 12)) :
                       startOfYear(new Date(now.getFullYear() - 1));

      if (timeRange === 'daily') {
        intervals = eachDayOfInterval({ start: startDate, end: now });
      } else if (timeRange === 'weekly') {
        intervals = eachWeekOfInterval({ start: startDate, end: now });
      } else {
        intervals = eachMonthOfInterval({ start: startDate, end: now });
      }

      return intervals.map(date => {
        const completedInPeriod = completed.filter(task => {
          const updatedDate = new Date(task.updatedAt);
          return timeRange === 'daily' ? 
            format(updatedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') :
            timeRange === 'weekly' ?
            format(updatedDate, 'yyyy-ww') === format(date, 'yyyy-ww') :
            format(updatedDate, 'yyyy-MM') === format(date, 'yyyy-MM');
        }).length;

        return {
          period: timeRange === 'daily' ? format(date, 'MMM dd') :
                 timeRange === 'weekly' ? format(date, 'MMM dd') :
                 format(date, 'MMM yyyy'),
          completed: completedInPeriod
        };
      });
    };

    return {
      totalTasks: tasks.length,
      completedTasks: completed.length,
      overdueTasks: overdue.length,
      productivityScore,
      completionTrend: getCompletionTrend(),
      categoryBreakdown: {
        personal: tasks.filter(t => t.category === 'personal').length,
        work: tasks.filter(t => t.category === 'work').length,
        learning: tasks.filter(t => t.category === 'learning').length,
        health: tasks.filter(t => t.category === 'health').length,
      },
      priorityBreakdown: {
        urgent: tasks.filter(t => t.priority === 'urgent').length,
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length,
      }
    };
  };

  const analytics = getAnalyticsData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
        <Tabs value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="task-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{analytics.totalTasks}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="task-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{analytics.completedTasks}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="task-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{analytics.overdueTasks}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="task-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Productivity</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.productivityScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="task-card">
          <CardHeader>
            <CardTitle>Productivity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Completion Rate</span>
                <span>{analytics.productivityScore}%</span>
              </div>
              <Progress value={analytics.productivityScore} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {analytics.completedTasks} out of {analytics.totalTasks} tasks completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="task-card">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="capitalize text-sm">{category}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Trend */}
      <Card className="task-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Completion Trend ({timeRange})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.completionTrend.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{item.period}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.completed} completed</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-gradient-from to-gradient-to h-2 rounded-full"
                      style={{ width: `${Math.min((item.completed / Math.max(...analytics.completionTrend.map(t => t.completed), 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;

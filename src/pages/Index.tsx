import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppSidebar from '@/components/AppSidebar';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import StatsCard from '@/components/StatsCard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import FocusMode from '@/components/FocusMode';
import CalendarView from '@/components/CalendarView';
import Footer from '@/components/Footer';
import { useTasks } from '@/hooks/useTasks';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Calendar,
  Filter,
  Search,
  Bell,
  Settings,
  BarChart3,
  Sparkles,
  Brain,
  Timer,
  Focus
} from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { tasks, addTask, updateTask, deleteTask, getTaskStats, getTasksByPriority, getOverdueTasks } = useTasks();
  const { 
    showNotification, 
    checkOverdueTasks, 
    checkUpcomingTasks, 
    sendDailyDigest, 
    scheduleRecurringReminders,
    notifyProductivityMilestone 
  } = useNotifications();
  const stats = getTaskStats();

  // Enhanced notification system
  useEffect(() => {
    // Check for overdue tasks every 10 minutes
    const overdueInterval = setInterval(() => {
      checkOverdueTasks(tasks);
    }, 600000);

    // Check for upcoming tasks every hour
    const upcomingInterval = setInterval(() => {
      checkUpcomingTasks(tasks);
    }, 3600000);

    // Send daily digest at 9 AM
    const now = new Date();
    const nineAM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    if (now < nineAM) {
      const timeUntilNineAM = nineAM.getTime() - now.getTime();
      setTimeout(() => {
        sendDailyDigest(tasks);
        // Set up daily recurring reminder
        setInterval(() => sendDailyDigest(tasks), 24 * 60 * 60 * 1000);
      }, timeUntilNineAM);
    }

    // Schedule recurring reminders for upcoming tasks
    scheduleRecurringReminders(tasks);

    // Check for productivity milestones
    const completedCount = stats.completed;
    notifyProductivityMilestone(completedCount);

    return () => {
      clearInterval(overdueInterval);
      clearInterval(upcomingInterval);
    };
  }, [tasks, stats.completed]);

  const renderDashboard = () => {
    const priorityTasks = getTasksByPriority().slice(0, 6);
    const upcomingTasks = tasks
      .filter(task => {
        const deadline = new Date(task.deadline);
        return deadline >= new Date() && deadline <= addDays(new Date(), 7) && task.status !== 'completed';
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Welcome to TaskMaster Pro</h1>
            <p className="text-muted-foreground">Your intelligent productivity companion</p>
          </div>
          <Button 
            onClick={() => setActiveView('add-task')}
            className="bg-gradient-to-r from-gradient-from to-gradient-to hover:opacity-90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Quick Add Task
          </Button>
        </div>

        <StatsCard stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Tasks */}
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Priority Tasks
                {priorityTasks.length > 0 && (
                  <Badge className="ml-auto">{priorityTasks.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {priorityTasks.length > 0 ? (
                <div className="space-y-3">
                  {priorityTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{task.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={`text-xs ${
                            task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {format(task.deadline, 'MMM dd')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No priority tasks found</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Deadlines
                {upcomingTasks.length > 0 && (
                  <Badge className="ml-auto">{upcomingTasks.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.map(task => {
                    const deadline = new Date(task.deadline);
                    const deadlineText = isToday(deadline) ? 'Today' : 
                                       isTomorrow(deadline) ? 'Tomorrow' : 
                                       format(deadline, 'MMM dd');
                    
                    return (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{task.name}</p>
                          <p className="text-sm text-muted-foreground">{task.category}</p>
                        </div>
                        <Badge className={
                          isToday(deadline) ? 'bg-red-100 text-red-800' :
                          isTomorrow(deadline) ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {deadlineText}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No upcoming deadlines</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="task-card hover:shadow-lg transition-all duration-300 cursor-pointer" 
                onClick={() => setActiveView('analytics')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">Real-time dashboard with daily, weekly, monthly insights</p>
              <Badge className="mt-2">Enhanced</Badge>
            </CardContent>
          </Card>

          <Card className="task-card hover:shadow-lg transition-all duration-300 cursor-pointer" 
                onClick={() => setActiveView('focus-mode')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Focus Mode</h3>
              <p className="text-sm text-muted-foreground">Pomodoro timer with distraction-free environment</p>
              <Badge variant="secondary" className="mt-2">New</Badge>
            </CardContent>
          </Card>

          <Card className="task-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveView('calendar')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Calendar View</h3>
              <p className="text-sm text-muted-foreground">Visualize tasks in daily/weekly/monthly calendar</p>
              <Badge variant="outline" className="mt-2">Updated</Badge>
            </CardContent>
          </Card>

          <Card className="task-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveView('notifications')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Smart Alerts</h3>
              <p className="text-sm text-muted-foreground">Advanced notifications and reminders system</p>
              <Badge className="mt-2">Pro</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderTaskList = (filteredTasks = tasks) => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">All Tasks</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">No tasks found</p>
          <p className="text-muted-foreground mb-6">Create your first task to get started</p>
          <Button onClick={() => setActiveView('add-task')}>
            Add Your First Task
          </Button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'analytics':
        return <AnalyticsDashboard tasks={tasks} />;
      case 'calendar':
        return <CalendarView tasks={tasks} onTaskClick={(task) => console.log('Task clicked:', task)} />;
      case 'focus-mode':
        return <FocusMode />;
      case 'add-task':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add New Task</h1>
            <TaskForm onSubmit={addTask} />
          </div>
        );
      case 'all-tasks':
        return renderTaskList();
      case 'overdue':
        return renderTaskList(getOverdueTasks());
      case 'in-progress':
        return renderTaskList(tasks.filter(t => t.status === 'in-progress'));
      case 'ai-priority':
        return (
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                AI Priority Assistant
                <Badge>Coming Soon</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI will analyze your tasks and suggest optimal prioritization based on deadlines, 
                dependencies, and historical completion patterns.
              </p>
            </CardContent>
          </Card>
        );
      case 'smart-goals':
        return (
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Smart Goals
                <Badge variant="secondary">Beta</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Define high-level goals and let our system automatically break them down into 
                actionable tasks with suggested timelines and priorities.
              </p>
            </CardContent>
          </Card>
        );
      case 'notifications':
        return (
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Configure how and when you want to receive notifications about your tasks, 
                  deadlines, and productivity insights.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Overdue Task Alerts</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Daily Digest (9 AM)</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Upcoming Task Reminders</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Productivity Milestones</span>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Customize your TaskMaster Pro experience with themes, preferences, 
                and productivity settings.
              </p>
            </CardContent>
          </Card>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          stats={stats}
        />
        <main className="flex-1 flex flex-col">
          <header className="border-b border-border p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex-1" />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => showNotification('Test Notification', 'This is a test notification to verify the system works!')}
              >
                <Bell className="w-4 h-4 mr-2" />
                Test Notification
              </Button>
            </div>
          </header>
          
          <div className="flex-1 p-6">
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </div>
          
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;

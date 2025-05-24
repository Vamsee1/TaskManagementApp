
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppSidebar from '@/components/AppSidebar';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import StatsCard from '@/components/StatsCard';
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
  Sparkles
} from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { tasks, addTask, updateTask, deleteTask, getTaskStats, getTasksByPriority, getOverdueTasks } = useTasks();
  const { showNotification } = useNotifications();
  const stats = getTaskStats();

  // Check for overdue tasks periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const overdueTasks = getOverdueTasks();
      if (overdueTasks.length > 0) {
        showNotification(
          'Task Reminder',
          `You have ${overdueTasks.length} overdue task(s). Time to take action!`,
          { tag: 'periodic-reminder' }
        );
      }
    }, 600000); // Check every 10 minutes

    return () => clearInterval(interval);
  }, [tasks]);

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

        {/* Trending Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="task-card hover:shadow-lg transition-all duration-300 cursor-pointer" 
                onClick={() => setActiveView('ai-priority')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">AI Priority Assistant</h3>
              <p className="text-sm text-muted-foreground">Let AI help prioritize your tasks based on deadlines and importance</p>
              <Badge className="mt-2">New Feature</Badge>
            </CardContent>
          </Card>

          <Card className="task-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveView('smart-goals')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Smart Goals</h3>
              <p className="text-sm text-muted-foreground">Break down complex goals into manageable tasks automatically</p>
              <Badge variant="secondary" className="mt-2">Beta</Badge>
            </CardContent>
          </Card>

          <Card className="task-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setActiveView('focus-mode')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Focus Mode</h3>
              <p className="text-sm text-muted-foreground">Distraction-free environment for maximum productivity</p>
              <Badge variant="outline" className="mt-2">Pro</Badge>
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
      case 'focus-mode':
        return (
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Focus Mode
                <Badge variant="outline">Pro</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Enter a distraction-free environment that helps you concentrate on your most 
                important tasks with built-in pomodoro timer and progress tracking.
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
              <p className="text-muted-foreground">
                Configure how and when you want to receive notifications about your tasks, 
                deadlines, and productivity insights.
              </p>
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

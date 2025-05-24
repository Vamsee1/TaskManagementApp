
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Task } from '@/types/task';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Filter
} from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(new Date(task.deadline), date));
  };

  const getTasksForSelectedDate = () => {
    return getTasksForDate(selectedDate);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'blocked':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const selectedDateTasks = getTasksForSelectedDate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold gradient-text">Calendar View</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="w-full"
                components={{
                  DayContent: ({ date }) => {
                    const tasksForDay = getTasksForDate(date);
                    const isSelected = isSameDay(date, selectedDate);
                    
                    return (
                      <div className={`relative w-full h-full p-1 ${isSelected ? 'bg-primary text-primary-foreground rounded' : ''}`}>
                        <div className="text-center">
                          {format(date, 'd')}
                        </div>
                        {tasksForDay.length > 0 && (
                          <div className="flex justify-center mt-1">
                            <div className="flex gap-1">
                              {tasksForDay.slice(0, 3).map((task, index) => (
                                <div
                                  key={index}
                                  className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                                  title={task.name}
                                />
                              ))}
                              {tasksForDay.length > 3 && (
                                <div className="w-2 h-2 rounded-full bg-gray-400" title={`+${tasksForDay.length - 3} more`} />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Tasks */}
        <div>
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {format(selectedDate, 'MMMM d, yyyy')}
                {selectedDateTasks.length > 0 && (
                  <Badge className="ml-auto">{selectedDateTasks.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateTasks.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => onTaskClick?.(task)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.name}</h4>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                        <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      
                      {task.effort && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Estimated: {task.effort}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No tasks scheduled for this date</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Month Overview */}
          <Card className="task-card mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Month Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Total Tasks This Month:</span>
                  <span className="font-medium">
                    {tasks.filter(task => {
                      const taskDate = new Date(task.deadline);
                      return taskDate.getMonth() === currentMonth.getMonth() && 
                             taskDate.getFullYear() === currentMonth.getFullYear();
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">
                    {tasks.filter(task => {
                      const taskDate = new Date(task.deadline);
                      return task.status === 'completed' &&
                             taskDate.getMonth() === currentMonth.getMonth() && 
                             taskDate.getFullYear() === currentMonth.getFullYear();
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Overdue:</span>
                  <span className="font-medium text-red-600">
                    {tasks.filter(task => {
                      const taskDate = new Date(task.deadline);
                      return new Date(task.deadline) < new Date() && 
                             task.status !== 'completed' &&
                             taskDate.getMonth() === currentMonth.getMonth() && 
                             taskDate.getFullYear() === currentMonth.getFullYear();
                    }).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

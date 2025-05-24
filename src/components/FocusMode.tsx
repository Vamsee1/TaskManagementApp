
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Settings,
  Timer,
  Focus
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const FocusMode: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60); // 25 minutes default
  const [isBreak, setIsBreak] = useState(false);
  const [session, setSession] = useState(1);
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);
  const [isFocusModeEnabled, setIsFocusModeEnabled] = useState(false);
  
  const { showNotification } = useNotifications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = isBreak 
    ? (session % sessionsUntilLongBreak === 0 ? longBreakDuration : shortBreakDuration) * 60
    : workDuration * 60;

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(seconds => {
          if (seconds === 0) {
            // Timer completed
            if (isBreak) {
              // Break finished, start work session
              setIsBreak(false);
              setSession(prev => prev + 1);
              setSeconds(workDuration * 60);
              showNotification(
                'Break Time Over!', 
                'Time to get back to work! Stay focused and productive.',
                { tag: 'focus-session' }
              );
            } else {
              // Work session finished, start break
              setIsBreak(true);
              const isLongBreak = session % sessionsUntilLongBreak === 0;
              setSeconds((isLongBreak ? longBreakDuration : shortBreakDuration) * 60);
              showNotification(
                'Work Session Complete!', 
                `Great job! Time for a ${isLongBreak ? 'long' : 'short'} break.`,
                { tag: 'break-time' }
              );
            }
            return totalSeconds;
          }
          return seconds - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, isBreak, session, workDuration, shortBreakDuration, longBreakDuration, sessionsUntilLongBreak, totalSeconds]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setSeconds(workDuration * 60);
    setIsBreak(false);
    setSession(1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isFocusModeEnabled 
        ? isBreak 
          ? 'bg-gradient-to-br from-green-50 to-blue-50' 
          : 'bg-gradient-to-br from-red-50 to-orange-50'
        : 'bg-background'
    }`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Focus Mode Toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold gradient-text">Focus Mode</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Focus Mode</span>
            <Switch 
              checked={isFocusModeEnabled}
              onCheckedChange={setIsFocusModeEnabled}
            />
          </div>
        </div>

        {/* Main Timer Card */}
        <Card className={`task-card max-w-2xl mx-auto ${
          isFocusModeEnabled 
            ? isBreak 
              ? 'bg-gradient-to-br from-green-100 to-blue-100 border-green-200' 
              : 'bg-gradient-to-br from-red-100 to-orange-100 border-red-200'
            : ''
        }`}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              {isBreak ? <Coffee className="w-8 h-8 text-green-500" /> : <Brain className="w-8 h-8 text-red-500" />}
              {isBreak ? 'Break Time' : 'Focus Session'}
              <Badge className={isBreak ? 'bg-green-500' : 'bg-red-500'}>
                Session {session}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Timer Display */}
            <div className="text-center space-y-4">
              <div className={`text-8xl font-mono font-bold ${
                isBreak ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatTime(seconds)}
              </div>
              <Progress 
                value={progress} 
                className={`h-4 ${isBreak ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4">
              {!isActive ? (
                <Button 
                  onClick={startTimer}
                  size="lg"
                  className={`${
                    isBreak 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button 
                  onClick={pauseTimer}
                  size="lg"
                  variant="outline"
                  className={isBreak ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}
                >
                  <Pause className="w-5 h-5 mr-2" />
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
              )}
              
              <Button 
                onClick={resetTimer}
                size="lg"
                variant="outline"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card className="task-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-500">{session}</div>
              <div className="text-sm text-muted-foreground">Current Session</div>
            </CardContent>
          </Card>
          
          <Card className="task-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-500">
                {sessionsUntilLongBreak - (session % sessionsUntilLongBreak)}
              </div>
              <div className="text-sm text-muted-foreground">Until Long Break</div>
            </CardContent>
          </Card>
          
          <Card className="task-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">
                {Math.floor((session - 1) * workDuration)} min
              </div>
              <div className="text-sm text-muted-foreground">Total Focus Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <Card className="task-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Pomodoro Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Work Duration (minutes)</label>
                <input 
                  type="number" 
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-md"
                  min="1"
                  max="60"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Short Break (minutes)</label>
                <input 
                  type="number" 
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-md"
                  min="1"
                  max="30"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Long Break (minutes)</label>
                <input 
                  type="number" 
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-md"
                  min="1"
                  max="60"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Sessions Until Long Break</label>
                <input 
                  type="number" 
                  value={sessionsUntilLongBreak}
                  onChange={(e) => setSessionsUntilLongBreak(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-md"
                  min="2"
                  max="10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FocusMode;

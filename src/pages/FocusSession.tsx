import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';

export default function FocusSession() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [distractionsCount, setDistractionsCount] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityRef = useRef(true);

  // Distraction detection (Browser + Native Mobile)
  useEffect(() => {
    if (!isRunning || !user) return;

    // Browser detection
    const handleVisibilityChange = async () => {
      if (document.hidden && visibilityRef.current) {
        visibilityRef.current = false;
        await logDistraction('tab_switch');
      } else if (!document.hidden) {
        visibilityRef.current = true;
      }
    };

    const handleBlur = async () => {
      if (visibilityRef.current) {
        visibilityRef.current = false;
        await logDistraction('window_blur');
      }
    };

    const handleFocus = () => {
      visibilityRef.current = true;
    };

    // Native mobile app detection (Capacitor)
    let appStateListener: any;
    const setupCapacitorListener = async () => {
      try {
        appStateListener = await CapacitorApp.addListener('appStateChange', async (state) => {
          if (!state.isActive && visibilityRef.current) {
            visibilityRef.current = false;
            await logDistraction('app_background');
          } else if (state.isActive) {
            visibilityRef.current = true;
          }
        });
      } catch (error) {
        // Capacitor not available (web browser), continue with browser-only detection
        console.log('Running in browser mode');
      }
    };

    setupCapacitorListener();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      if (appStateListener) {
        appStateListener.remove();
      }
    };
  }, [isRunning, user]);

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      completeSession();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const logDistraction = async (type: string) => {
    if (!user || !sessionId) return;

    await supabase.from('distractions').insert({
      user_id: user.id,
      session_id: sessionId,
      type,
      timestamp: new Date().toISOString(),
    });

    setDistractionsCount(prev => prev + 1);

    // Update session distraction count
    await supabase
      .from('focus_sessions')
      .update({ distractions_count: distractionsCount + 1 })
      .eq('id', sessionId);
  };

  const startSession = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to track sessions",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!goal.trim()) {
      toast({
        title: "Set a goal",
        description: "Please enter a focus goal for this session",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: user.id,
        duration: duration,
        goal: goal,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to start session",
        variant: "destructive",
      });
      return;
    }

    setSessionId(data.id);
    setIsRunning(true);
    toast({
      title: "Session started!",
      description: "Stay focused and minimize distractions",
    });
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resumeSession = () => {
    setIsRunning(true);
  };

  const resetSession = async () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setDistractionsCount(0);
    setGoal('');
    
    if (sessionId) {
      await supabase.from('focus_sessions').delete().eq('id', sessionId);
      setSessionId(null);
    }
  };

  const completeSession = async () => {
    if (!sessionId || !user) return;

    const xpEarned = Math.max(10, 50 - distractionsCount * 5);

    await supabase
      .from('focus_sessions')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        xp_earned: xpEarned,
        distractions_count: distractionsCount,
      })
      .eq('id', sessionId);

    // Update profile XP
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, streak_count, last_session_date')
      .eq('id', user.id)
      .single();

    if (profile) {
      const today = new Date().toDateString();
      const lastSession = profile.last_session_date ? new Date(profile.last_session_date).toDateString() : null;
      const isConsecutiveDay = lastSession === new Date(Date.now() - 86400000).toDateString();

      await supabase
        .from('profiles')
        .update({
          xp: (profile.xp || 0) + xpEarned,
          streak_count: isConsecutiveDay ? (profile.streak_count || 0) + 1 : 1,
          last_session_date: new Date().toISOString(),
        })
        .eq('id', user.id);
    }

    // Check for badges
    const { data: sessions } = await supabase
      .from('focus_sessions')
      .select('id')
      .eq('user_id', user.id)
      .eq('completed', true);

    if (sessions && sessions.length === 5) {
      await supabase.from('badges').insert({
        user_id: user.id,
        name: '5 Sessions Completed',
        description: 'Completed your first 5 focus sessions',
        icon: '🎯',
      });
    }

    setIsRunning(false);
    toast({
      title: "Session completed!",
      description: `Great job! You earned ${xpEarned} XP. ${distractionsCount === 0 ? 'Perfect focus!' : `${distractionsCount} distractions detected.`}`,
    });

    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Focus Session</h1>

        <Card className="p-8">
          {!sessionId ? (
            <div className="space-y-6">
              <div>
                <Label htmlFor="goal">Session Goal</Label>
                <Input
                  id="goal"
                  placeholder="e.g., Complete chapter outline"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="60"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <Button onClick={startSession} className="w-full" size="lg">
                <Play className="mr-2 h-5 w-5" />
                Start Focus Session
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Goal</p>
                <p className="text-lg font-medium">{goal}</p>
              </div>

              <div className="text-center">
                <div className="text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                  {formatTime(timeLeft)}
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-gradient-primary h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}% complete</p>
              </div>

              <div className="flex items-center justify-center gap-2 p-4 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium">
                  Distractions: {distractionsCount}
                </span>
              </div>

              <div className="flex gap-4">
                {isRunning ? (
                  <Button onClick={pauseSession} variant="secondary" className="flex-1" size="lg">
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={resumeSession} className="flex-1" size="lg">
                    <Play className="mr-2 h-5 w-5" />
                    Resume
                  </Button>
                )}
                <Button onClick={resetSession} variant="outline" className="flex-1" size="lg">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

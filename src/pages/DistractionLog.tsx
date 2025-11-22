import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Distraction {
  id: string;
  type: string;
  timestamp: string;
  session_id: string;
}

interface Session {
  id: string;
  goal: string;
  duration: number;
  completed: boolean;
  distractions_count: number;
  started_at: string;
}

export default function DistractionLog() {
  const { user } = useAuth();
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data: distractionsData } = await supabase
        .from('distractions')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50);

      const { data: sessionsData } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(20);

      if (distractionsData) setDistractions(distractionsData);
      if (sessionsData) setSessions(sessionsData);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const getDistractionTypeLabel = (type: string) => {
    switch (type) {
      case 'tab_switch': return 'Tab Switch';
      case 'window_blur': return 'Window Blur';
      case 'idle': return 'Idle Time';
      default: return type;
    }
  };

  const getDistractionColor = (type: string) => {
    switch (type) {
      case 'tab_switch': return 'bg-warning/10 text-warning';
      case 'window_blur': return 'bg-destructive/10 text-destructive';
      case 'idle': return 'bg-muted-foreground/10 text-muted-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Distraction History</h1>
          <p className="text-muted-foreground">Review your focus sessions and distractions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Session History */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Session History</h2>
            </div>

            <div className="space-y-4">
              {sessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No sessions yet</p>
              ) : (
                sessions.map(session => (
                  <div key={session.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{session.goal || 'Untitled Session'}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(session.started_at), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      <Badge variant={session.completed ? 'default' : 'secondary'}>
                        {session.completed ? 'Completed' : 'Incomplete'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                      <span>{session.duration} min</span>
                      <span>•</span>
                      <span className={session.distractions_count === 0 ? 'text-success' : 'text-warning'}>
                        {session.distractions_count} {session.distractions_count === 1 ? 'distraction' : 'distractions'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Distraction Log */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="text-xl font-semibold">Distraction Log</h2>
            </div>

            <div className="space-y-3">
              {distractions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No distractions logged</p>
              ) : (
                distractions.map(distraction => (
                  <div key={distraction.id} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getDistractionColor(distraction.type)}>
                          {getDistractionTypeLabel(distraction.type)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(distraction.timestamp), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

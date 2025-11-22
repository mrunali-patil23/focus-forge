import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

export default function Calendar() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!user) return;

      // Get start of current week (Monday)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      startOfWeek.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('focus_sessions')
        .select('started_at, completed')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('started_at', startOfWeek.toISOString())
        .order('started_at', { ascending: true });

      if (!error && data) {
        const counts = [0, 0, 0, 0, 0, 0, 0];
        data.forEach(session => {
          const sessionDate = new Date(session.started_at);
          const dayIndex = sessionDate.getDay();
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Monday = 0, Sunday = 6
          counts[adjustedIndex]++;
        });
        setWeeklyData(counts);
      }
      setLoading(false);
    };

    fetchWeeklyData();
  }, [user]);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Focus Calendar</h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="text-sm font-medium text-muted-foreground">{day}</div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-colors ${
              weeklyData[index] > 0 
                ? 'bg-gradient-primary text-white' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {loading ? '-' : weeklyData[index]}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Calendar from '@/components/Calendar';
import { Trophy, Target, Flame, Clock, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalFocusTime: 0,
    streakDays: 0,
    xp: 0,
    completedSessions: 0,
    totalDistractions: 0
  });
  const [weeklySessionsData, setWeeklySessionsData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch all sessions
      const { data: sessions } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', user.id);

      if (sessions) {
        const totalFocusTime = sessions
          .filter(s => s.completed)
          .reduce((acc, s) => acc + s.duration, 0);
        
        const completedCount = sessions.filter(s => s.completed).length;
        const totalDistractions = sessions.reduce((acc, s) => acc + (s.distractions_count || 0), 0);

        // Get weekly data for chart
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];
        sessions.forEach(session => {
          const sessionDate = new Date(session.started_at);
          if (sessionDate >= startOfWeek && session.completed) {
            const dayIndex = sessionDate.getDay();
            const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
            weeklyCounts[adjustedIndex]++;
          }
        });

        setWeeklySessionsData(weeklyCounts);
        setStats({
          totalSessions: sessions.length,
          totalFocusTime: Math.round(totalFocusTime),
          streakDays: profile?.streak_count || 0,
          xp: profile?.xp || 0,
          completedSessions: completedCount,
          totalDistractions
        });
      }

      if (badgesData) {
        setBadges(badgesData);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sessions This Week',
        data: weeklySessionsData,
        backgroundColor: 'hsl(200 98% 39% / 0.8)',
        borderColor: 'hsl(200 98% 39%)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your focus progress and achievements</p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 p-6 bg-gradient-primary text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Quick Start Focus</h2>
              <p className="text-white/90">Start a 25-minute session to boost your productivity</p>
            </div>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/detect')}
              className="whitespace-nowrap"
            >
              Start Focus Session
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.completedSessions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Focus Time</p>
                <p className="text-2xl font-bold">{stats.totalFocusTime}m</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{stats.streakDays} days</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold">{stats.xp}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Calendar and Progress */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Calendar />
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Progress Goals</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Focus Sessions</span>
                  <span className="font-medium">{stats.completedSessions}/10</span>
                </div>
                <Progress value={(stats.completedSessions / 10) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Focus Time (minutes)</span>
                  <span className="font-medium">{stats.totalFocusTime}/300</span>
                </div>
                <Progress value={(stats.totalFocusTime / 300) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Distraction Control</span>
                  <span className="font-medium">{stats.totalDistractions === 0 ? '✓ Perfect!' : `${stats.totalDistractions} distractions`}</span>
                </div>
                <Progress value={stats.totalDistractions === 0 ? 100 : Math.max(0, 100 - stats.totalDistractions * 10)} className="h-2" />
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Trends Chart */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Weekly Trends</h3>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Card>

        {/* Badges */}
        {badges.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <div className="text-3xl mb-2">{badge.icon || '🏆'}</div>
                  <p className="text-sm font-medium text-center">{badge.name}</p>
                  <p className="text-xs text-muted-foreground text-center">{badge.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Target, Brain, Trophy, TrendingUp, Zap } from 'lucide-react';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              AI-Powered Attention Enhancer
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Forge deep focus with <span className="bg-gradient-primary bg-clip-text text-transparent">Pomodoro</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build stronger concentration habits through structured focus sessions, 
              real-time distraction monitoring, and motivational gamification
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8 h-12">
                Sign Up
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg px-8 h-12">
                Login
              </Button>
              {!user && (
                <Button size="lg" variant="secondary" onClick={() => navigate('/detect')} className="text-lg px-8 h-12">
                  Try Focus Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why FocusForge?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transform your productivity with intelligent features designed to enhance concentration
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Pomodoro Timer</h3>
                <p className="text-sm text-muted-foreground">
                  Structured 25-minute focus sessions with smart breaks
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Distraction Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time monitoring of tab switches and idle time
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold mb-2">Gamification</h3>
                <p className="text-sm text-muted-foreground">
                  Earn XP, badges, and maintain streaks
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Track progress with weekly summaries and insights
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

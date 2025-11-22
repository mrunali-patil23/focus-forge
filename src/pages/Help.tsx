import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Target, Brain, Trophy, TrendingUp, HelpCircle } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Help & Guide</h1>
          <p className="text-muted-foreground">Learn how to make the most of FocusForge</p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Pomodoro Timer</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Work in focused 25-minute sessions followed by short breaks. This technique helps maintain high levels of concentration and prevents burnout.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Distraction Detection</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Automatically tracks when you switch tabs or leave the window during focus sessions, helping you become aware of your distraction patterns.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-warning" />
              </div>
              <h3 className="font-semibold text-lg">Gamification</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Earn XP for completed sessions, unlock badges for milestones, and maintain streaks to stay motivated on your focus journey.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <h3 className="font-semibold text-lg">Analytics Dashboard</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Track your progress with weekly summaries, visualize your focus patterns, and identify areas for improvement.
            </p>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does the Pomodoro Technique work?</AccordionTrigger>
              <AccordionContent>
                The Pomodoro Technique divides work into focused intervals (typically 25 minutes) called "pomodoros," separated by short breaks. 
                After completing four pomodoros, take a longer break (15-30 minutes). This method helps maintain concentration and prevents mental fatigue.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What counts as a distraction?</AccordionTrigger>
              <AccordionContent>
                FocusForge detects three types of distractions:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Tab Switch:</strong> When you switch to a different browser tab</li>
                  <li><strong>Window Blur:</strong> When you click outside the browser window</li>
                  <li><strong>Idle Time:</strong> When you remain inactive for an extended period</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How is XP calculated?</AccordionTrigger>
              <AccordionContent>
                You earn XP by completing focus sessions. Base XP is 50 points per completed session, but this is reduced by 5 points for each distraction detected (minimum 10 XP). 
                Completing sessions with zero distractions maximizes your XP gain!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do streaks work?</AccordionTrigger>
              <AccordionContent>
                Streaks track consecutive days where you complete at least one focus session. Complete a session every day to maintain your streak. 
                Missing a day will reset your streak counter to 0, so consistency is key!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Can I customize session duration?</AccordionTrigger>
              <AccordionContent>
                Yes! While the traditional Pomodoro is 25 minutes, you can customize your session duration from 1 to 60 minutes when starting a new focus session. 
                Choose what works best for your task and concentration level.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What badges can I earn?</AccordionTrigger>
              <AccordionContent>
                Badges are awarded for various milestones:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>5 Sessions Completed - First milestone badge</li>
                  <li>Additional badges for extended streaks and total focus time</li>
                  <li>Special achievements for perfect focus sessions (zero distractions)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Tips */}
        <Card className="p-6 mt-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="text-lg font-semibold mb-4">Tips for Better Focus</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Close unnecessary tabs and applications before starting a session</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Set a clear, specific goal for each session</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Use breaks to rest your eyes and stretch</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Review your distraction log weekly to identify patterns</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Build up to longer sessions gradually</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Target, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "See you next focus session!",
    });
    navigate('/');
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Target className="h-6 w-6 text-primary" />
          <span className="bg-gradient-primary bg-clip-text text-transparent">FocusForge</span>
        </Link>
        
        {user ? (
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/detect" className="text-sm font-medium hover:text-primary transition-colors">
              Focus
            </Link>
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/history" className="text-sm font-medium hover:text-primary transition-colors">
              History
            </Link>
            <Link to="/help" className="text-sm font-medium hover:text-primary transition-colors">
              Help
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome, {user.email?.split('@')[0]}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

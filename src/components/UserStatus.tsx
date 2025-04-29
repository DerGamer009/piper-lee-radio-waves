
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut } from 'lucide-react';

const UserStatus: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium">{user.user_metadata.full_name || user.email}</p>
          {isAdmin && <p className="text-xs text-muted-foreground">Administrator</p>}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-2" />
          <span className="hidden md:inline">Abmelden</span>
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogin}>
      <User className="h-5 w-5 mr-2" />
      <span className="hidden md:inline">Anmelden</span>
    </Button>
  );
};

export default UserStatus;

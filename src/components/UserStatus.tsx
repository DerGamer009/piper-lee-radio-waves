
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, UserPlus } from 'lucide-react';

const UserStatus: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/login?tab=register');
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
          {isAdmin && <p className="text-xs text-radio-purple">Administrator</p>}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-radio-light hover:text-white">
          <LogOut className="h-5 w-5 mr-2" />
          <span className="hidden md:inline">Abmelden</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handleLogin} className="text-radio-light hover:text-white">
        <User className="h-5 w-5 mr-2" />
        <span className="hidden md:inline">Anmelden</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleRegister} className="text-radio-light hover:text-white border-radio-purple hover:border-radio-blue">
        <UserPlus className="h-5 w-5 mr-2" />
        <span className="hidden md:inline">Registrieren</span>
      </Button>
    </div>
  );
};

export default UserStatus;

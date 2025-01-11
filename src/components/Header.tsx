import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between ">
    <div className="flex items-center space-x-3">
    </div>
    <div className="flex items-center space-x-4 ">
      <div className="flex items-center space-x-2">
        <User className="w-5 h-5 text-gray-500" />
        <span className="text-gray-700">{user?.username}</span>
      </div>
      <button
        onClick={logout}
        className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  </div>
</header>
  );
}
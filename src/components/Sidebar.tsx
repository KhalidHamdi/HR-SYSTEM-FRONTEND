import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', to: '/', icon: Home },
  { name: 'Employees', to: '/employees', icon: Users },
  { name: 'Attendance', to: '/attendance', icon: Calendar },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm h-screen">
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <img 
          src="/iVoiceUp_V_Identifier.png" 
          alt="iVoiceUp Logo" 
          className="h-10 w-10 object-contain"
        />
        <h1 className="text-xl font-semibold text-gray-900">HR System</h1>
      </div>
      <nav className="px-2 pt-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
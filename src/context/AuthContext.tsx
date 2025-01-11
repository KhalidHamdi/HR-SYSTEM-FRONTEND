import { createContext, useContext, useState, useEffect } from 'react';
import { Employee } from '../types';

interface AuthContextType {
  user: Employee | null;
  isAuthenticated: boolean;
  login: (token: string, userData: Employee) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Employee | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string, userData: Employee) => {
    localStorage.setItem('token', token);          
    localStorage.setItem('user', JSON.stringify(userData)); 
    setUser(userData);
    setIsAuthenticated(true);
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
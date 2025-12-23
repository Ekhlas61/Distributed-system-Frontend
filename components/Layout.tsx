
import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 tracking-tight">EventTick</span>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">System</span>
              </Link>
              
              <nav className="hidden md:flex space-x-4">
                <Link to="/" className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                  Explore Events
                </Link>
                {user && (
                  <Link to="/my-reservations" className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname === '/my-reservations' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                    My Bookings
                  </Link>
                )}
                {user?.role === UserRole.ADMIN && (
                  <Link to="/admin" className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname === '/admin' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                    System Metrics
                  </Link>
                )}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-tighter">{user.role}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2024 EventTick Distributed Demo. Built with React & Microservices Pattern.
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <span>REST APIs</span>
            <span>•</span>
            <span>Pub/Sub Messaging</span>
            <span>•</span>
            <span>Microservices Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;


import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { authService } from './api/authService';

import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import MyReservationsPage from './pages/MyReservationsPage';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: UserRole }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={setUser} />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage onSignUp={setUser} />} />
          
          <Route path="/" element={<Layout user={user} onLogout={() => setUser(null)} />}>
            <Route index element={<EventListPage />} />
            <Route path="events/:id" element={<EventDetailPage user={user} />} />
            
            <Route path="my-reservations" element={
              <ProtectedRoute>
                <MyReservationsPage user={user} />
              </ProtectedRoute>
            } />
            
            <Route path="admin" element={
              <ProtectedRoute allowedRole={UserRole.ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;

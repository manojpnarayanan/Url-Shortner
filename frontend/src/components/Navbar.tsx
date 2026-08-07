import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, LogOut, User as UserIcon } from 'lucide-react';
import { APP_ROUTES } from '../constants/routes.constants';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(APP_ROUTES.LOGIN);
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={APP_ROUTES.ROOT} className="flex items-center space-x-3 group">
          <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            TrimLink
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-sm text-slate-300">
              <UserIcon className="w-4 h-4 text-cyan-400" />
              <span>{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to={APP_ROUTES.LOGIN}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to={APP_ROUTES.REGISTER}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 rounded-xl shadow-md shadow-violet-500/20 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

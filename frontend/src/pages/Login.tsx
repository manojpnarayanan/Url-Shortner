import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Link2, Eye, EyeOff } from 'lucide-react';
import { AxiosError } from 'axios';
import { APP_ROUTES } from '../constants/routes.constants';
import { AUTH_MESSAGES } from '../constants/messages.constants';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, setUserSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(AUTH_MESSAGES.GMAIL_REQUIRED);
      return;
    }

    if (!password.trim()) {
      setError(AUTH_MESSAGES.PASSWORD_REQUIRED);
      return;
    }

    setSubmitting(true);

    try {
      const user = await loginApi(email.trim(), password);
      setUserSession(user);
      navigate(APP_ROUTES.DASHBOARD, { replace: true });
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || AUTH_MESSAGES.LOGIN_FAILED);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl shadow-violet-950/20">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-violet-500/30">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to manage your shortened links</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Gmail Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-white placeholder-slate-600 text-sm transition-all duration-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-2.5 bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-white placeholder-slate-600 text-sm transition-all duration-200 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium rounded-xl shadow-lg shadow-violet-600/25 flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to={APP_ROUTES.REGISTER} className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

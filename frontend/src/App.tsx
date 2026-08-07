import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { APP_ROUTES } from './constants/routes.constants';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
          <Navbar />
          <Routes>
            <Route path={APP_ROUTES.LOGIN} element={<Login />} />
            <Route path={APP_ROUTES.REGISTER} element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import MainPage from './pages/MainPage';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import VerifyCodeForm from './pages/VerifyCodeForm';
import MainLayout from './pages/MainLayout';
import Reagents from './pages/ReagentManager';
import RutaPrivada from './pages/RutaPrivada';
import Movement from './pages/Movement';
import Historical from './pages/Historical';
import AdminUsers from './pages/AdminUsers';
import IntroduceEmail from './pages/IntroduceEmail';
import NewPassword from './pages/NewPassword';
function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<MainPage />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
        <Route path="/VerifyCodeForm" element={<VerifyCodeForm />} />
        <Route path="/IntroduceEmail" element={<IntroduceEmail />} />
        <Route path="/NewPassword" element={<NewPassword />} />

        {/* Rutas privadas con layout */}
        <Route element={<RutaPrivada />}>
          <Route element={<MainLayout />}>
            <Route path="/ReagentManager" element={<Reagents />} />
            <Route path="/Movement" element={<Movement />} />
            <Route path="/Historical" element={<Historical />} />
            <Route path="/AdminUsers" element={<AdminUsers />} />

          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/ReagentManager" />} />



      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('No se encontró el div con id="root" en el HTML.');
}

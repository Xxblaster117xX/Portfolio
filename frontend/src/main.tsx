import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; //  Importa Toaster

import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VerifyCodeForm from './components/VerifyCodeForm';
import MainLayout from './components/MainLayout';
import Reagents from './components/ReagentManager';
import RutaPrivada from './components/RutaPrivada';
import Movement from './components/Movement';
import Historical from './components/Historical';
import AdminUsers from './components/AdminUsers';
import IntroduceEmail from './components/IntroduceEmail';
import NewPassword from './components/NewPassword';
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

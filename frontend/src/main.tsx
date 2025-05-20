import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VerifyCodeForm from './components/VerifyCodeForm';
import MainLayout from './components/MainLayout';
import Reagents from './components/Reagents';
import RutaPrivada from './components/RutaPrivada';

// Componente principal con rutas
function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<MainPage />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
        <Route path="/VerifyCodeForm" element={<VerifyCodeForm />} />

        {/* Rutas privadas con layout */}
        <Route element={<RutaPrivada />}>
          <Route element={<MainLayout />}>
            <Route path="/Reagents" element={<Reagents />} />
            {/* Puedes añadir más rutas privadas aquí */}
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/Reagents" />} />
      </Routes>
    </Router>
  );
}

// Montar la app
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

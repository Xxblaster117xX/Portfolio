import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VerifyCodeForm from './components/VerifyCodeForm';
import Panel from './components/SideBar'
//Rutas de la aplicación
export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
         <Route path="/VerifyCodeForm" element={<VerifyCodeForm />} />
       <Route path="/SideBar" element={<Panel />} />  
      </Routes>
    </Router>
  );
}

// Montar la aplicación en el DOM(sin esto no se verá nada ya que no se renderiza nada)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* Pantalla principal */}
        <Route path="/LoginForm" element={<LoginForm />} /> {/* Pantalla de inicio de sesión */}
        <Route path="/RegisterForm" element={<RegisterForm />} /> {/* Pantalla de registro */}
      </Routes>
    </Router>
  );
}
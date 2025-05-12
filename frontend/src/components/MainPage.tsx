
import { useNavigate } from 'react-router-dom';
import '../styles/App.css'; // Asegúrate de que este archivo exista

export default function MainPage() {
  const navigate = useNavigate(); 

  return (
    <div className="app-background">
      
      <nav className="navbar">
        <h1>Gestión Almacén</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/LoginForm')}>Iniciar Sesión</button>
          <button onClick={() => navigate('/RegisterForm')}>Registro</button>
        </div>
      </nav>

      
      <div className="main-content">
        <h1>Bienvenido al sistema de almacén</h1>
      </div>
    </div>
  );
}
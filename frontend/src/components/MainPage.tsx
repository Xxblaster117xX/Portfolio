
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Asegúrate de que este archivo exista

export default function MainPage() {
  const navigate = useNavigate(); // Hook para manejar la navegación

  return (
    <div className="app-background">
      {/* Navbar */}
      <nav className="navbar">
        <h1>Gestión Almacén</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
          <button onClick={() => navigate('/register')}>Registro</button>
        </div>
      </nav>

      {/* Contenido central */}
      <div className="main-content">
        <h1>Bienvenido al sistema de almacén</h1>
      </div>
    </div>
  );
}
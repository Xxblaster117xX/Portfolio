// src/App.tsx

import './App.css'; // Asegúrate de que este archivo exista

export default function App() {
  return (
    <div className="app-background">
      {/* Navbar */}
      <nav className="navbar">
        <h1>Gestión Almacén</h1>
        <div className="nav-buttons">
          <button className="login" type='button'>Iniciar sesión</button>
          <button className="register" type='button'>Registro</button>
        </div>
      </nav>

      {/* Contenido central */}
      <div className="main-content">
        <h1>Bienvenido al sistema de almacén</h1>
      </div>
    </div>
  );
}

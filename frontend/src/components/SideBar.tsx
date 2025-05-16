import React, { useEffect, useState } from 'react';
import '../styles/SideBar.css';

export default function Sidebar() {
  const [usuario, setUsuario] = useState<{ nombre: string; correo: string; rol: string } | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/LoginForm'; // Redirige al login tras cerrar sesión
  };

  return (
    <div className="sidebar-container">
      <div>
        <div className="sidebar-user-info">
          {usuario ? (
            <>
              <p><strong>{usuario.nombre}</strong></p>
              <p><em>{usuario.correo}</em></p>
              <p>Rol: {usuario.rol}</p>
            </>
          ) : (
            <p>Cargando usuario...</p>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li><button onClick={() => alert('Ir a Dashboard')}>Dashboard</button></li>
            <li><button onClick={() => alert('Ir a Configuración')}>Configuración</button></li>
            <li><button onClick={() => alert('Ir a Perfil')}>Perfil</button></li>
          </ul>
        </nav>
      </div>

      <button className="sidebar-logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

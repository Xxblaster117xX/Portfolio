import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuario, cerrarSesion } from '../utils/auth';
import '../styles/SideBar.css';

export default function Sidebar() {
  const [usuario, setUsuario] = useState<{ nombre: string; correo: string; rol: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = obtenerUsuario();
    if (user) {
      setUsuario(user);
    }
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
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
            <li><button onClick={() => handleNavigation('/Reagents')}>Reactivos</button></li>
            <li><button onClick={() => handleNavigation('/configuracion')}>Configuración</button></li>
            <li><button onClick={() => handleNavigation('/perfil')}>Perfil</button></li>
          </ul>
        </nav>
      </div>

      <button className="sidebar-logout-btn" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuario, cerrarSesion } from '../utils/auth';
import '../styles/SideBar.css';
import { rol } from '../enum/RolEnum'; // Enum importado correctamente

// Define tipo con el enum rol
type Usuario = {
  nombre: string;
  correo: string;
  rol: rol;
};

export default function Sidebar() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
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

  const renderMenu = () => {
    if (!usuario) return null;

    switch (usuario.rol) {
      case rol.ADMINISTRADOR:
        return (
          <nav className="sidebar-nav">
            <ul>
              <li><button onClick={() => handleNavigation('/ReagentManager')}>Reactivos</button></li>
              <li><button onClick={() => handleNavigation('/Movement')}>Movimientos</button></li>
              <li><button onClick={() => handleNavigation('/Historical')}>Historial</button></li>
              <li><button onClick={() => handleNavigation('/AdminUsers')}>Administrar Usuarios</button></li>
            </ul>
          </nav>
        );

      case rol.PROFESOR:
      case rol.ALUMNO:
        return (
          <nav className="sidebar-nav">
            <ul>
              <li><button onClick={() => handleNavigation('/ReagentManager')}>Reactivos</button></li>
              <li><button onClick={() => handleNavigation('/Movement')}>Movimientos</button></li>
              <li><button onClick={() => handleNavigation('/Historical')}>Historial</button></li>
            </ul>
          </nav>
        );

      default:
        return <p>No tienes permisos para acceder a esta sección.</p>;
    }
  };

  return (
    <div className="sidebar-container">
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

      {renderMenu()}

      {usuario && (
        <button className="sidebar-logout-btn" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      )}
    </div>
  );
}

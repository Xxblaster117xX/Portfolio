import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { obtenerUsuario, cerrarSesion } from '../utils/auth';
import '../styles/SideBar.css';
import { rol } from '../enum/RolEnum';

type Usuario = {
  nombre: string;
  correo: string;
  rol: rol;
};

export default function Sidebar() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); 

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

    const navItem = (path: string, label: string) => (
      <li>
        <button
          className={location.pathname === path ? 'active' : ''}
          onClick={() => handleNavigation(path)}
        >
          {label}
        </button>
      </li>
    );

    switch (usuario.rol) {
      case rol.ADMINISTRADOR:
        return (
          <nav className="sidebar-nav">
            <ul>
              {navItem('/ReagentManager', 'Reactivos')}
              {navItem('/Movement', 'Movimientos')}
              {navItem('/Historical', 'Historial')}
              {navItem('/AdminUsers', 'Administrar Usuarios')}
            </ul>
          </nav>
        );

      case rol.PROFESOR:
      case rol.ALUMNO:
        return (
          <nav className="sidebar-nav">
            <ul>
              {navItem('/ReagentManager', 'Reactivos')}
              {navItem('/Movement', 'Movimientos')}
              {navItem('/Historical', 'Historial')}
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

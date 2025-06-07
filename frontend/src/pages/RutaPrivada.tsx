import { Navigate, Outlet } from 'react-router-dom';

export default function RutaPrivada() {
  const usuario = localStorage.getItem('usuario');
  return usuario ? <Outlet /> : <Navigate to="/LoginForm" />;
}

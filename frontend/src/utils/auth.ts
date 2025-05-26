
// utils/auth.ts
// Devuelve el usuario desde localStorage
export function obtenerUsuario() {
  const user = localStorage.getItem('usuario');
  return user ? JSON.parse(user) : null;
}

// Elimina el usuario y redirige al login
export function cerrarSesion() {
  localStorage.removeItem('usuario');
  window.location.href = '/LoginForm'; 
}

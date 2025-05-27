
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
// Guardar el rol en localStorage
export function guardarUsuario(usuario: { nombre: string; correo: string; rol: string }) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}


import React, { useState } from 'react';

export default function LoginForm() {
  const [userGmail, setUserGmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await window.electron.iniciarSesion({ userGmail, userPassword });
      if (response.success) {
        alert('Inicio de sesión exitoso.');
        setMessage('');
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMessage('Ocurrió un error al intentar iniciar sesión.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Iniciar Sesión</h1>
      <input type="email" placeholder="Correo" value={userGmail} onChange={(e) => setUserGmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} required />
      <button type="submit">Iniciar Sesión</button>
      {message && <p>{message}</p>}
    </form>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

export default function LoginForm() {
  const [userGmail, setUserGmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  type Usuario = {
  nombre: string;
  correo: string;
  rol: string;
};

type RespuestaLogin = {
  success: boolean;
  message: string;
  user?: Usuario;
};

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await window.electron.iniciarSesion({
      userGmail,
      userPassword,
    }) as RespuestaLogin;

    if (response.success && response.user) {
      alert('Inicio de sesión exitoso.');
      localStorage.setItem('usuario', JSON.stringify(response.user)); // Guarda usuario para que aparezca en el sidebar
      setMessage('');
      navigate('/SideBar'); // Redirige al sidebar: Cambiar ruta por la del sidebar
    } else {
      setMessage(response.message || 'Fallo en el inicio de sesión.');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    setMessage('Ocurrió un error al intentar iniciar sesión.');
  }
};


  const handleRecoverPassword = () => {
    alert('Funcionalidad de recuperación de contraseña aún no implementada.');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1 className="login-title">Iniciar Sesión</h1>
        <input
          type="email"
          placeholder="Correo"
          value={userGmail}
          onChange={(e) => setUserGmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Iniciar Sesión</button>
        {message && <p className="login-message">{message}</p>}

        <button
          type="button"
          className="login-secondary-button"
          onClick={handleRecoverPassword}
        >
          ¿Olvidaste tu contraseña?
        </button>

        <button
          type="button"
          className="login-secondary-button"
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';
import VantaBackground from "../components/Effects/VantaGlobe";
import { rol } from '../enum/RolEnum'; 

export default function LoginForm() {
  const [userGmail, setUserGmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  type Usuario = {
    id: number;
    nombre: string;
    correo: string;
    rol: rol; 
  };

  type RespuestaLogin = {
    success: boolean;
    message: string;
    user?: {
      id: number;
      nombre: string;
      correo: string;
      rol: string; 
    };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await window.electron.iniciarSesion({
        userGmail,
        userPassword,
      }) as RespuestaLogin;

      console.log('Respuesta login:', response);

      if (response.success && response.user) {
        // Convertir rol recibido a minúsculas
        const rawRol = response.user.rol.toLowerCase();

        // Validar que el rol recibido sea uno válido del enum
        const esRolValido = Object.values(rol).includes(rawRol as rol);

        if (!esRolValido) {
          setMessage('Rol de usuario no válido.');
          return;
        }

        // Guardar el usuario con el rol ya tipado correctamente
        const usuario: Usuario = {
          id: response.user.id,
          nombre: response.user.nombre,
          correo: response.user.correo,
          rol: rawRol as rol
        };

        localStorage.setItem('usuario', JSON.stringify(usuario));
        setMessage('');
        navigate('/Sidebar');
      } else {
        setMessage(response.message || 'Fallo en el inicio de sesión.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMessage('Ocurrió un error al intentar iniciar sesión.');
    }
  };

  const handleRecoverPassword = () => {
    navigate('/IntroduceEmail');
  };

  return (
    <>
      <VantaBackground />
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
    </>
  );
}

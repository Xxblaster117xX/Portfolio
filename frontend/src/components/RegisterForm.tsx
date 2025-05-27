import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterForm.css';
import VantaBackground from "../components/Effects/VantaBackground"; // importa el fondo animado
export default function RegisterForm() {
  const [userName, setUserName] = useState('');
  const [userGmail, setUserGmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('user');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validateStrongPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(userGmail)) {
      return setMessage('El correo no es válido.');
    }

    if (!validateStrongPassword(userPassword)) {
      return setMessage('La contraseña debe tener al menos 8 caracteres, una letra, un número y un símbolo.');
    }

    if (userPassword !== confirmPassword) {
      return setMessage('Las contraseñas no coinciden.');
    }

    try {
      const response = await window.electron.registrarUsuario({
        userName,
        userGmail,
        userPassword,
        rol,
      });

      setMessage(response.message);

      if (response.success) {
        navigate('/VerifyCodeForm', { state: { userGmail } });
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMessage('Error interno al registrar. Intenta nuevamente.');
    }
  };

  return (

<>
    <VantaBackground />

    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h1 className="form-title">Registro</h1>
        <input
          className="form-input"
          type="text"
          placeholder="Nombre"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="email"
          placeholder="Correo"
          value={userGmail}
          onChange={(e) => setUserGmail(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="password"
          placeholder="Contraseña"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="password"
          placeholder="Repetir Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <select
          className="form-select"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="user">Alumno</option>
          <option value="profesor">Profesor</option>
        </select>
        <button className="form-button" type="submit">Registrar</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      <Link to="/" className="home-button">← Volver al inicio</Link>
    </div>
    </>
  );
  
}

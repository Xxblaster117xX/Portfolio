import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegisterForm.css';

export default function RegisterForm() {
  const [userName, setUserName] = useState('');
  const [userGmail, setUserGmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [rol, setRol] = useState('user');
  const [codigo, setCodigo] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await window.electron.registrarUsuario({ userName, userGmail, userPassword, rol });
      setMessage(response.message);
      if (response.success) setStep(2);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMessage('Ocurrió un error al intentar registrar el usuario.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await window.electron.verificarCodigo({ userGmail, codigo });
      setMessage(response.message);
      if (response.success) alert('Registro completado. Ahora puedes iniciar sesión.');
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setMessage('Ocurrió un error al intentar verificar el código.');
    }
  };

  return (
    <div className="register-container">
      {step === 1 ? (
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
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
          <select
            className="form-select"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
            <option value="profesor">Profesor</option>
          </select>
          <button className="form-button" type="submit">Registrar</button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="verify-form">
          <h1 className="form-title">Verificar Código</h1>
          <input
            className="form-input"
            type="text"
            placeholder="Código de verificación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <button className="form-button" type="submit">Verificar</button>
        </form>
      )}

      {message && <p className="form-message">{message}</p>}

      <Link to="/" className="home-button">← Volver al inicio</Link>
    </div>
  );
}

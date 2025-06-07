import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/VerifyCodeForm.css';
import VantaBackground from "./Effects/VantaBackground"; 
export default function VerifyCodeForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const userGmail = location.state?.userGmail ?? ''; 

  const [codigo, setCodigo] = useState('');
  const [message, setMessage] = useState('');

  // Validación del código de verificación
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await window.electron.verificarCodigo({ userGmail, codigo });
      if (response.success) {
        alert('Verificación exitosa. Ahora puedes iniciar sesión.');
        navigate('/LoginForm'); // redirige al login
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setMessage('Ocurrió un error al intentar verificar el código.');
    }
  };

  return (
    <>    
    <VantaBackground/>
    <div className="verify-container">
      <form onSubmit={handleVerify} className="verify-form">
        <h1 className="verify-title">Verificar Código</h1>
        <input
          className="verify-input"
          type="text"
          placeholder="Código de verificación"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
        <button className="verify-button" type="submit">Verificar</button>
        {message && <p className="verify-message">{message}</p>}
        <Link to="/" className="home-button">← Volver al inicio</Link>
      </form>

    </div>
    </>
  );
}

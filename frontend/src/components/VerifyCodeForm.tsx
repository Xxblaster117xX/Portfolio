import React, { useState } from 'react';
import '../styles/VerifyCodeForm.css';

export default function VerifyCodeForm() {
  const [userGmail, setUserGmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await window.electron.verificarCodigo({ userGmail, codigo });
      if (response.success) {
        alert('Verificación exitosa. Ahora puedes iniciar sesión.');
        setMessage('');
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setMessage('Ocurrió un error al intentar verificar el código.');
    }
  };

  return (
    <div className="verify-container">
      <form onSubmit={handleVerify} className="verify-form">
        <h1 className="verify-title">Verificar Código</h1>
        <input
          className="verify-input"
          type="email"
          placeholder="Correo"
          value={userGmail}
          onChange={(e) => setUserGmail(e.target.value)}
          required
        />
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
      </form>
    </div>
  );
}

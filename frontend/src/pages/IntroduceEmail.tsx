import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/IntroduceEmail.css'; 
import VantaBackground from './Effects/VantaBackground';
// Importa el componente VantaBackground
export function VerificarCorreo() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
// Importa useNavigate desde react-router-dom
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await window.electron.verificarCorreoExiste(correo.trim());
      if (respuesta.exists) {
        navigate('/NewPassword', { state: { correo } });
        alert('Correo verificado. Por favor, procede a actualizar tu contraseña.');
      } else {
        setError('El correo no está registrado.');
      }
    } catch (err) {
      setError('Error al verificar el correo. Intenta nuevamente.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
    <VantaBackground/>
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="form-title">Restablecer contraseña</h2>

        <label htmlFor="correo">Correo electrónico:</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          disabled={cargando}
          className="form-input"
        />

        <button type="submit" disabled={cargando || correo.trim() === ''} className="form-button">
          {cargando ? 'Verificando...' : 'Continuar'}
        </button>

        {error && <p className="form-message">{error}</p>}
          <button
            type="button"
            className="login-secondary-button"
            onClick={() => navigate('/LoginForm')}
          >
            Volver a pantalla de incio de sesión
          </button>
      </form>
    </div>
    </>
  );
}

export default VerificarCorreo;

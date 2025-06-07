import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/NewPassword.css'; 
import Vanta from './Effects/VantaBackground';
const NewPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

 
  const correo = location.state?.correo || '';

  // Obtener el correo del estado de la ubicación, si no existe redirigir a IntroduceEmail
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!correo) {
      navigate('/IntroduceEmail');
    }
  }, [correo, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevaContrasena || !confirmarContrasena) {
      toast.error('Por favor, rellena ambos campos');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const res = await window.electron.actualizarContrasena(correo, nuevaContrasena);

      if (res.success) {
        toast.success('Contraseña actualizada correctamente');
        console.log('Contraseña actualizada correctamente');
        navigate('/LoginForm');
      } else {
        toast.error(res.message || 'Error al actualizar contraseña');
      }
    } catch (error) {
      toast.error('Error inesperado, inténtalo de nuevo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!correo) return null;

  return (
    <>
   <Vanta/>
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="form-title">Actualizar contraseña</h2>

        <label htmlFor="nuevaContrasena">Nueva contraseña</label>
        <input
          id="nuevaContrasena"
          type="password"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
          placeholder="Introduce tu nueva contraseña"
          disabled={loading}
          minLength={8}
          required
          className="form-input"
        />

        <label htmlFor="confirmarContrasena">Confirmar nueva contraseña</label>
        <input
          id="confirmarContrasena"
          type="password"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
          placeholder="Confirma tu nueva contraseña"
          disabled={loading}
          minLength={8}
          required
          className="form-input"
        />

        <button type="submit" disabled={loading} className="form-button">
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
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
};

export default NewPassword;

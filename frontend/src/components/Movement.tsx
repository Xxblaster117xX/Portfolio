//Importaciones
import { useEffect, useState, useCallback } from 'react';
import { Reagents } from '../interface/IReagents';
import '../styles/Movement.css';
import toast, { Toaster } from 'react-hot-toast';
import { obtenerUsuario } from '../utils/auth'; 

export default function Movement() {
  const [reactivos, setReactivos] = useState<Reagents[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reactivoSeleccionado, setReactivoSeleccionado] = useState<Reagents | null>(null);
  const [cantidadGastada, setCantidadGastada] = useState<string>('');
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
const [usuarioNombre, setUsuarioNombre] = useState<string>('');

  useEffect(() => {
    const usuario = obtenerUsuario();
    if (usuario) { 
      setUsuarioId(usuario.id);
      setUsuarioNombre(usuario.nombre);
    }
  }, []);

  const cargarReactivos = useCallback(async () => {
    if (!window.electron) return;
    try {
      const disponibles = await window.electron.obtenerReactivosPorEstado('disponible');
      const escogidos = await window.electron.obtenerReactivosPorEstado('escogido');
      setReactivos([...disponibles, ...escogidos]);
    } catch (error) {
      console.error('Error al cargar reactivos:', error);
    }
  }, []);

  useEffect(() => {
    cargarReactivos();
  }, [cargarReactivos]);

  const manejarEscoger = useCallback(async (productId: number) => {
    if (!window.electron) return;
    if (!usuarioId) {
      alert('No hay usuario identificado');
      return;
    }
    try {
      await window.electron.marcarReactivoComoEscogido(productId);
      await cargarReactivos();

      // Registrar en historial
      await window.electron.registrarHistorial({
        historicalUserId: usuarioId,
        historicalUserName: usuarioNombre, 
        action: 'Escoger reactivo',
        actionDate: new Date().toISOString(),
        details: `Reactivo ID ${productId} marcado como escogido`,
      });
      toast.success('Reactivo escogido correctamente');
      Toaster();
    } catch (error) {
      console.error('Error al marcar reactivo como escogido:', error);
    }
  }, [cargarReactivos, usuarioId, usuarioNombre]); 

  const manejarAbrirModal = useCallback((reactivo: Reagents) => {
    setReactivoSeleccionado(reactivo);
    setCantidadGastada('');
    setModalAbierto(true);
  }, []);

  const parseCantidad = (valor: string | number): number => {
    if (typeof valor === 'number') return valor;
    if (typeof valor === 'string') {
      const limpio = valor.replace(',', '.');
      const convertido = parseFloat(limpio);
      return isNaN(convertido) ? NaN : convertido;
    }
    return NaN;
  };

  const manejarIntroducir = useCallback(async () => {
    if (!reactivoSeleccionado) return;
    if (!usuarioId) {
      alert('No hay usuario identificado');
      return;
    }

    const cantidadNumerica = parseCantidad(cantidadGastada);
    const cantidadDisponible = parseCantidad(reactivoSeleccionado.reagentQuantity);

    if (
      isNaN(cantidadNumerica) ||
      cantidadNumerica <= 0 ||
      isNaN(cantidadDisponible) ||
      cantidadNumerica > cantidadDisponible
    ) {
      alert('Por favor, introduce una cantidad válida.');
      return;
    }

    if (!window.electron) {
      alert('Funcionalidad no disponible');
      return;
    }

    try {
      await window.electron.introducirReactivo(
        reactivoSeleccionado.reagentId,
        cantidadNumerica,
        usuarioId
      );

      await cargarReactivos();

      // Registrar en historial
      await window.electron.registrarHistorial({
        historicalUserId: usuarioId,
        historicalUserName: usuarioNombre,
        action: 'Introducir reactivo',
        actionDate: new Date().toISOString(),
        details: `Reactivo ID ${reactivoSeleccionado.reagentId} introducido, cantidad: ${cantidadNumerica}`,
      });

      setModalAbierto(false);
      setCantidadGastada('');
      toast.success('Reactivo introducido correctamente');
    } catch (error) {
      console.error('Error al introducir reactivo:', error);
      alert('Error al registrar el movimiento');
    }
  }, [reactivoSeleccionado, cantidadGastada, usuarioId, usuarioNombre,cargarReactivos]);

  const reactivosFiltrados = reactivos.filter((r) =>
    r.reagentName.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="movement-container">
      <h1 className="title">Gestión de Movimientos de Reactivos</h1>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="search-input"
      />

      <div className="table-wrapper">
        <table className="reactivos-table">
          <thead style={{ color: 'white' }}>
            <tr>
              <th>Nombre</th>
              <th>CAS</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {reactivosFiltrados.map((reactivo) => (
              <tr key={reactivo.reagentId}>
                <td>{reactivo.reagentName}</td>
                <td>{reactivo.reagentCas || '—'}</td>
                <td>
                  {reactivo.reagentQuantity} {reactivo.reagentUnit}
                </td>
                <td className="capitalize">{reactivo.reagentState || 'desconocido'}</td>
                <td>
                  {reactivo.reagentState === 'disponible' && (
                    <button
                      onClick={() => manejarEscoger(reactivo.reagentId)}
                      className="btn btn-primary"
                    >
                      Escoger
                    </button>
                  )}
                  {reactivo.reagentState === 'escogido' && (
                    <button
                      onClick={() => manejarAbrirModal(reactivo)}
                      className="btn btn-success"
                    >
                      Introducir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && reactivoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2
              className="modal-title"
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px',
                borderRadius: '6px 6px 0 0',
                marginTop: '0',
              }}
            >
              Reactivo: {reactivoSeleccionado.reagentName}
            </h2>
            <input
              type="text"
              inputMode="decimal"
              value={cantidadGastada}
              onChange={(e) => {
                const raw = e.target.value;
                if (/^(\d+([.,]\d*)?)?$/.test(raw)) {
                  setCantidadGastada(raw);
                }
              }}
              className="modal-input"
              placeholder="Cantidad gastada (ej. 2.5)"
            />
            <p style={{ color: 'white', marginTop: '10px' }}>
              Cantidad introducida: {cantidadGastada}
              <br />
              Parseada: {parseCantidad(cantidadGastada)}
              <br />
              Disponible: {reactivoSeleccionado.reagentQuantity}
            </p>

            <div className="modal-buttons">
              <button onClick={() => setModalAbierto(false)} className="btn btn-cancel">
                Cancelar
              </button>
              <button onClick={manejarIntroducir} className="btn btn-confirm">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

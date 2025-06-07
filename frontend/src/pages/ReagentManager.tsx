import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ReagentForm from './ReagentForm';
import ReagentList from './ReagentList';
import { Reagents } from '../interface/IReagents';
import '../styles/Reagent.css';


export type ReagentState = 'disponible' | 'escogido';
import { obtenerUsuario } from '../utils/auth'; 


// Componente principal para gestionar reactivos
export default function ReagentManager() {
  const [reagents, setReagents] = useState<Reagents[]>([]);
  const [form, setForm] = useState<Omit<Reagents, 'reagentId'>>({
    reagentCas: '',
    reagentName: '',
    reagentQuantity: 0,
    reagentUnit: '',
    reagentAddDate: new Date(),
    reagentExpirationDate: new Date(),
    reagentSupplier: '',
    reagentType: '',
    reagentFDS: '',
    reagentState: 'disponible',
  });

  // Estados para manejar la búsqueda, carga, errores y visibilidad del formulario
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editingReagent, setEditingReagent] = useState<Reagents | null>(null);
 
const [usuarioId, setUsuarioId] = useState<number>(0);
const [usuarioNombre, setUsuarioNombre] = useState<string>('');
  
// Obtener el usuario actual al cargar el componente con localStorage
useEffect(() => {
    const usuario = obtenerUsuario();
    if (usuario) { 
      setUsuarioId(usuario.id);
      setUsuarioNombre(usuario.nombre);
    }
  }, []);

  // Formatea las fechas a 'YYYY-MM-DD' para el backend
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  // Carga los reactivos desde el backend
  const loadReagents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electron.obtenerReactivos();
      if (result.success && Array.isArray(result.data)) {
        const parsed = result.data.map((r: Partial<Reagents>) => ({
          reagentId: Number(r.reagentId) || 0,
          reagentCas: r.reagentCas || '',
          reagentName: r.reagentName || '',
          reagentQuantity: Number(r.reagentQuantity),
          reagentUnit: r.reagentUnit || '',
          reagentAddDate: new Date(r.reagentAddDate || new Date()),
          reagentExpirationDate: new Date(r.reagentExpirationDate || new Date()),
          reagentSupplier: r.reagentSupplier || '',
          reagentType: r.reagentType || '',
          reagentFDS: r.reagentFDS || '',
          reagentState: r.reagentState || 'disponible',
        }));
        setReagents(parsed);
      } else {
        setError(result.message || 'Error al cargar reactivos');
      }
    } catch (error) {
      console.error('Error al cargar reactivos:', error);
      setError('Error de conexión con el backend');
    }
    setLoading(false);
  };

  // Resetea el formulario a sus valores iniciales
  const resetForm = () => {
    setForm({
      reagentCas: '',
      reagentName: '',
      reagentQuantity: 0,
      reagentUnit: '',
      reagentAddDate: new Date(),
      reagentExpirationDate: new Date(),
      reagentSupplier: '',
      reagentType: '',
      reagentFDS: '',
      reagentState: 'disponible',
    });
    setError(null);
  };

  // Maneja la creación de un nuevo reactivo
  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.electron.insertarReactivo({
        ...form,
        reagentAddDate: formatDate(form.reagentAddDate),
        reagentExpirationDate: formatDate(form.reagentExpirationDate),
      });
      if (res.success) {
        await loadReagents();

        //  REGISTRO HISTORIAL: Crear reactivo
        await window.electron.registrarHistorial({
          historicalUserId: usuarioId,
         historicalUserName: usuarioNombre,
          action: 'Crear reactivo',
          actionDate: new Date().toISOString(),
          details: `Reactivo "${form.reagentName}" creado con CAS ${form.reagentCas}`,
        });

        resetForm();
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setShowForm(false);
        }, 3000);
      } else {
        setError(res.message || 'Error al crear reactivo');
      }
    } catch (error) {
      console.error('Error al crear reactivo:', error);
      setError('Error en el servidor al crear reactivo');
    }
    setLoading(false);
  };

  // Maneja la eliminación de un reactivo
  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const res = await window.electron.eliminarReactivo(id);
      if (res.success) {
        await loadReagents();
        toast.success('Reactivo eliminado correctamente', { icon: '🔥' });

        //  REGISTRO HISTORIAL: Eliminar reactivo
        await window.electron.registrarHistorial({
          historicalUserId: usuarioId,
         historicalUserName: usuarioNombre,
          action: 'Eliminar reactivo',
          actionDate: new Date().toISOString(),
          details: `Reactivo con ID ${id} fue eliminado`,
        });
      } else {
        setError(res.message || 'Error al eliminar reactivo');
      }
    } catch (error) {
      console.error('Error al eliminar reactivo:', error);
      setError('Error en el servidor al eliminar reactivo');
    }
    setLoading(false);
  };

  // Maneja la edición de un reactivo
  const handleEdit = async (updatedReagent: Reagents) => {
    setLoading(true);
    setError(null);
    try {
      const res = await window.electron.actualizarReactivo({
        ...updatedReagent,
        reagentAddDate: formatDate(updatedReagent.reagentAddDate),
        reagentExpirationDate: formatDate(updatedReagent.reagentExpirationDate),
      });
      if (res.success) {
        await loadReagents();

        //  REGISTRO HISTORIAL: Editar reactivo
        await window.electron.registrarHistorial({
          historicalUserId: usuarioId,
        historicalUserName: usuarioNombre,
          action: 'Editar reactivo',
          actionDate: new Date().toISOString(),
          details: `Reactivo "${updatedReagent.reagentName}" (ID: ${updatedReagent.reagentId}) actualizado`,
        });

        toast.success('Reactivo actualizado correctamente');
      } else {
        setError(res.message || 'Error al actualizar reactivo');
      }
    } catch (error) {
      console.error('Error al actualizar reactivo:', error);
      setError('Error en el servidor al actualizar reactivo');
    }
    setLoading(false);
    setEditingReagent(null);
  };

  // Maneja la confirmación del popup después de crear un reactivo
  const onPopupConfirm = () => {
    setShowPopup(false);
    setShowForm(false);
    toast.success('Reactivo creado con éxito');
    Toaster();
  };


  // Maneja la cancelación del popup
  const onPopupCancel = () => {
    setShowPopup(false);
    toast.success('Reactivo creado con éxito');
  };

  useEffect(() => {
    loadReagents();
  }, []);

  return (
    <>   
    <div className="reagent-container">
      <div className="tabs">
        <button
          className={`tab-btn ${!showForm ? 'active' : ''}`}
          onClick={() => setShowForm(false)}
          disabled={showPopup}
        >
          Lista de Reactivos
        </button>
        <button
          className={`tab-btn ${showForm ? 'active' : ''}`}
          onClick={() => setShowForm(true)}
          disabled={showPopup}
        >
          Crear Reactivo
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showForm ? (
        <ReagentForm
          form={form}
          setForm={setForm}
          onCreate={handleCreate}
          loading={loading}
        />
      ) : (
        <ReagentList
          reagents={reagents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onDelete={handleDelete}
          loading={loading}
          editingReagent={editingReagent}
          setEditingReagent={setEditingReagent}
          onEdit={handleEdit}
        />
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Reactivo creado correctamente</h2>
            <p>¿Quieres ir a la lista de reactivos?</p>
            <div className="popup-buttons">
              <button className="popup-btn confirm" onClick={onPopupConfirm}>
                Sí
              </button>
              <button className="popup-btn cancel" onClick={onPopupCancel}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
     </>
  );
}

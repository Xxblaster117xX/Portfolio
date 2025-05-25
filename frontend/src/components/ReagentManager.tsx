import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ReagentForm from './ReagentForm';
import ReagentList from './ReagentList';
import { Reagents } from '../interface/IReagents';
import '../styles/Reagent.css';
export type ReagentState = 'disponible' | 'escogido';

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
    reagentState: 'disponible', // Asignar un valor por defecto
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // popup creación

  // Estado para el reactivo que se está editando (popup edición)
  const [editingReagent, setEditingReagent] = useState<Reagents | null>(null);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };
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
          reagentQuantity: Number(r.reagentQuantity) || 0,
          reagentUnit: r.reagentUnit || '',
          reagentAddDate: new Date(r.reagentAddDate || new Date()),
          reagentExpirationDate: new Date(r.reagentExpirationDate || new Date()),
          reagentSupplier: r.reagentSupplier || '',
          reagentType: r.reagentType || '',
          reagentFDS: r.reagentFDS || '',
          reagentState: r.reagentState || 'disponible', // Asignar un valor por defecto
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

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const res = await window.electron.eliminarReactivo(id);
      if (res.success) {
        await loadReagents();
        toast.success('Reactivo eliminado correctamente', {
          icon: '🔥',
        });
        //Para que no ocurra error con la importación del toast
        <Toaster className="succ"></Toaster>
      } else {
        setError(res.message || 'Error al eliminar reactivo');
      }
    } catch (error) {
      console.error('Error al eliminar reactivo:', error);
      setError('Error en el servidor al eliminar reactivo');
    }
    setLoading(false);
  };

  // Nueva función para actualizar reactivo
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
        toast.success('Reactivo actualizado correctamente');
      } else {
        setError(res.message || 'Error al actualizar reactivo');
      }
    } catch (error) {
      console.error('Error al actualizar reactivo:', error);
      setError('Error en el servidor al actualizar reactivo');
    }
    setLoading(false);
    setEditingReagent(null); // Cerrar popup edición
  };

  // Función para manejar confirmación popup creación
  const onPopupConfirm = () => {
    setShowPopup(false);
    setShowForm(false);
    toast.success('Reactivo creado con éxito');
  };

  // Función para manejar cancelación popup creación (seguir creando)
  const onPopupCancel = () => {
    setShowPopup(false);
    toast.success('Reactivo creado con éxito');
  };

  useEffect(() => {
    loadReagents();
  }, []);

  return (
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
  );
}

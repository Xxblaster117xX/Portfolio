import React, { useEffect, useState } from 'react';
import { Reagents } from '../interface/IReagents';
import '../styles/Reagent.css';

export default function ReagentsComponent() {
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReagents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electron.obtenerReactivos();
      console.log('Resultado crudo de obtenerReactivos:', result);

      if (result.success && Array.isArray(result.data)) {
        const parsed = result.data.map((r: Partial<Reagents>) => {
          const safeAddDate = r.reagentAddDate ? new Date(r.reagentAddDate) : new Date();
          const safeExpDate = r.reagentExpirationDate ? new Date(r.reagentExpirationDate) : new Date();
          return {
            reagentId: Number(r.reagentId) || 0,
            reagentCas: r.reagentCas || '',
            reagentName: r.reagentName || '',
            reagentQuantity: Number(r.reagentQuantity) || 0,
            reagentUnit: r.reagentUnit || '',
            reagentAddDate: safeAddDate,
            reagentExpirationDate: safeExpDate,
            reagentSupplier: r.reagentSupplier || '',
            reagentType: r.reagentType || '',
            reagentFDS: r.reagentFDS || '',
          } as Reagents;
        });

        console.log('Reactivos parseados:', parsed);
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

  useEffect(() => {
    loadReagents();
  }, []);

  const formatDate = (date: Date | string) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]:
      type === 'date'
        ? new Date(value)
        : name === 'reagentQuantity'
          ? Number(value)
          : value,
  }));
};

  const resetForm = () => {
    setForm({
      reagentCas: '',
      reagentName: '',
      reagentQuantity: 0,
      reagentUnit: "",
      reagentAddDate: new Date(),
      reagentExpirationDate: new Date(),
      reagentSupplier: '',
      reagentType: '',
      reagentFDS: '',
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
      } else {
        setError(res.message || 'Error al crear reactivo');
      }
    } catch (error) {
      console.error('Error al crear reactivo:', error);
      setError('Error en el servidor al crear reactivo');
    }
    setLoading(false);
  };


  const handleDelete = async (id: number | string) => {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      setError('ID inválido para eliminar');
      return;
    }
    if (!window.confirm('¿Estás seguro de eliminar este reactivo?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await window.electron.eliminarReactivo(idNumber);
      if (res.success) {
        console.log('Reactivo eliminado con éxito');
        await loadReagents();

      } else {
        setError(res.message || 'Error al eliminar reactivo');
      }
    } catch (error) {
      console.error('Error al eliminar reactivo:', error);
      setError('Error en el servidor al eliminar reactivo');
    }
    setLoading(false);
  };

  const handleEdit = (id: number | string) => {
    // Más adelante lanzar el pop up
    console.log('Editar reactivo con ID:', id);
  };

  if (loading) return <p>Cargando reactivos...</p>;

  return (
    <div className="reagent-container">
  <h1 className="reagent-title">Gestión de Reactivos</h1>

  {error && <p style={{ color: 'red' }}>Error: {error}</p>}

  <div className="reagent-form-container">
    <div className="reagent-form-group">
      <label htmlFor="reagentCas">CAS</label>
      <input id="reagentCas" name="reagentCas" value={form.reagentCas} onChange={handleChange} className="reagent-input" />
    </div>

    <div className="reagent-form-group">
      <label htmlFor="reagentName">Nombre</label>
      <input id="reagentName" name="reagentName" value={form.reagentName} onChange={handleChange} className="reagent-input" />
    </div>

    <div className="reagent-form-group">
      <label htmlFor="reagentQuantity">Cantidad</label>
      <input type="number" id="reagentQuantity" name="reagentQuantity" value={form.reagentQuantity} onChange={handleChange} className="reagent-input" />
    </div>

    <div className="reagent-form-group">
      <label htmlFor="reagentUnit">Unidad</label>
     <select
  id="reagentUnit"
  name="reagentUnit"
  value={form.reagentUnit}
  onChange={handleChange}
  className="reagent-input">
  <option value="">Selecciona unidad</option>
  <option value="g">g (gramos)</option>
  <option value="mg">mg (miligramos)</option>
  <option value="kg">kg (kilogramos)</option>
  <option value="L">L (litros)</option>
  <option value="mL">mL (mililitros)</option>
  <option value="µL">µL (microlitros)</option>
  <option value="mol">mol</option>
  <option value="mmol">mmol</option>
  <option value="unidades">unidades</option>
</select>
    </div>

    <div className="reagent-form-group">
      <label htmlFor="reagentAddDate">Fecha de Adición</label>
      <input type="date" id="reagentAddDate" name="reagentAddDate" value={formatDate(form.reagentAddDate)} onChange={handleChange} className="reagent-input" />
    </div>

    <div className="reagent-form-group">
      <label htmlFor="reagentExpirationDate">Fecha de Expiración</label>
      <input type="date" id="reagentExpirationDate" name="reagentExpirationDate" value={formatDate(form.reagentExpirationDate)} onChange={handleChange} className="reagent-input" />
    </div>

    <div className="reagent-form-group">
      <label htmlFor="reagentSupplier">Proveedor</label>
      <input id="reagentSupplier" name="reagentSupplier" value={form.reagentSupplier} onChange={handleChange} className="reagent-input" />
    </div>

    <div className="reagent-form-group">
      <label htmlFor="reagentType">Tipo</label>
      <input id="reagentType" name="reagentType" value={form.reagentType} onChange={handleChange} className="reagent-input" />
    </div>

    <div className="reagent-form-group">
      <label htmlFor="reagentFDS">FDS</label>
      <input id="reagentFDS" name="reagentFDS" value={form.reagentFDS} onChange={handleChange} className="reagent-input" />
    </div>

    <button className="reagent-btn-create" onClick={handleCreate} disabled={loading}>
      Crear
    </button>
  </div>

  {/* La tabla se mantiene igual */}
  <table className="reagent-table">
    <thead>
      <tr>
        {[
          'ID', 'CAS', 'Nombre', 'Cantidad', 'Unidad',
          'Fecha Adición', 'Fecha Expiración', 'Proveedor',
          'Tipo', 'FDS', 'Acciones'
        ].map((h) => <th key={h}>{h}</th>)}
      </tr>
    </thead>
    <tbody>
      {reagents.length === 0 ? (
        <tr>
          <td colSpan={11} style={{ textAlign: 'center' }}>No hay reactivos para mostrar.</td>
        </tr>
      ) : (
        reagents.map((r) => (
          <tr key={Number(r.reagentId)}>
            <td>{r.reagentId}</td>
            <td>{r.reagentCas}</td>
            <td>{r.reagentName}</td>
            <td>{r.reagentQuantity}</td>
            <td>{r.reagentUnit}</td>
            <td>{formatDate(r.reagentAddDate)}</td>
            <td>{formatDate(r.reagentExpirationDate)}</td>
            <td>{r.reagentSupplier}</td>
            <td>{r.reagentType}</td>
            <td>{r.reagentFDS}</td>
            <td>
              <button className="reagent-btn-edit" onClick={() => handleEdit(r.reagentId)} disabled={loading}>Editar</button>
              <button className="reagent-btn-delete" onClick={() => handleDelete(r.reagentId)} disabled={loading}>Eliminar</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
  );
}

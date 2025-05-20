import React, { useEffect, useState } from 'react';
// Cambia la ruta según dónde esté tu interfaz
import { Reagents } from '../interface/IReagents';
import '../styles/Reagent.css';

export default function ReagentsComponent() {
    const [reagents, setReagents] = useState<Reagents[]>([]);
    const [form, setForm] = useState<Omit<Reagents, 'reagentId'>>({
        reagentCas: '',
        reagentName: '',
        reagentQuantity: 0,
        reagentUnit: 0,
        reagentAddDate: new Date(),
        reagentExpirationDate: new Date(),
        reagentSupplier: '',
        reagentType: '',
        reagentFDS: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadReagents = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await window.electron.obtenerReactivos();

            if (result.success && Array.isArray(result.data)) {
                // Convertir fechas string a Date
                const parsed = result.data.map((r: Reagents) => ({
                    ...r,
                    reagentAddDate: new Date(r.reagentAddDate),
                    reagentExpirationDate: new Date(r.reagentExpirationDate),
                }));
                setReagents(parsed);
            } else {
                setError(result.message || 'Error al cargar reactivos');
            }
        } catch (error) {
            setError('Error de conexión con el backend');
        }
        setLoading(false);
    };

    useEffect(() => {
        loadReagents();
    }, []);

    // Formatea Date a string YYYY-MM-DD para inputs date
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
                    : name.includes('Quantity') || name.includes('Unit')
                    ? Number(value)
                    : value,
        }));
    };

    const resetForm = () => {
        setForm({
            reagentCas: '',
            reagentName: '',
            reagentQuantity: 0,
            reagentUnit: 0,
            reagentAddDate: new Date(),
            reagentExpirationDate: new Date(),
            reagentSupplier: '',
            reagentType: '',
            reagentFDS: '',
        });
        setEditingId(null);
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

    const handleEdit = (reagent: Reagents) => {
        setForm({
            reagentCas: reagent.reagentCas,
            reagentName: reagent.reagentName,
            reagentQuantity: reagent.reagentQuantity,
            reagentUnit: reagent.reagentUnit,
            reagentAddDate: new Date(reagent.reagentAddDate),
            reagentExpirationDate: new Date(reagent.reagentExpirationDate),
            reagentSupplier: reagent.reagentSupplier,
            reagentType: reagent.reagentType,
            reagentFDS: reagent.reagentFDS,
        });
        setEditingId(reagent.reagentId);
        setError(null);
    };

    const handleUpdate = async () => {
        if (editingId === null) {
            setError('No hay reactivo seleccionado para actualizar');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await window.electron.actualizarReactivo({
                reagentId: editingId,
                ...form,
                reagentAddDate: formatDate(form.reagentAddDate),
                reagentExpirationDate: formatDate(form.reagentExpirationDate),
            });
            if (res.success) {
                await loadReagents();
                resetForm();
            } else {
                setError(res.message || 'Error al actualizar reactivo');
            }
        } catch (error) {
            console.error('Error al actualizar reactivo:', error);
            setError('Error en el servidor al actualizar reactivo');
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!id) {
            setError('ID inválido para eliminar');
            return;
        }
        if (!window.confirm('¿Estás seguro de eliminar este reactivo?')) return;
        setLoading(true);
        setError(null);
        try {
            const res = await window.electron.eliminarReactivo(id);
            if (res.success) {
                await loadReagents();
                if (editingId === id) resetForm(); // si borramos el que editamos, reseteamos
            } else {
                setError(res.message || 'Error al eliminar reactivo');
            }
        } catch (error) {
          console.error('Error al eliminar reactivo:', error);
            setError('Error en el servidor al eliminar reactivo');
        }
        setLoading(false);
    };

    if (loading) return <p>Cargando reactivos...</p>;

    return (
        <div className="reagent-container">
            <h1 className="reagent-title">Gestión de Reactivos</h1>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <div className="reagent-form-container">
                <input
                    className="reagent-input"
                    name="reagentCas"
                    value={form.reagentCas}
                    onChange={handleChange}
                    placeholder="CAS"
                />
                <input
                    className="reagent-input"
                    name="reagentName"
                    value={form.reagentName}
                    onChange={handleChange}
                    placeholder="Nombre"
                />
                <input
                    className="reagent-input"
                    type="number"
                    name="reagentQuantity"
                    value={form.reagentQuantity}
                    onChange={handleChange}
                    placeholder="Cantidad"
                />
                <input
                    className="reagent-input"
                    type="number"
                    name="reagentUnit"
                    value={form.reagentUnit}
                    onChange={handleChange}
                    placeholder="Unidad"
                />
                <input
                    className="reagent-input"
                    type="date"
                    name="reagentAddDate"
                    value={formatDate(form.reagentAddDate)}
                    onChange={handleChange}
                    placeholder="Fecha de creación"
                />
                <input
                    className="reagent-input"
                    type="date"
                    name="reagentExpirationDate"
                    value={formatDate(form.reagentExpirationDate)}
                    onChange={handleChange}
                    placeholder="Fecha de caducidad"
                />
                <input
                    className="reagent-input"
                    name="reagentSupplier"
                    value={form.reagentSupplier}
                    onChange={handleChange}
                    placeholder="Proveedor"
                />
                <input
                    className="reagent-input"
                    name="reagentType"
                    value={form.reagentType}
                    onChange={handleChange}
                    placeholder="Tipo"
                />
                <input
                    className="reagent-input"
                    name="reagentFDS"
                    value={form.reagentFDS}
                    onChange={handleChange}
                    placeholder="FDS"
                />

                {editingId === null ? (
                    <button
                        className="reagent-btn-create"
                        onClick={handleCreate}
                        disabled={loading}
                    >
                        Crear
                    </button>
                ) : (
                    <>
                        <button
                            className="reagent-btn-update"
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            Actualizar
                        </button>
                        <button
                            className="reagent-btn-cancel"
                            onClick={resetForm}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </>
                )}
            </div>

            <table className="reagent-table">
                <thead>
                    <tr>
                        {[
                            'ID',
                            'CAS',
                            'Nombre',
                            'Cantidad',
                            'Unidad',
                            'Fecha Adición',
                            'Fecha Expiración',
                            'Proveedor',
                            'Tipo',
                            'FDS',
                            'Acciones',
                        ].map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {reagents.length === 0 ? (
                        <tr>
                            <td colSpan={11} style={{ textAlign: 'center' }}>
                                No hay reactivos para mostrar.
                            </td>
                        </tr>
                    ) : (
                        reagents.map((r) => (
                            <tr key={r.reagentId}>
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
                                    <button
                                        className="reagent-btn-edit"
                                        onClick={() => handleEdit(r)}
                                        disabled={loading}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="reagent-btn-delete"
                                        onClick={() => handleDelete(r.reagentId)}
                                        disabled={loading}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

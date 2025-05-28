import React, { useState, useEffect } from 'react';
import { Reagents } from '../interface/IReagents';
import '../styles/SearchReagent.css'
import Papa from 'papaparse'




export type ReagentState = 'disponible' | 'escogido';
interface Props {
    reagents: Reagents[];
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    onDelete: (id: number) => void;
    loading: boolean;
    editingReagent: Reagents | null;
    setEditingReagent: (reagent: Reagents | null) => void;
    onEdit: (updatedReagent: Reagents) => void;
}

const ReagentList: React.FC<Props> = ({
    reagents,
    searchTerm,
    setSearchTerm,
    onDelete,
    loading,
    editingReagent,
    setEditingReagent,
    onEdit,
}) => {
    const filterFields: (keyof Omit<Reagents, 'reagentId' | 'reagentQuantity' | 'reagentAddDate' | 'reagentExpirationDate'>)[] = [
        'reagentCas', 'reagentName', 'reagentUnit', 'reagentSupplier', 'reagentType', 'reagentFDS'
    ];

    const [selectedFields, setSelectedFields] = useState<typeof filterFields>(filterFields);

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);

    const [editForm, setEditForm] = useState<Omit<Reagents, 'reagentId'>>({
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

    // Filtros por fechas
    const [addDateFrom, setAddDateFrom] = useState('');
    const [addDateTo, setAddDateTo] = useState('');
    const [expDateFrom, setExpDateFrom] = useState('');
    const [expDateTo, setExpDateTo] = useState('');

    useEffect(() => {
        if (editingReagent) {
            setEditForm({
                reagentCas: editingReagent.reagentCas,
                reagentName: editingReagent.reagentName,
                reagentQuantity: editingReagent.reagentQuantity,
                reagentUnit: editingReagent.reagentUnit,
                reagentAddDate: editingReagent.reagentAddDate,
                reagentExpirationDate: editingReagent.reagentExpirationDate,
                reagentSupplier: editingReagent.reagentSupplier,
                reagentType: editingReagent.reagentType,
                reagentFDS: editingReagent.reagentFDS,
                reagentState: editingReagent.reagentState,
            });
        }
    }, [editingReagent]);

    const toggleFilterField = (field: typeof filterFields[number]) => {
        setSelectedFields(prev =>
            prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
        );
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
    };

    const isWithinDateRange = (value: string | Date, from: string, to: string) => {
        const date = new Date(value).getTime();
        const fromTime = from ? new Date(from).getTime() : null;
        const toTime = to ? new Date(to).getTime() : null;

        return (!fromTime || date >= fromTime) && (!toTime || date <= toTime);
    };

    const filtered = reagents.filter(r => {
        const matchesText = !searchTerm.trim() || selectedFields.some(field =>
            (r[field] || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesAddDate = isWithinDateRange(r.reagentAddDate, addDateFrom, addDateTo);
        const matchesExpDate = isWithinDateRange(r.reagentExpirationDate, expDateFrom, expDateTo);

        return matchesText && matchesAddDate && matchesExpDate;
    });

    const handleExportCSV = (data: Reagents[]) => {
        const csvHeaders = [
            'ID', 'CAS', 'Nombre', 'Cantidad', 'Unidad',
            'Fecha Adición', 'Fecha Expiración', 'Proveedor', 'Tipo', 'FDS', 'Estado'
        ];

        const csvRows = data.map(r => [
            r.reagentId,
            r.reagentCas,
            r.reagentName,
            r.reagentQuantity,
            r.reagentUnit,
            formatDate(r.reagentAddDate),
            formatDate(r.reagentExpirationDate),
            r.reagentSupplier,
            r.reagentType,
            r.reagentFDS,
            r.reagentState
        ]);

        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row =>
                row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'reactivos.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleConfirmDelete = () => {
        if (idToDelete !== null) {
            onDelete(idToDelete);
            setIdToDelete(null);
            setShowDeletePopup(false);
        }
    };
    const handleEditConfirm = () => {
        if (!editingReagent) return;
        const updated: Reagents = {
            reagentId: editingReagent.reagentId,
            ...editForm,
            reagentState: editForm.reagentState || 'disponible',
        };
        onEdit(updated);
        setEditingReagent(null);
    };
    //Interfaz
    return (
        <>
            <h1 className='title'>Gestión de reactivos</h1>
            <div className="reagent-search-container">
                <input
                    type="text"
                    placeholder="Buscar reactivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="reagent-input"
                />

                <div className="reagent-checkbox-container">
                    <div className="reagent-filter-checkboxes">
                        {filterFields.map((field) => (
                            <label key={field} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={selectedFields.includes(field)}
                                    onChange={() => toggleFilterField(field)}
                                />
                                {field.replace('reagent', '')}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="reagent-date-filters">
                    <div className="date-filter">
                        <label>Ingreso desde:</label>
                        <input type="date" value={addDateFrom} onChange={e => setAddDateFrom(e.target.value)} />
                    </div>
                    <div className="date-filter">
                        <label>Ingreso hasta:</label>
                        <input type="date" value={addDateTo} onChange={e => setAddDateTo(e.target.value)} />
                    </div>
                    <div className="date-filter">
                        <label>Expira desde:</label>
                        <input type="date" value={expDateFrom} onChange={e => setExpDateFrom(e.target.value)} />
                    </div>
                    <div className="date-filter">
                        <label>Expira hasta:</label>
                        <input type="date" value={expDateTo} onChange={e => setExpDateTo(e.target.value)} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', marginRight: '1rem' }}>
                <button
                    className="btn-export"
                    onClick={() => handleExportCSV(filtered)}>

                    Exportar CSV
                </button>
            </div>

            <table className="reagent-table">
                <thead>
                    <tr>
                        <th>ID</th><th>CAS</th><th>Nombre</th><th>Cantidad</th><th>Unidad</th>
                        <th>Adición</th><th>Expiración</th><th>Proveedor</th><th>Tipo</th><th>FDS</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr><td colSpan={11} style={{ textAlign: 'center' }}>No hay reactivos.</td></tr>
                    ) : (
                        filtered.map(r => (
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
                                        className="reagent-btn-delete"
                                        onClick={() => {
                                            setIdToDelete(r.reagentId);
                                            setShowDeletePopup(true);
                                        }}
                                        disabled={loading}
                                    >Eliminar</button>{' '}
                                    <button
                                        className="reagent-btn-edit"
                                        onClick={() => setEditingReagent(r)}
                                        disabled={loading}
                                    >Editar</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Popup para eliminar */}
            {showDeletePopup && (
                <div className="reagent-popup-overlay">
                    <div className="reagent-popup">
                        <div className="reagent-popup-header red">Confirmar Eliminación</div>
                        <div className="reagent-popup-body">¿Estás seguro de que deseas eliminar este reactivo?</div>
                        <div className="reagent-popup-actions">
                            <button className="reagent-btn-cancel" onClick={() => setShowDeletePopup(false)}>Cancelar</button>
                            <button className="reagent-btn-delete-confirm" onClick={handleConfirmDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup para editar */}
            {editingReagent && (
                <div className="reagent-popup-overlay">
                    <div className="reagent-popup large">
                        <div className="reagent-popup-header">Editar Reactivo {editingReagent.reagentName}</div>
                        <div className="reagent-popup-body">
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleEditConfirm();
                                }}
                            >
                                <label>
                                    Número CAS del Reactivo:
                                    <input
                                        type="text"
                                        value={editForm.reagentCas}
                                        onChange={e => setEditForm(prev => ({ ...prev, reagentCas: e.target.value }))}
                                        required
                                    />
                                </label>

                                <label>
                                    Nombre del Reactivo:
                                    <input
                                        type="text"
                                        value={editForm.reagentName}
                                        onChange={e => setEditForm(prev => ({ ...prev, reagentName: e.target.value }))}
                                        required
                                    />
                                </label>

                                <label>
                                    Cantidad Disponible:
                                    <input
                                        type="number"
                                        value={editForm.reagentQuantity}
                                        onChange={e => setEditForm(prev => ({ ...prev, reagentQuantity: Number(e.target.value) }))}
                                        min={0}
                                        required
                                    />
                                </label>

                                <label>
                                    Unidad de Medida:
                                    <input
                                        type="text"
                                        value={editForm.reagentUnit}
                                        onChange={e => setEditForm(prev => ({ ...prev, reagentUnit: e.target.value }))}
                                        required
                                    />
                                </label>

                                <label>
                                    Fecha de Ingreso:
                                    <input
                                        type="date"
                                        value={formatDate(editForm.reagentAddDate)}
                                        onChange={e => setEditForm(prev => ({ ...prev, reagentAddDate: new Date(e.target.value) }))}
                                        required
                                    />
                                </label>

                                <label>
                                    Fecha de Expiración:
                                    <input
                                        type="date"
                                        value={formatDate(editForm.reagentExpirationDate)}
                                        onChange={e => setEditForm(prev => ({ ...prev, reagentExpirationDate: new Date(e.target.value) }))}
                                        required
                                    />
                                </label>

                                <label>
                                    Proveedor:
                                    <input
                                        type="text"
                                        value={editForm.reagentSupplier}
                                        onChange={e => setEditForm(prev => ({ ...prev, reagentSupplier: e.target.value }))}
                                        required
                                    />
                                </label>

                                <label>
                                    Tipo de Reactivo:
                                    <input
                                        type="text"
                                        value={editForm.reagentType}
                                        onChange={e => setEditForm(prev => ({ ...prev, reagentType: e.target.value }))}
                                        required
                                    />
                                </label>

                                <label>
                                    FDS:
                                    <input
                                        type="text"
                                        value={editForm.reagentFDS}
                                        onChange={e => setEditForm(prev => ({ ...prev, reagentFDS: e.target.value }))}
                                        required
                                    />
                                </label>
                                <label>
                                    Estado:
                                    <select
                                        value={editForm.reagentState}
                                        onChange={e =>
                                            setEditForm(prev => ({
                                                ...prev,
                                                reagentState: e.target.value as ReagentState,
                                            }))
                                        }
                                        required
                                    >
                                        <option value="disponible">Disponible</option>
                                        <option value="escogido">Escogido</option>
                                    </select>
                                </label>

                                <div style={{ marginTop: '5rem' }}>
                                    <button type="button" className="reagent-btn-cancel" onClick={() => setEditingReagent(null)}>Cancelar</button>{' '}
                                    <button type="submit" className="reagent-btn-edit-confirm">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReagentList;

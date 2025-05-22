import React, { useState } from 'react';
import { Reagents } from '../interface/IReagents';

interface Props {
  reagents: Reagents[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const ReagentList: React.FC<Props> = ({
  reagents,
  searchTerm,
  setSearchTerm,
  onDelete,
  loading,
}) => {
  const filterFields: (keyof Omit<Reagents, 'reagentId' | 'reagentQuantity' | 'reagentAddDate' | 'reagentExpirationDate'>)[] = [
    'reagentCas', 'reagentName', 'reagentUnit', 'reagentSupplier', 'reagentType', 'reagentFDS'
  ];

  const [selectedFields, setSelectedFields] = useState<typeof filterFields>([
    'reagentCas', 'reagentName', 'reagentSupplier'
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const toggleFilterField = (field: typeof filterFields[number]) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const filtered = reagents.filter(r => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return selectedFields.some(field =>
      (r[field] || '').toString().toLowerCase().includes(term)
    );
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  };

  const handleConfirmDelete = () => {
    if (idToDelete !== null) {
      onDelete(idToDelete);
      setIdToDelete(null);
      setShowPopup(false);
    }
  };

  return (
    <>
      <div className="reagent-search-container" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar reactivo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="reagent-input"
        />
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {filterFields.map((field) => (
            <label key={field} style={{ userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={() => toggleFilterField(field)}
              />{' '}
              {field.replace('reagent', '')}
            </label>
          ))}
        </div>
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
                      setShowPopup(true);
                    }}
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

      {showPopup && (
        <div className="reagent-popup-overlay">
          <div className="reagent-popup">
            <div className="reagent-popup-header red">
              Confirmar Eliminación
            </div>
            <div className="reagent-popup-body">
              ¿Estás seguro de que deseas eliminar este reactivo?
            </div>
            <div className="reagent-popup-actions">
              <button className="reagent-btn-cancel" onClick={() => setShowPopup(false)}>
                Cancelar
              </button>
              <button className="reagent-btn-delete-confirm" onClick={handleConfirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReagentList;

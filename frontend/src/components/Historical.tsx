import React, { useEffect, useState } from 'react';
import { IHistorical } from '../interface/IHistorical';
import '../styles/historical.css';
import Papa from 'papaparse';

type HistoricalRaw = {
  historical_id: number;
  historical_user_id: number;
  historical_user_name: string;
  action: string;
  action_date: string;
  details: string;
};

const mapHistoricalToPascalCase = (h: HistoricalRaw): IHistorical => ({
  HistoricalId: h.historical_id,
  historicalUsername: h.historical_user_name,
  HistoricalUserId: h.historical_user_id,
  Action: h.action,
  ActionDate: new Date(h.action_date),
  Details: h.details,
});

const Historical: React.FC = () => {
  const [historial, setHistorial] = useState<IHistorical[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await window.electron.obtenerHistorial();
        if (response.success) {
          const mappedData = response.data.map(mapHistoricalToPascalCase);
          setHistorial(mappedData);
          setError(null);
        } else {
          setError(response.message ?? 'Error al obtener historial');
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const filteredHistorial = historial.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.HistoricalId.toString().includes(search) ||
      item.HistoricalUserId.toString().includes(search) ||
      item.historicalUsername.toLowerCase().includes(search) ||
      item.Action.toLowerCase().includes(search) ||
      item.ActionDate.toLocaleString().toLowerCase().includes(search) ||
      item.Details.toLowerCase().includes(search)
    );
  });

  const exportToCSV = () => {
    const csvData = filteredHistorial.map(item => ({
      ID: item.HistoricalId,
      'ID Usuario': item.HistoricalUserId,
      'Nombre Usuario': item.historicalUsername,
      Acción: item.Action,
      Fecha: item.ActionDate.toLocaleString(),
      Detalles: item.Details,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'historial.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p className="error">{error}</p>;
  if (historial.length === 0) return <p>No hay acciones históricas para mostrar.</p>;

  return (
    <div className="historial-container">
      <h2 className='title'>Historial de Acciones</h2>

      <div className="historial-controls">
        <input
          type="text"
          placeholder="Buscar registro de historial..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="export-button" onClick={exportToCSV}>
          Exportar CSV
        </button>
      </div>

      <table className="historial-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Usuario</th>
            <th>Nombre Usuario</th>
            <th>Acción</th>
            <th>Fecha</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistorial.map((item) => (
            <tr key={item.HistoricalId}>
              <td>{item.HistoricalId}</td>
              <td>{item.HistoricalUserId}</td>
              <td>{item.historicalUsername}</td>
              <td>{item.Action}</td>
              <td>{item.ActionDate.toLocaleString()}</td>
              <td>{item.Details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Historical;

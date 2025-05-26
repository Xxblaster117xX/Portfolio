import React, { useEffect, useState } from 'react';
import { IHistorical } from '../interface/IHistorical';

type HistoricalRaw = {
  historical_id: number;
  historical_user_id: number;
  action: string;
  action_date: string;  // viene como string del backend
  details: string;
};

const mapHistoricalToPascalCase = (h: HistoricalRaw): IHistorical => ({
  HistoricalId: h.historical_id,
  HistoricalUserId: h.historical_user_id,
  Action: h.action,
  ActionDate: new Date(h.action_date),
  Details: h.details,
});

const Historical: React.FC = () => {
  const [historial, setHistorial] = useState<IHistorical[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (historial.length === 0) return <p>No hay acciones históricas para mostrar.</p>;

  return (
    <div>
      <h2>Historial de Acciones</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>ID Usuario</th>
            <th style={thStyle}>Acción</th>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {historial.map(item => (
            <tr key={item.HistoricalId}>
              <td style={tdStyle}>{item.HistoricalId}</td>
              <td style={tdStyle}>{item.HistoricalUserId}</td>
              <td style={tdStyle}>{item.Action}</td>
              <td style={tdStyle}>{item.ActionDate.toLocaleString()}</td>
              <td style={tdStyle}>{item.Details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '8px',
};

export default Historical;

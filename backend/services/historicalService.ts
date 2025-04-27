import { db } from '../database/connection'; // Importar la conexión a la base de datos

// Función para registrar una acción histórica
export const registrarAccionHistorica = (
  historicalUserId: number,
  action: string,
  actionDate: string,
  details: string
) => {
  // Validación para asegurarnos de que el actionDate sea una fecha válida
  const fecha = new Date(actionDate);
  if (isNaN(fecha.getTime())) {
    throw new Error('La fecha de la acción no es válida.');
  }

  // Insertar la acción histórica en la base de datos
  const stmt = db.prepare(`
    INSERT INTO historical (historical_user_id, action, action_date, details)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(historicalUserId, action, actionDate, details);
  console.log(`Acción histórica registrada: Usuario ${historicalUserId}, Acción: ${action}`);
};

// Función para obtener todas las acciones históricas
export const obtenerAccionesHistoricas = () => {
  const stmt = db.prepare(`SELECT * FROM historical`);
  return stmt.all();
};

// Función para obtener las acciones históricas de un usuario específico
export const obtenerAccionesHistoricasPorUsuario = (historicalUserId: number) => {
  const stmt = db.prepare(`SELECT * FROM historical WHERE historical_user_id = ?`);
  return stmt.all(historicalUserId);
};

// Función para actualizar detalles de una acción histórica
export const actualizarDetallesAccionHistorica = (
  historicalId: number,
  action: string,
  actionDate: string,
  details: string
) => {
  // Validación para asegurarnos de que el actionDate sea una fecha válida
  const fecha = new Date(actionDate);
  if (isNaN(fecha.getTime())) {
    throw new Error('La fecha de la acción no es válida.');
  }

  // Actualizar los detalles de la acción histórica en la base de datos
  const stmt = db.prepare(`
    UPDATE historical
    SET action = ?, action_date = ?, details = ?
    WHERE historical_id = ?
  `);
  stmt.run(action, actionDate, details, historicalId);
  console.log(`Acción histórica actualizada: ID ${historicalId}`);
};

// Función para eliminar una acción histórica
export const eliminarAccionHistorica = (historicalId: number) => {
  const stmt = db.prepare(`
    DELETE FROM historical WHERE historical_id = ?
  `);
  stmt.run(historicalId);
  console.log(`Acción histórica eliminada: ID ${historicalId}`);
};

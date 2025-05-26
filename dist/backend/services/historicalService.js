import { db } from '../database/connection.js';

// Validar si la fecha es válida
const validarFecha = (fecha) => {
  const date = new Date(fecha);
  if (isNaN(date.getTime())) {
    throw new Error('La fecha de la acción no es válida.');
  }
};

// Registrar una acción histórica
export const registrarAccionHistorica = async (historicalUserId, historical_user_name, action, actionDate, details) => {
  validarFecha(actionDate);

  await db.run(`
    INSERT INTO historical (historical_user_id, historical_user_name, action, action_date, details)
    VALUES (?, ?, ?, ?, ?)
  `, [historicalUserId, historical_user_name, action, actionDate, details]);

  console.log(`Acción histórica registrada: Usuario ${historicalUserId}, Acción: ${action}`);
};

// Obtener todas las acciones históricas
export const obtenerAccionesHistoricas = async () => {
  return await db.all(`SELECT * FROM historical`);
};

// Obtener acciones históricas de un usuario específico
export const obtenerAccionesHistoricasPorUsuario = async (historicalUserId) => {
  return await db.all(`SELECT * FROM historical WHERE historical_user_id = ?`, [historicalUserId]);
};

// Actualizar detalles de una acción histórica
export const actualizarDetallesAccionHistorica = async (historicalId, action, actionDate, details) => {
  validarFecha(actionDate);

  await db.run(`
    UPDATE historical
    SET action = ?, action_date = ?, details = ?
    WHERE historical_id = ?
  `, [action, actionDate, details, historicalId]);

  console.log(`Acción histórica actualizada: ID ${historicalId}`);
};

// Eliminar una acción histórica
export const eliminarAccionHistorica = async (historicalId) => {
  await db.run(`DELETE FROM historical WHERE historical_id = ?`, [historicalId]);
  console.log(`Acción histórica eliminada: ID ${historicalId}`);
};

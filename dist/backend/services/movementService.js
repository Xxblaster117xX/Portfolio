import { db } from '../database/connection.js';
import * as HistoricalService from './historicalService.js'; // Importa el servicio histórico

// Validaciones
const verificarCantidadValida = (cantidad) => {
  if (cantidad < 0) throw new Error('La cantidad del movimiento no puede ser negativa.');
  return true;
};

const verificarFechaValida = (fecha) => {
  const parsed = new Date(fecha);
  if (isNaN(parsed.getTime())) throw new Error('La fecha del movimiento no es válida.');
  return true;
};

const verificarTipoMovimientoValido = (tipo) => {
  const tiposValidos = ['entrada', 'salida', 'ajuste'];
  if (!tiposValidos.includes(tipo)) throw new Error('El tipo debe ser "entrada", "salida" o "ajuste".');
  return true;
};

// Registrar nuevo movimiento
export const registrarMovimiento = async (
  reagentId, movementType, movementQuantity,
  unit, quantityBefore, quantityAfter,
  movementDate, userId, description = ''
) => {
  verificarCantidadValida(movementQuantity);
  verificarCantidadValida(quantityBefore);
  verificarCantidadValida(quantityAfter);
  verificarFechaValida(movementDate);
  verificarTipoMovimientoValido(movementType);

  await db.run(`
    INSERT INTO movements (
      reagent_id, movement_type, movement_quantity, unit,
      quantity_before, quantity_after, movement_date,
      user_id, description
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    reagentId, movementType, movementQuantity, unit,
    quantityBefore, quantityAfter, movementDate,
    userId, description
  ]);

  console.log(`Movimiento registrado: Reactivo ID ${reagentId}, Tipo: ${movementType}`);

  // Registrar acción histórica relacionada
  await HistoricalService.registrarAccionHistorica(
    userId,
    'Movimiento registrado',
    new Date().toISOString(),
    `Reactivo ID: ${reagentId}, Tipo: ${movementType}, Cantidad: ${movementQuantity} ${unit}, Antes: ${quantityBefore}, Después: ${quantityAfter}, Descripción: ${description}`
  );
};

// Obtener todos los movimientos
export const obtenerMovimientos = async () => {
  return await db.all(`SELECT * FROM movements`);
};

// Por ID de reactivo
export const obtenerMovimientosPorReactivo = async (reagentId) => {
  return await db.all(`SELECT * FROM movements WHERE reagent_id = ?`, [reagentId]);
};

// Por ID de usuario
export const obtenerMovimientosPorUsuario = async (userId) => {
  return await db.all(`SELECT * FROM movements WHERE user_id = ?`, [userId]);
};

// Actualizar movimiento
export const actualizarMovimiento = async (
  movementId, reagentId, movementType, movementQuantity,
  unit, quantityBefore, quantityAfter,
  movementDate, userId, description
) => {
  verificarCantidadValida(movementQuantity);
  verificarCantidadValida(quantityBefore);
  verificarCantidadValida(quantityAfter);
  verificarFechaValida(movementDate);
  verificarTipoMovimientoValido(movementType);

  await db.run(`
    UPDATE movements SET
      reagent_id = ?, movement_type = ?, movement_quantity = ?, unit = ?,
      quantity_before = ?, quantity_after = ?, movement_date = ?,
      user_id = ?, description = ?
    WHERE movement_id = ?
  `, [
    reagentId, movementType, movementQuantity, unit,
    quantityBefore, quantityAfter, movementDate,
    userId, description, movementId
  ]);

  console.log(`Movimiento actualizado: ID ${movementId}`);
};

// Eliminar
export const eliminarMovimiento = async (movementId) => {
  await db.run(`DELETE FROM movements WHERE movement_id = ?`, [movementId]);
  console.log(`Movimiento eliminado: ID ${movementId}`);
};

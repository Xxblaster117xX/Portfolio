import { db } from '../database/connection.js';

// Verifica que la cantidad de movimiento no sea negativa
const verificarCantidadValida = (movementQuantity) => {
  if (movementQuantity < 0) {
    throw new Error('La cantidad del movimiento no puede ser negativa.');
  }
  return true;
};

// Verifica que la fecha del movimiento sea válida
const verificarFechaValida = (movementDate) => {
  const fecha = new Date(movementDate);
  if (isNaN(fecha.getTime())) {
    throw new Error('La fecha del movimiento no es válida.');
  }
  return true;
};

// Verifica que el tipo de movimiento sea válido
const verificarTipoMovimientoValido = (movementType) => {
  const tiposValidos = ['entrada', 'salida'];
  if (!tiposValidos.includes(movementType)) {
    throw new Error('El tipo de movimiento debe ser "entrada" o "salida".');
  }
  return true;
};

// Registrar un nuevo movimiento
export const registrarMovimiento = async (productIdMovement, movementType, movementQuantity, movementDate, userIdMovement) => {
  verificarCantidadValida(movementQuantity);
  verificarFechaValida(movementDate);
  verificarTipoMovimientoValido(movementType);

  await db.run(`
    INSERT INTO movements (product_id_movement, movement_type, movement_quantity, movement_date, user_id_movement)
    VALUES (?, ?, ?, ?, ?)
  `, [productIdMovement, movementType, movementQuantity, movementDate, userIdMovement]);

  console.log(`Movimiento registrado: Producto ID ${productIdMovement}, Tipo: ${movementType}`);
};

// Obtener todos los movimientos
export const obtenerMovimientos = async () => {
  return await db.all(`SELECT * FROM movements`);
};

// Obtener movimientos por ID de producto
export const obtenerMovimientosPorProducto = async (productIdMovement) => {
  return await db.all(`SELECT * FROM movements WHERE product_id_movement = ?`, [productIdMovement]);
};

// Obtener movimientos por ID de usuario
export const obtenerMovimientosPorUsuario = async (userIdMovement) => {
  return await db.all(`SELECT * FROM movements WHERE user_id_movement = ?`, [userIdMovement]);
};

// Actualizar un movimiento
export const actualizarMovimiento = async (movementId, productIdMovement, movementType, movementQuantity, movementDate, userIdMovement) => {
  verificarCantidadValida(movementQuantity);
  verificarFechaValida(movementDate);
  verificarTipoMovimientoValido(movementType);

  await db.run(`
    UPDATE movements
    SET product_id_movement = ?, movement_type = ?, movement_quantity = ?, movement_date = ?, user_id_movement = ?
    WHERE movement_id = ?
  `, [productIdMovement, movementType, movementQuantity, movementDate, userIdMovement, movementId]);

  console.log(`Movimiento actualizado: ID ${movementId}`);
};

// Eliminar un movimiento
export const eliminarMovimiento = async (movementId) => {
  await db.run(`DELETE FROM movements WHERE movement_id = ?`, [movementId]);
  console.log(`Movimiento eliminado: ID ${movementId}`);
};

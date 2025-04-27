import { db } from '../database/connection'; // Importar la conexión a la base de datos

// Función para verificar que la cantidad de movimiento sea válida (no negativa)
const verificarCantidadValida = (movementQuantity: number): boolean => {
  if (movementQuantity < 0) {
    throw new Error('La cantidad del movimiento no puede ser negativa.');
  }
  return true;
};

// Función para verificar que la fecha del movimiento sea válida
const verificarFechaValida = (movementDate: string): boolean => {
  const fecha = new Date(movementDate);
  if (isNaN(fecha.getTime())) {
    throw new Error('La fecha del movimiento no es válida.');
  }
  return true;
};

// Función para verificar que el tipo de movimiento sea válido (entrada o salida)
const verificarTipoMovimientoValido = (movementType: string): boolean => {
  const tiposValidos = ['entrada', 'salida'];
  if (!tiposValidos.includes(movementType)) {
    throw new Error('El tipo de movimiento debe ser "entrada" o "salida".');
  }
  return true;
};

// Función para registrar un nuevo movimiento
export const registrarMovimiento = (
  productIdMovement: number,
  movementType: string,
  movementQuantity: number,
  movementDate: string,
  userIdMovement: number
) => {
  // Validaciones
  verificarCantidadValida(movementQuantity);
  verificarFechaValida(movementDate);
  verificarTipoMovimientoValido(movementType);  // Validar el tipo de movimiento

  const stmt = db.prepare(`
    INSERT INTO movements (product_id_movement, movement_type, movement_quantity, movement_date, user_id_movement)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(productIdMovement, movementType, movementQuantity, movementDate, userIdMovement);
  console.log(`Movimiento registrado: Producto ID ${productIdMovement}, Tipo: ${movementType}`);
};

// Función para obtener todos los movimientos
export const obtenerMovimientos = () => {
  const stmt = db.prepare(`SELECT * FROM movements`);
  return stmt.all();
};

// Función para obtener movimientos por ID de producto
export const obtenerMovimientosPorProducto = (productIdMovement: number) => {
  const stmt = db.prepare(`SELECT * FROM movements WHERE product_id_movement = ?`);
  return stmt.all(productIdMovement);
};

// Función para obtener movimientos por ID de usuario
export const obtenerMovimientosPorUsuario = (userIdMovement: number) => {
  const stmt = db.prepare(`SELECT * FROM movements WHERE user_id_movement = ?`);
  return stmt.all(userIdMovement);
};

// Función para actualizar un movimiento (por ejemplo, cambiar la cantidad de movimiento)
export const actualizarMovimiento = (
  movementId: number,
  productIdMovement: number,
  movementType: string,
  movementQuantity: number,
  movementDate: string,
  userIdMovement: number
) => {
  // Validaciones
  verificarCantidadValida(movementQuantity);
  verificarFechaValida(movementDate);
  verificarTipoMovimientoValido(movementType);  // Validamos el tipo de movimiento

  const stmt = db.prepare(`
    UPDATE movements
    SET product_id_movement = ?, movement_type = ?, movement_quantity = ?, movement_date = ?, user_id_movement = ?
    WHERE movement_id = ?
  `);
  stmt.run(productIdMovement, movementType, movementQuantity, movementDate, userIdMovement, movementId);
  console.log(`Movimiento actualizado: ID ${movementId}`);
};

// Función para eliminar un movimiento
export const eliminarMovimiento = (movementId: number) => {
  const stmt = db.prepare(`
    DELETE FROM movements WHERE movement_id = ?
  `);
  stmt.run(movementId);
  console.log(`Movimiento eliminado: ID ${movementId}`);
};

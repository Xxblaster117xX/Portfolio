import { Return } from 'three/tsl';
import { db } from '../database/connection.js';

// Validación de formato de fecha (YYYY-MM-DD)
const esFechaValida = (fecha) => /^\d{4}-\d{2}-\d{2}$/.test(fecha);

// Validación de valores numéricos no negativos
const esNumeroValido = (numero) => {
  if (typeof numero === 'string') {
    numero = numero.replace(',', '.');
  }
  const n = parseFloat(numero);
  return !isNaN(n) && n >= 0;
};



// Validación de texto no vacío y tipo string
const esTextoValido = (texto) => {
  try {
    return typeof texto === 'string' && texto.trim() !== '';
  } catch (error) {
    console.error('Error en esTextoValido con valor:', texto, error);
    throw error;
  }
};

// Convertir snake_case a camelCase
const mapReagentToCamelCase = (r) => ({
  reagentId: r.reagent_id,
  reagentCas: r.reagent_cas,
  reagentName: r.reagent_name,
  reagentQuantity: r.reagent_quantity,
  reagentUnit: r.reagent_unit,
  reagentAddDate: r.reagent_add_date,
  reagentExpirationDate: r.reagent_expiration_date,
  reagentSupplier: r.reagent_supplier,
  reagentType: r.reagent_type,
  reagentFDS: r.reagent_fds,
  reagentState: r.reagent_state || 'disponible'
});

// Insertar un nuevo reactivo
export const insertarReactivo = async (
  reagentCas, reagentName, reagentQuantity, reagentUnit,
  reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS
) => {
  if (!esTextoValido(reagentCas)) throw new Error('El CAS del reactivo no puede estar vacío.');
  if (!esTextoValido(reagentName)) throw new Error('El nombre del reactivo no puede estar vacío.');
 if (typeof reagentQuantity === 'string') {
  reagentQuantity = parseFloat(reagentQuantity.replace(',', '.'));
}
  if (!esTextoValido(reagentUnit)) throw new Error('La unidad del reactivo no puede estar vacío');
  if (!esFechaValida(reagentAddDate)) throw new Error('La fecha de adición debe tener el formato YYYY-MM-DD.');
  if (!esFechaValida(reagentExpirationDate)) throw new Error('La fecha de expiración debe tener el formato YYYY-MM-DD.');
  if (!esTextoValido(reagentSupplier)) throw new Error('El proveedor no puede estar vacío.');
  if (!esTextoValido(reagentType)) throw new Error('El tipo de reactivo no puede estar vacío.');
  if (!esTextoValido(reagentFDS)) throw new Error('La FDS del reactivo no puede estar vacía.');

  const result = await db.run(`
    INSERT INTO reagents (
      reagent_cas, reagent_name, reagent_quantity, reagent_unit,
      reagent_add_date, reagent_expiration_date, reagent_supplier, reagent_type, reagent_fds, reagent_state
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    reagentCas, reagentName, reagentQuantity, reagentUnit,
    reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS,
    'disponible'
  ]);

  console.log(`Reactivo insertado: ${reagentName} con ID ${result.lastID}`);
  return result.lastID;
};

// Obtener todos los reactivos
export const obtenerReactivos = async () => {
  const reactivos = await db.all(`SELECT * FROM reagents`);
  return reactivos.map(mapReagentToCamelCase);
};

// Obtener un reactivo por su ID
export const obtenerReactivoPorId = async (reagentId) => {
  const r = await db.get(`SELECT * FROM reagents WHERE reagent_id = ?`, [reagentId]);
  return r ? mapReagentToCamelCase(r) : null;
};

// Actualizar un reactivo
export const actualizarReactivo = async (
  reagentId, reagentCas, reagentName, reagentQuantity, reagentUnit,
  reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS, reagentState
) => {
  console.log('Actualizando reactivo con:', {
    reagentId, reagentCas, reagentName, reagentQuantity, reagentUnit,
    reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS, reagentState
  });

  if (!esTextoValido(reagentCas)) throw new Error('El CAS del reactivo no puede estar vacío.');
  if (!esTextoValido(reagentName)) throw new Error('El nombre del reactivo no puede estar vacío.');
  if (typeof reagentQuantity === 'string') {
  reagentQuantity = parseFloat(reagentQuantity.replace(',', '.'));
}
  if (!esTextoValido(reagentUnit)) throw new Error('La unidad del reactivo no puede estar vacío.');
  if (!esFechaValida(reagentAddDate)) throw new Error('La fecha de adición debe tener el formato YYYY-MM-DD.');
  if (!esFechaValida(reagentExpirationDate)) throw new Error('La fecha de expiración debe tener el formato YYYY-MM-DD.');
  if (!esTextoValido(reagentSupplier)) throw new Error('El proveedor no puede estar vacío.');
  if (!esTextoValido(reagentType)) throw new Error('El tipo de reactivo no puede estar vacío.');
  if (!esTextoValido(reagentFDS)) throw new Error('La FDS del reactivo no puede estar vacía.');
  if (!esTextoValido(reagentState)) throw new Error('El estado del reactivo no puede estar vacío.');

  await db.run(`
    UPDATE reagents SET
      reagent_cas = ?, reagent_name = ?, reagent_quantity = ?, reagent_unit = ?,
      reagent_add_date = ?, reagent_expiration_date = ?, reagent_supplier = ?, reagent_type = ?, reagent_fds = ?, reagent_state = ?
    WHERE reagent_id = ?
  `, [
    reagentCas, reagentName, reagentQuantity, reagentUnit,
    reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS,
    reagentState,
    reagentId
  ]);

  console.log(`Reactivo actualizado: ${reagentName}`);
};

// Eliminar un reactivo
export const eliminarReactivo = async (reagentId) => {
  await db.run(`DELETE FROM reagents WHERE reagent_id = ?`, [reagentId]);
  console.log(`Reactivo eliminado: ID ${reagentId}`);
};

// Obtener reactivos por nombre
export const obtenerReactivosPorNombre = async (nombre) => {
  const resultados = await db.all(`SELECT * FROM reagents WHERE reagent_name LIKE ?`, [`%${nombre}%`]);
  return resultados.map(mapReagentToCamelCase);
};

// Verificar si un reactivo ya existe por nombre
export const verificarReactivoExistente = async (reagentName) => {
  const result = await db.get(`SELECT 1 FROM reagents WHERE reagent_name = ? LIMIT 1`, [reagentName]);
  return !!result;
};

// Cambiar estado del reactivo a 'escogido'
export const marcarReactivoComoEscogido = async (reagentId) => {
  const reactivo = await obtenerReactivoPorId(reagentId);
  if (!reactivo) throw new Error('Reactivo no encontrado');

  if (reactivo.reagentState === 'escogido') {
    throw new Error('El reactivo ya está marcado como escogido');
  }

  await db.run(
    `UPDATE reagents SET reagent_state = ? WHERE reagent_id = ?`,
    ['escogido', reagentId]
  );

  console.log(`Reactivo ID ${reagentId} marcado como escogido.`);
};


// Introducir cantidad gastada y actualizar cantidad total y estado
export const introducirReactivo = async (reagentId, cantidadGastada, userId) => {
  console.log('introducirReactivo called with:', { reagentId, cantidadGastada, userId });

  const cantidadNum = parseFloat(cantidadGastada);
  if (isNaN(cantidadNum) || cantidadNum < 0) throw new Error('Cantidad gastada inválida');

  const reactivo = await obtenerReactivoPorId(reagentId);
  if (!reactivo) throw new Error('Reactivo no encontrado');

  console.log('Reactivo actual:', reactivo);

  const nuevaCantidad = reactivo.reagentQuantity - cantidadNum;
  console.log('nuevaCantidad:', nuevaCantidad);

  if (nuevaCantidad < 0) {
    throw new Error('Cantidad gastada mayor que la cantidad disponible');
  }

  //  CAMBIO CLAVE: poner 'disponible' si todavía queda cantidad, 'agotado' si llega a 0
  const nuevoEstado = nuevaCantidad === 0 ? 'agotado' : 'disponible';

  await db.run(
    `UPDATE reagents SET reagent_quantity = ?, reagent_state = ? WHERE reagent_id = ?`,
    [nuevaCantidad, nuevoEstado, reagentId]
  );

  console.log(`Reactivo ID ${reagentId} actualizado: cantidad = ${nuevaCantidad}, estado = ${nuevoEstado}`);
};



// Obtener reactivos filtrando por estado
export const obtenerReactivosPorEstado = async (estado) => {
  const resultados = await db.all(`SELECT * FROM reagents WHERE reagent_state = ?`, [estado]);
  return resultados.map(mapReagentToCamelCase);
};

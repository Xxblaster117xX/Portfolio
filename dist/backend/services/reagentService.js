import { db } from '../database/connection.js';

// Validación de formato de fecha (YYYY-MM-DD)
const esFechaValida = (fecha) => /^\d{4}-\d{2}-\d{2}$/.test(fecha);

// Validación de valores numéricos no negativos
const esNumeroValido = (numero) => !isNaN(numero) && numero >= 0;

// Validación de texto no vacío
const esTextoValido = (texto) => texto.trim() !== '';

// Insertar un nuevo reactivo
export const insertarReactivo = async (
  reagentCas, reagentName, reagentQuantity, reagentUnit,
  reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS
) => {
  if (!esTextoValido(reagentCas)) throw new Error('El CAS del reactivo no puede estar vacío.');
  if (!esTextoValido(reagentName)) throw new Error('El nombre del reactivo no puede estar vacío.');
  if (!esNumeroValido(reagentQuantity)) throw new Error('La cantidad debe ser un número válido y no negativo.');
  if (!esNumeroValido(reagentUnit)) throw new Error('La unidad debe ser un número válido y no negativo.');
  if (!esFechaValida(reagentAddDate)) throw new Error('La fecha de adición debe tener el formato YYYY-MM-DD.');
  if (!esFechaValida(reagentExpirationDate)) throw new Error('La fecha de expiración debe tener el formato YYYY-MM-DD.');
  if (!esTextoValido(reagentSupplier)) throw new Error('El proveedor no puede estar vacío.');
  if (!esTextoValido(reagentType)) throw new Error('El tipo de reactivo no puede estar vacío.');
  if (!esTextoValido(reagentFDS)) throw new Error('La FDS del reactivo no puede estar vacía.');

  const result = await db.run(`
    INSERT INTO reagents (
      reagent_cas, reagent_name, reagent_quantity, reagent_unit,
      reagent_add_date, reagent_expiration_date, reagent_supplier, reagent_type, reagent_fds
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    reagentCas, reagentName, reagentQuantity, reagentUnit,
    reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS
  ]);

  console.log(`Reactivo insertado: ${reagentName} con ID ${result.lastID}`);

  return result.lastID;  // <-- Retornar el id generado
};


// Obtener todos los reactivos
export const obtenerReactivos = async () => {
  return await db.all(`SELECT * FROM reagents`);
};

// Obtener un reactivo por su ID
export const obtenerReactivoPorId = async (reagentId) => {
  return await db.get(`SELECT * FROM reagents WHERE reagent_id = ?`, [reagentId]);
};

// Actualizar un reactivo
export const actualizarReactivo = async (
  reagentId, reagentCas, reagentName, reagentQuantity, reagentUnit,
  reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS
) => {
  if (!esTextoValido(reagentCas)) throw new Error('El CAS del reactivo no puede estar vacío.');
  if (!esTextoValido(reagentName)) throw new Error('El nombre del reactivo no puede estar vacío.');
  if (!esNumeroValido(reagentQuantity)) throw new Error('La cantidad debe ser un número válido y no negativo.');
  if (!esNumeroValido(reagentUnit)) throw new Error('La unidad debe ser un número válido y no negativo.');
  if (!esFechaValida(reagentAddDate)) throw new Error('La fecha de adición debe tener el formato YYYY-MM-DD.');
  if (!esFechaValida(reagentExpirationDate)) throw new Error('La fecha de expiración debe tener el formato YYYY-MM-DD.');
  if (!esTextoValido(reagentSupplier)) throw new Error('El proveedor no puede estar vacío.');
  if (!esTextoValido(reagentType)) throw new Error('El tipo de reactivo no puede estar vacío.');
  if (!esTextoValido(reagentFDS)) throw new Error('La FDS del reactivo no puede estar vacía.');

  await db.run(`
    UPDATE reagents SET
      reagent_cas = ?, reagent_name = ?, reagent_quantity = ?, reagent_unit = ?,
      reagent_add_date = ?, reagent_expiration_date = ?, reagent_supplier = ?, reagent_type = ?, reagent_fds = ?
    WHERE reagent_id = ?
  `, [
    reagentCas, reagentName, reagentQuantity, reagentUnit,
    reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS,
    reagentId
  ]);

  console.log(`Reactivo actualizado: ${reagentName}`);
};

// Eliminar un reactivo
export const eliminarReactivo = async (reagentId) => {
  await db.run(`DELETE FROM reagents WHERE reagent_id = ?`, [reagentId]);
  console.log(`Reactivo eliminado: ID ${reagentId}`);
};

// Obtener reactivos por nombre (búsqueda con LIKE)
export const obtenerReactivosPorNombre = async (nombre) => {
  return await db.all(`SELECT * FROM reagents WHERE reagent_name LIKE ?`, [`%${nombre}%`]);
};

// Verificar si un reactivo ya existe por nombre
export const verificarReactivoExistente = async (reagentName) => {
  const result = await db.get(`SELECT 1 FROM reagents WHERE reagent_name = ? LIMIT 1`, [reagentName]);
  return !!result;
};

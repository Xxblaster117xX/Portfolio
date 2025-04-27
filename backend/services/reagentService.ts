import { db } from '../database/connection'; // Importamos la conexión a la base de datos

// Validación de formato de fecha (YYYY-MM-DD)
const esFechaValida = (fecha: string): boolean => {
  const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
  return regexFecha.test(fecha);
};

// Validación de valores numéricos no negativos
const esNumeroValido = (numero: number): boolean => {
  return !isNaN(numero) && numero >= 0;
};

// Validación de texto no vacío
const esTextoValido = (texto: string): boolean => {
  return texto.trim() !== '';
};

// Insertar un nuevo reactivo
export const insertarReactivo = (
  reagentCas: string,
  reagentName: string,
  reagentQuantity: number,
  reagentUnit: number,
  reagentAddDate: string,
  reagentExpirationDate: string,
  reagentSupplier: string,
  reagentType: string,
  reagentFDS: string
) => {
  // Validaciones
  if (!esTextoValido(reagentCas)) {
    throw new Error('El CAS del reactivo no puede estar vacío.');
  }
  if (!esTextoValido(reagentName)) {
    throw new Error('El nombre del reactivo no puede estar vacío.');
  }
  if (!esNumeroValido(reagentQuantity)) {
    throw new Error('La cantidad del reactivo debe ser un número válido y no negativo.');
  }
  if (!esNumeroValido(reagentUnit)) {
    throw new Error('La unidad del reactivo debe ser un número válido y no negativo.');
  }
  if (!esFechaValida(reagentAddDate)) {
    throw new Error('La fecha de adición debe tener el formato YYYY-MM-DD.');
  }
  if (!esFechaValida(reagentExpirationDate)) {
    throw new Error('La fecha de expiración debe tener el formato YYYY-MM-DD.');
  }
  if (!esTextoValido(reagentSupplier)) {
    throw new Error('El proveedor del reactivo no puede estar vacío.');
  }
  if (!esTextoValido(reagentType)) {
    throw new Error('El tipo de reactivo no puede estar vacío.');
  }
  if (!esTextoValido(reagentFDS)) {
    throw new Error('La FDS del reactivo no puede estar vacía.');
  }

  // Insertar el reactivo en la base de datos
  const stmt = db.prepare(`
    INSERT INTO reagents (
      reagent_cas, reagent_name, reagent_quantity, reagent_unit,
      reagent_add_date, reagent_expiration_date, reagent_supplier, reagent_type, reagent_fds
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(reagentCas, reagentName, reagentQuantity, reagentUnit, reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS);
  console.log(`Reactivo insertado: ${reagentName}`);
};

// Obtener todos los reactivos
export const obtenerReactivos = () => {
  const stmt = db.prepare(`SELECT * FROM reagents`);
  return stmt.all();
};

// Obtener un reactivo por su ID
export const obtenerReactivoPorId = (reagentId: number) => {
  const stmt = db.prepare(`SELECT * FROM reagents WHERE reagent_id = ?`);
  return stmt.get(reagentId);
};

// Actualizar un reactivo
export const actualizarReactivo = (
  reagentId: number,
  reagentCas: string,
  reagentName: string,
  reagentQuantity: number,
  reagentUnit: number,
  reagentAddDate: string,
  reagentExpirationDate: string,
  reagentSupplier: string,
  reagentType: string,
  reagentFDS: string
) => {
  // Validaciones
  if (!esTextoValido(reagentCas)) {
    throw new Error('El CAS del reactivo no puede estar vacío.');
  }
  if (!esTextoValido(reagentName)) {
    throw new Error('El nombre del reactivo no puede estar vacío.');
  }
  if (!esNumeroValido(reagentQuantity)) {
    throw new Error('La cantidad del reactivo debe ser un número válido y no negativo.');
  }
  if (!esNumeroValido(reagentUnit)) {
    throw new Error('La unidad del reactivo debe ser un número válido y no negativo.');
  }
  if (!esFechaValida(reagentAddDate)) {
    throw new Error('La fecha de adición debe tener el formato YYYY-MM-DD.');
  }
  if (!esFechaValida(reagentExpirationDate)) {
    throw new Error('La fecha de expiración debe tener el formato YYYY-MM-DD.');
  }
  if (!esTextoValido(reagentSupplier)) {
    throw new Error('El proveedor del reactivo no puede estar vacío.');
  }
  if (!esTextoValido(reagentType)) {
    throw new Error('El tipo de reactivo no puede estar vacío.');
  }
  if (!esTextoValido(reagentFDS)) {
    throw new Error('La FDS del reactivo no puede estar vacía.');
  }

  // Actualizar el reactivo en la base de datos
  const stmt = db.prepare(`
    UPDATE reagents
    SET reagent_cas = ?, reagent_name = ?, reagent_quantity = ?, reagent_unit = ?,
        reagent_add_date = ?, reagent_expiration_date = ?, reagent_supplier = ?, reagent_type = ?, reagent_fds = ?
    WHERE reagent_id = ?
  `);
  stmt.run(reagentCas, reagentName, reagentQuantity, reagentUnit, reagentAddDate, reagentExpirationDate, reagentSupplier, reagentType, reagentFDS, reagentId);
  console.log(`Reactivo actualizado: ${reagentName}`);
};

// Eliminar un reactivo
export const eliminarReactivo = (reagentId: number) => {
  const stmt = db.prepare(`
    DELETE FROM reagents WHERE reagent_id = ?
  `);
  stmt.run(reagentId);
  console.log(`Reactivo eliminado: ID ${reagentId}`);
};

// Función para obtener todos los reactivos cuyo nombre contenga una cadena de texto (opcional)
export const obtenerReactivosPorNombre = (nombre: string) => {
  const stmt = db.prepare(`
    SELECT * FROM reagents WHERE reagent_name LIKE ?
  `);
  return stmt.all(`%${nombre}%`);
};

// Función para verificar si un reactivo existe en la base de datos por su nombre
export const verificarReactivoExistente = (reagentName: string): boolean => {
  const stmt = db.prepare(`
    SELECT 1 FROM reagents WHERE reagent_name = ? LIMIT 1
  `);
  const result = stmt.get(reagentName);
  return !!result;
};

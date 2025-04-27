import { db } from '../database/connection'; // Importa la conexión a la base de datos
import bcrypt from 'bcrypt';

// Función para verificar si una contraseña es fuerte
const verificarContraseñaFuerte = (password: string): boolean => {
  // La contraseña debe tener al menos 8 caracteres, una letra, un número y un carácter especial
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Función para encriptar contraseñas
const encriptarContraseña = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Insertar un nuevo usuario
export const insertarUsuario = async (userName: string, userGmail: string, userPassword: string, rol: string) => {
  // Verificar que el correo no esté registrado previamente
  const usuarioExistente = obtenerUsuarioPorGmail(userGmail);
  if (usuarioExistente) {
    throw new Error('El correo electrónico ya está registrado.');
  } 

  // Verificar que la contraseña sea fuerte
  if (!verificarContraseñaFuerte(userPassword)) {
    throw new Error('La contraseña debe tener al menos 8 caracteres, una letra, un número y un carácter especial.');
  }

  // Encriptar la contraseña
  const hashedPassword = await encriptarContraseña(userPassword);

  // Insertar el usuario en la base de datos
  const stmt = db.prepare(`
    INSERT INTO users (user_name, user_gmail, user_password, rol)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(userName, userGmail, hashedPassword, rol);
};

// Obtener todos los usuarios
export const obtenerUsuarios = () => {
  const stmt = db.prepare(`SELECT * FROM users`);
  return stmt.all();
};

// Obtener un usuario por su Gmail
export const obtenerUsuarioPorGmail = (userGmail: string) => {
  const stmt = db.prepare(`SELECT * FROM users WHERE user_gmail = ?`);
  return stmt.get(userGmail);
};

// Actualizar la contraseña de un usuario
export const actualizarContraseña = async (userId: number, nuevaContraseña: string) => {
  if (!verificarContraseñaFuerte(nuevaContraseña)) {
    throw new Error('La contraseña debe tener al menos 8 caracteres, una letra, un número y un carácter especial.');
  }

  // Encriptar la nueva contraseña
  const hashedPassword = await encriptarContraseña(nuevaContraseña);

  // Actualizar la contraseña en la base de datos
  const stmt = db.prepare(`
    UPDATE users SET user_password = ? WHERE user_id = ?
  `);
  stmt.run(hashedPassword, userId);
};

// Función para eliminar a un usuario
export const eliminarUsuario = (userId: number) => {
  const stmt = db.prepare(`
    DELETE FROM users WHERE user_id = ?
  `);
  stmt.run(userId);
};

// Verificar si la contraseña ingresada coincide con la de la base de datos
export const verificarContraseña = async (userGmail: string, password: string): Promise<boolean> => {
  const usuario = obtenerUsuarioPorGmail(userGmail);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const esValida = await bcrypt.compare(password, usuario.user_password);
  return esValida;
};

// Función para verificar si el correo electrónico tiene un formato válido
const verificarCorreoValido = (email: string): boolean => {
  // Expresión regular para validar el formato del correo
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// Función para verificar si el correo electrónico ya está registrado
export const verificarCorreoRegistrado = (email: string): boolean => {
  const usuario = obtenerUsuarioPorGmail(email);
  return usuario ? true : false;
};

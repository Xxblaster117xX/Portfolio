import { db } from '../database/connection'; // Importa la conexión a la base de datos
import bcryptjs from 'bcryptjs';

// Interfaz para representar un usuario
export interface Usuario {
  user_id: number;
  user_name: string;
  user_gmail: string;
  user_password: string;
  rol: string;
  isVerified: boolean;
}

// Función para verificar si una contraseña es fuerte
const verificarContraseñaFuerte = (password: string): boolean => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Función para encriptar contraseñas
const encriptarContraseña = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

// Función para verificar si el correo electrónico tiene un formato válido
const verificarCorreoValido = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// Verificar si un usuario está verificado
export const verificarUsuario = (userGmail: string) => {
  const stmt = db.prepare(`
    UPDATE users SET isVerified = ? WHERE user_gmail = ?
  `);
  const result = stmt.run(true, userGmail);
  if (result.changes === 0) {
    throw new Error('No se encontró el usuario para verificar.');
  }
};

// Insertar un nuevo usuario
export const insertarUsuario = async (userName: string, userGmail: string, userPassword: string, rol: string) => {
  if (!verificarCorreoValido(userGmail)) {
    throw new Error('El correo electrónico no tiene un formato válido.');
  }

  const usuarioExistente = obtenerUsuarioPorGmail(userGmail);
  if (usuarioExistente) {
    throw new Error('El correo electrónico ya está registrado.');
  }

  if (!verificarContraseñaFuerte(userPassword)) {
    throw new Error(
      'La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial.'
    );
  }

  const hashedPassword = await encriptarContraseña(userPassword);

  const stmt = db.prepare(`
    INSERT INTO users (user_name, user_gmail, user_password, rol, isVerified)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(userName, userGmail, hashedPassword, rol, false);
};

// Obtener todos los usuarios
export const obtenerUsuarios = (): Usuario[] => {
  const stmt = db.prepare(`SELECT * FROM users`);
  return stmt.all() as Usuario[];
};

// Obtener un usuario por su Gmail
export const obtenerUsuarioPorGmail = (userGmail: string): Usuario | undefined => {
  const stmt = db.prepare(`SELECT * FROM users WHERE user_gmail = ?`);
  return stmt.get(userGmail) as Usuario | undefined;
};

// Actualizar la contraseña de un usuario
export const actualizarContraseña = async (userId: number, nuevaContraseña: string) => {
  if (!verificarContraseñaFuerte(nuevaContraseña)) {
    throw new Error(
      'La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial.'
    );
  }

  const hashedPassword = await encriptarContraseña(nuevaContraseña);

  const stmt = db.prepare(`
    UPDATE users SET user_password = ? WHERE user_id = ?
  `);
  const result = stmt.run(hashedPassword, userId);
  if (result.changes === 0) {
    throw new Error('No se encontró el usuario para actualizar la contraseña.');
  }
};

// Eliminar un usuario
export const eliminarUsuario = (userId: number) => {
  const stmt = db.prepare(`
    DELETE FROM users WHERE user_id = ?
  `);
  const result = stmt.run(userId);
  if (result.changes === 0) {
    throw new Error('No se encontró el usuario para eliminar.');
  }
};

// Verificar la contraseña de un usuario
export const verificarContraseña = async (userGmail: string, password: string): Promise<boolean> => {
  const usuario = obtenerUsuarioPorGmail(userGmail);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  if (!usuario.isVerified) {
    throw new Error('El usuario no ha completado la verificación.');
  }

  return bcryptjs.compare(password, usuario.user_password);
};
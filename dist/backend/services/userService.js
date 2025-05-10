import { db } from '../database/connection.js'; // Asegúrate de que la conexión está exportada correctamente
import bcryptjs from 'bcryptjs';

class UserService {
  // Verifica si una contraseña es fuerte
  static verificarContraseñaFuerte(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  // Encripta la contraseña
  static async encriptarContraseña(password) {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }

  // Valida el formato del correo
  static verificarCorreoValido(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  // Verifica un usuario (marca como verificado)
  static async verificarUsuario(userGmail) {
    try {
      const result = await db.run(
        `UPDATE users SET isVerified = ? WHERE user_gmail = ?`,
        [true, userGmail]
      );

      if (result.changes === 0) {
        throw new Error('No se encontró el usuario para verificar.');
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      throw error;
    }
  }

  // Inserta un nuevo usuario
static async insertarUsuario(userName, userGmail, userPassword, rol) {
    try {
      if (!this.verificarCorreoValido(userGmail)) {
        throw new Error('El correo electrónico no tiene un formato válido.');
      }

      const usuarioExistente = await this.obtenerUsuarioPorGmail(userGmail);
      if (usuarioExistente) {
        throw new Error('El correo electrónico ya está registrado.');
      }

      if (!this.verificarContraseñaFuerte(userPassword)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial.');
      }

      const hashedPassword = await this.encriptarContraseña(userPassword);

      await db.run(
        `INSERT INTO users (user_name, user_gmail, user_password, rol, isVerified)
         VALUES (?, ?, ?, ?, ?)`,
        [userName, userGmail, hashedPassword, rol, false]
      );
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      throw error;
    }
  }

  // Obtiene todos los usuarios
  static async obtenerUsuarios() {
    try {
      return await db.all(`SELECT * FROM users`);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Obtiene un usuario por correo
  static async obtenerUsuarioPorGmail(userGmail) {
    try {
      return await db.get(`SELECT * FROM users WHERE user_gmail = ?`, [userGmail]);
    } catch (error) {
      console.error('Error al obtener usuario por Gmail:', error);
      throw error;
    }
  }

  // Actualiza la contraseña de un usuario
  static async actualizarContraseña(userId, nuevaContraseña) {
    try {
      if (!this.verificarContraseñaFuerte(nuevaContraseña)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial.');
      }

      const hashedPassword = await this.encriptarContraseña(nuevaContraseña);
      const result = await db.run(
        `UPDATE users SET user_password = ? WHERE user_id = ?`,
        [hashedPassword, userId]
      );

      if (result.changes === 0) {
        throw new Error('No se encontró el usuario para actualizar la contraseña.');
      }
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      throw error;
    }
  }

  // Elimina un usuario
  static async eliminarUsuario(userId) {
    try {
      const result = await db.run(`DELETE FROM users WHERE user_id = ?`, [userId]);

      if (result.changes === 0) {
        throw new Error('No se encontró el usuario para eliminar.');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  // Verifica contraseña al hacer login
  static async verificarContraseña(userGmail, password) {
    try {
      const usuario = await this.obtenerUsuarioPorGmail(userGmail);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      if (!usuario.isVerified) {
        throw new Error('El usuario no ha completado la verificación.');
      }

      return await bcryptjs.compare(password, usuario.user_password);
    } catch (error) {
      console.error('Error al verificar contraseña:', error);
      throw error;
    }
  }
}

// Exporta la clase UserService para poder usarla en otros módulos
export default UserService;

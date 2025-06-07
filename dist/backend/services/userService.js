import { db } from '../database/connection.js';
import bcryptjs from 'bcryptjs';

// Clase para implementar los método que tendrá el usuario en : registro, incio de sesión y  verificación de código 
class UserService {
  static verificarContraseñaFuerte(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  // Método para encriptar la contraseña del usuario
  static async encriptarContraseña(password) {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }
// Método para verificar si el correo electrónico tiene un formato válido
  static verificarCorreoValido(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
// Método para verificar si el usuario ya está verificado
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

  // Método para insertar un nuevo usuario en la base de datos
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

  // Método para iniciar sesión y obtener el usuario por correo electrónico
   static async obtenerUsuarios() {
    try {
      return await db.all(`SELECT * FROM users`);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // Método para obtener un usuario por su ID
  static async ObtenerUsuariosExceptoAdmin(){
    try{
      return await db.all('SELECT * FROM users WHERE user_id != 1');
    }catch(error)
    {
      console.error('Error al obtener usuarios excepto admin:', error);
      throw error;
    }
  }

  // Método para obtener un usuario por su correo electrónico
  static async obtenerUsuarioPorGmail(userGmail) {
    try {
      return await db.get(`SELECT * FROM users WHERE user_gmail = ?`, [userGmail]);
    } catch (error) {
      console.error('Error al obtener usuario por Gmail:', error);
      throw error;
    }
  }

  // Método para obtener un usuario por su ID
  static async actualizarContrasena(userGmail, nuevaContraseña) {
    try {
      if (!this.verificarContraseñaFuerte(nuevaContraseña)) {
        throw new Error('La contraseña debe tener al menos 8 caracteres, incluir una letra, un número y un carácter especial.');
      }

      const hashedPassword = await this.encriptarContraseña(nuevaContraseña);
      const result = await db.run(
        `UPDATE users SET user_password = ? WHERE user_gmail = ?`,
        [hashedPassword, userGmail]
      );

      if (result.changes === 0) {
        throw new Error('No se encontró el usuario para actualizar la contraseña.');
      }
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      throw error;
    }
  }

  // Método para obtener un usuario por su ID
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

  // Método para verificar la contraseña del usuario al iniciar sesión
  static async verificarContraseña(userGmail, password) {
    try {
      const usuario = await this.obtenerUsuarioPorGmail(userGmail);

      if (!usuario || !usuario.isVerified) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      const coincide = await bcryptjs.compare(password, usuario.user_password);

      if (!coincide) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      return true;
    } catch (error) {
      console.error('Error al verificar contraseña:', error);
      throw error;
    }
  }

// Método para verificar si un usuario está verificado  
  static async existeUsuarioVerificado(userGmail) {
    const usuario = await this.obtenerUsuarioPorGmail(userGmail);
    return !!usuario && usuario.isVerified;
  }

  // Método para verificar si un usuario ya está registrado
  static async usuarioYaRegistrado(userGmail) {
    const usuario = await this.obtenerUsuarioPorGmail(userGmail);
    return !!usuario;
  }
}

export default UserService;

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import UserService from '../dist/backend/services/userService.js'; // Cambié la importación aquí
import {
  enviarCodigoVerificacion,
  enviarCorreoRestablecerContrasena,
  enviarCorreoNotificacion,
} from '../dist/backend/services/emailService.js';

let mainWindow;
const verificationCodes = new Map(); // Almacena los códigos de verificación

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://localhost:5173');
});

// Manejar el registro de usuario
ipcMain.handle('registrar-usuario', async (event, { userName, userGmail, userPassword, rol }) => {
  try {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(userGmail, codigo);
    await enviarCodigoVerificacion(userGmail, codigo);
    await UserService.insertarUsuario(userName, userGmail, userPassword, rol); // Cambié esta línea
    return { success: true, message: 'Usuario registrado. Verifica tu correo.' };
  } catch (error) {
    console.error('Error en registrar-usuario:', error);
    return { success: false, message: 'Error al registrar el usuario.' };
  }
});

// Manejar la verificación del código
ipcMain.handle('verificar-codigo', (event, { userGmail, codigo }) => {
  const storedCode = verificationCodes.get(userGmail);
  if (storedCode === codigo) {
    verificationCodes.delete(userGmail);
    UserService.verificarUsuario(userGmail); // Cambié esta línea
    return { success: true, message: 'Verificación exitosa.' };
  } else {
    return { success: false, message: 'Código de verificación incorrecto.' };
  }
});

// Manejar el inicio de sesión
ipcMain.handle('iniciar-sesion', async (event, { userGmail, userPassword }) => {
  try {
    const esValido = await UserService.verificarContraseña(userGmail, userPassword); // Cambié esta línea
    if (esValido) {
      return { success: true, message: 'Inicio de sesión exitoso.' };
    } else {
      return { success: false, message: 'Correo o contraseña incorrectos.' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
});

// NUEVOS handlers para correos adicionales
ipcMain.handle('enviar-correo-reset', async (event, correo, enlace) => {
  try {
    await enviarCorreoRestablecerContrasena(correo, enlace);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar correo de restablecimiento:', error);
    return { success: false, message: 'No se pudo enviar el correo de restablecimiento.' };
  }
});

ipcMain.handle('enviar-notificacion', async (event, correo, mensaje) => {
  try {
    await enviarCorreoNotificacion(correo, mensaje);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    return { success: false, message: 'No se pudo enviar la notificación.' };
  }
});

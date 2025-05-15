import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import UserService from '../dist/backend/services/userService.js';
import {
  enviarCodigoVerificacion,
  enviarCorreoRestablecerContrasena,
  enviarCorreoNotificacion,
} from '../dist/backend/services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
const verificationCodes = new Map();
const pendingRegistrations = new Map();

function createMainWindow() {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://localhost:5173');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Función para probar el envío de correo al iniciar
async function pruebaEnvioCorreo() {
  try {
    const testEmail = 'acarreterog01@santiagoapostol.net';  // Cambia aquí por tu email de prueba
    const codigoPrueba = '123456';
    console.log('Probando envío de correo...');
    await enviarCodigoVerificacion(testEmail, codigoPrueba);
    console.log('Correo de prueba enviado correctamente');
  } catch (error) {
    console.error('Error enviando correo de prueba:', error);
  }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    await pruebaEnvioCorreo();  // <-- Ejecuta la prueba justo al iniciar
    createMainWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (mainWindow === null) createMainWindow();
  });
}

// Resto de handlers igual que tienes, sin cambios

ipcMain.handle('registrar-usuario', async (event, { userName, userGmail, userPassword, rol }) => {
  try {
    if (await UserService.existeUsuarioVerificado(userGmail)) {
      return { success: false, message: 'El correo ya está registrado y verificado.' };
    }

    if (!UserService.verificarCorreoValido(userGmail)) {
      return { success: false, message: 'Correo electrónico inválido.' };
    }

    if (!UserService.verificarContraseñaFuerte(userPassword)) {
      return {
        success: false,
        message: 'Contraseña débil. Debe tener mínimo 8 caracteres, una letra, un número y un símbolo.',
      };
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(userGmail, codigo);
    pendingRegistrations.set(userGmail, { userName, userPassword, rol });

    await enviarCodigoVerificacion(userGmail, codigo);

    return { success: true, message: 'Código enviado al correo. Verifícalo para completar el registro.' };
  } catch (error) {
    console.error('Error en registrar-usuario:', error);
    return { success: false, message: 'Error al iniciar el proceso de registro.' };
  }
});

ipcMain.handle('verificar-codigo', async (event, { userGmail, codigo }) => {
  const storedCode = verificationCodes.get(userGmail);

  if (storedCode !== codigo) {
    return { success: false, message: 'Código de verificación incorrecto.' };
  }

  try {
    const userData = pendingRegistrations.get(userGmail);

    if (!userData) {
      return { success: false, message: 'No se encontró una solicitud de registro pendiente para este correo.' };
    }

    const { userName, userPassword, rol } = userData;
    await UserService.insertarUsuario(userName, userGmail, userPassword, rol);
    await UserService.verificarUsuario(userGmail);

    verificationCodes.delete(userGmail);
    pendingRegistrations.delete(userGmail);

    return { success: true, message: 'Verificación y registro completados.' };
  } catch (error) {
    console.error('Error al verificar y registrar:', error);
    return { success: false, message: 'Error al registrar el usuario tras la verificación.' };
  }
});

ipcMain.handle('iniciar-sesion', async (event, { userGmail, userPassword }) => {
  try {
    const esValido = await UserService.verificarContraseña(userGmail, userPassword);
    if (esValido) {
      return { success: true, message: 'Inicio de sesión exitoso.' };
    } else {
      return { success: false, message: 'Correo o contraseña incorrectos.' };
    }
  } catch (error) {
    console.error('Error en iniciar-sesion:', error);
    return { success: false, message: error.message || 'Error en el inicio de sesión.' };
  }
});

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

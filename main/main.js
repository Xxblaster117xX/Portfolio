import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express'; 
//import forgotPasswordRouter from '../dist/backend/services/forgot-password.js';
//import resetPasswordRouter from '../dist/backend/services/reset-password.js';
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

// Servidor Express para API
function crearServidorAPI() {
  const expressApp = express();
  expressApp.use(express.json());

  expressApp.use('/api', forgotPasswordRouter);
  expressApp.use('/api', resetPasswordRouter);

  expressApp.listen(3001, () => {
    console.log('Servidor Express escuchando en http://localhost:3001');
  });
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

  app.whenReady().then(() => {
    crearServidorAPI(); // <-- Inicia el servidor Express
    createMainWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (mainWindow === null) createMainWindow();
  });
}




// Función para probar el envío de correo al iniciar
async function pruebaEnvioCorreo() {
  try {
    const testEmail = 'acarreterog01@santiagoapostol.net'; 
    const codigoPrueba = '123456';
    console.log('Probando envío de correo...');
    await enviarCodigoVerificacion(testEmail, codigoPrueba);
    console.log('Correo de prueba enviado correctamente');
  } catch (error) {
    console.error('Error enviando correo de prueba:', error);
  }
}

// Removed duplicate declaration of gotTheLock and merged logic
app.whenReady().then(async () => {
  await pruebaEnvioCorreo();  // <-- Ejecuta la prueba justo al iniciar
  createMainWindow();
});

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
      const usuario = await UserService.obtenerUsuarioPorGmail(userGmail);
     return {
  success: true,
  message: 'Inicio de sesión exitoso.',
  user: {
    nombre: usuario.user_name,
    correo: usuario.user_gmail,
    rol: usuario.rol
  }
      };
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
import * as MovementService from '../dist/backend/services/movementService.js';
import * as ReagentService from '../dist/backend/services/reagentService.js';
import * as HistoricalService from '../dist/backend/services/historicalService.js';

// MOVIMIENTOS
ipcMain.handle('registrar-movimiento', async (event, data) => {
  try {
    const { productIdMovement, movementType, movementQuantity, movementDate, userIdMovement } = data;
    await MovementService.registrarMovimiento(productIdMovement, movementType, movementQuantity, movementDate, userIdMovement);
    return { success: true };
  } catch (error) {
    console.error('Error registrar-movimiento:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('obtener-movimientos', async () => {
  try {
    const movimientos = await MovementService.obtenerMovimientos();
    return { success: true, data: movimientos };
  } catch (error) {
    console.error('Error obtener-movimientos:', error);
    return { success: false, message: error.message };
  }
});

// REACTIVOS
ipcMain.handle('insertar-reactivo', async (event, data) => {
  try {
    await ReagentService.insertarReactivo(
      data.reagentCas, data.reagentName, data.reagentQuantity, data.reagentUnit,
      data.reagentAddDate, data.reagentExpirationDate, data.reagentSupplier, data.reagentType, data.reagentFDS
    );
    return { success: true };
  } catch (error) {
    console.error('Error insertar-reactivo:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('obtener-reactivos', async () => {
  try {
    const reactivos = await ReagentService.obtenerReactivos();
    return { success: true, data: reactivos };
  } catch (error) {
    console.error('Error obtener-reactivos:', error);
    return { success: false, message: error.message };
  }
});
ipcMain.handle('actualizar-reactivo', async (event, data) => {
  try {
    await ReagentService.actualizarReactivo(
      data.reagentId, data.reagentCas, data.reagentName, data.reagentQuantity, data.reagentUnit,
      data.reagentAddDate, data.reagentExpirationDate, data.reagentSupplier, data.reagentType, data.reagentFDS
    );
    return { success: true };
  } catch (error) {
    console.error('Error actualizar-reactivo:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('eliminar-reactivo', async (event, reagentId) => {
  try {
    await ReagentService.eliminarReactivo(reagentId);
    return { success: true };
  } catch (error) {
    console.error('Error eliminar-reactivo:', error);
    return { success: false, message: error.message };
  }
});

// HISTORIAL
ipcMain.handle('registrar-historial', async (event, data) => {
  try {
    const { historicalUserId, action, actionDate, details } = data;
    await HistoricalService.registrarAccionHistorica(historicalUserId, action, actionDate, details);
    return { success: true };
  } catch (error) {
    console.error('Error registrar-historial:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('obtener-historial', async () => {
  try {
    const historial = await HistoricalService.obtenerAccionesHistoricas();
    return { success: true, data: historial };
  } catch (error) {
    console.error('Error obtener-historial:', error);
    return { success: false, message: error.message };
  }
});

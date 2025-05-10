const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Funciones existentes
  registrarUsuario: (data) => ipcRenderer.invoke('registrar-usuario', data),
  verificarCodigo: (data) => ipcRenderer.invoke('verificar-codigo', data),
  iniciarSesion: (data) => ipcRenderer.invoke('iniciar-sesion', data),

  // Nuevas funciones para envío de correos
  enviarCodigoVerificacion: (correo, codigo) => ipcRenderer.invoke('enviar-codigo-verificacion', correo, codigo),
  enviarCorreoRestablecerContrasena: (correo, enlace) => ipcRenderer.invoke('enviar-correo-reset', correo, enlace),
  enviarCorreoNotificacion: (correo, mensaje) => ipcRenderer.invoke('enviar-notificacion', correo, mensaje),
});

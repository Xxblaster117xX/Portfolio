const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload cargado correctamente');

contextBridge.exposeInMainWorld('electron', {
  registrarUsuario: (data) => {
    console.log('Llamada a registrarUsuario:', data);
    return ipcRenderer.invoke('registrar-usuario', data);
  },
  verificarCodigo: (data) => {
    console.log('Llamada a verificarCodigo:', data);
    return ipcRenderer.invoke('verificar-codigo', data);
  },
  iniciarSesion: (data) => {
    console.log('Llamada a iniciarSesion:', data);
    return ipcRenderer.invoke('iniciar-sesion', data);
  },

  enviarCodigoVerificacion: (correo, codigo) => {
    console.log('Llamada a enviarCodigoVerificacion:', correo, codigo);
    return ipcRenderer.invoke('enviar-codigo-verificacion', correo, codigo);
  },
  enviarCorreoRestablecerContrasena: (correo, enlace) => {
    console.log('Llamada a enviarCorreoRestablecerContrasena:', correo, enlace);
    return ipcRenderer.invoke('enviar-correo-reset', correo, enlace);
  },
  enviarCorreoNotificacion: (correo, mensaje) => {
    console.log('Llamada a enviarCorreoNotificacion:', correo, mensaje);
    return ipcRenderer.invoke('enviar-notificacion', correo, mensaje);
  },
});

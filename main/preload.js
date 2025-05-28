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

  marcarReactivoComoEscogido: (reagentId) => ipcRenderer.invoke('marcar-reactivo-escogido', reagentId),

  introducirReactivo: (reagentId, cantidadGastada, userId) =>
    ipcRenderer.invoke('introducir-reactivo', { reagentId, cantidadGastada, userId }),

  obtenerReactivosPorEstado: async (estado) => {
    const res = await ipcRenderer.invoke('obtener-reactivos-por-estado', estado);
    return res.success ? res.data : [];
  },


  // Reactivos CRUD
  insertarReactivo: (data) => ipcRenderer.invoke('insertar-reactivo', data),
  obtenerReactivos: () => ipcRenderer.invoke('obtener-reactivos'),
  actualizarReactivo: (data) => ipcRenderer.invoke('actualizar-reactivo', data),
  eliminarReactivo: (id) => ipcRenderer.invoke('eliminar-reactivo', id),

  // Movimientos
  registrarMovimiento: (data) => ipcRenderer.invoke('registrar-movimiento', data),
  obtenerMovimientos: () => ipcRenderer.invoke('obtener-movimientos'),
  obtenerMovimientosPorProducto: (reagentId) => ipcRenderer.invoke('obtener-movimientos-por-producto', reagentId),

  // Historial
  registrarHistorial: (data) => ipcRenderer.invoke('registrar-historial', data),
  obtenerHistorial: () => ipcRenderer.invoke('obtener-historial'),
  // Usuarios
  obtenerUsuarios: () => ipcRenderer.invoke('obtener-usuarios'),
  eliminarUsuario: (userId) => ipcRenderer.invoke('eliminar-usuario', userId),
  verificarCorreoExiste: (correo) => ipcRenderer.invoke('verificarCorreoExiste', correo),
  actualizarContrasena: (userGmail, nuevaContraseña) =>ipcRenderer.invoke('actualizar-contrasena', { userGmail, nuevaContraseña }),


});

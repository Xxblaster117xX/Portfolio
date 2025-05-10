declare global {
    interface Window {
      electron: {
        registrarUsuario: (data: { userName: string; userGmail: string; userPassword: string; rol: string }) => Promise<{ success: boolean; message: string }>;
        verificarCodigo: (data: { userGmail: string; codigo: string }) => Promise<{ success: boolean; message: string }>;
        iniciarSesion: (data: { userGmail: string; userPassword: string }) => Promise<{ success: boolean; message: string }>;
      };
    }
  }
  
  export {};
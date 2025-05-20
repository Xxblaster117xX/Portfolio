
import { Reagents } from '../interface/IReagents';
declare global {
  interface Window {
    electron: {
      registrarUsuario: (data: { 
        userName: string; 
        userGmail: string; 
        userPassword: string; 
        rol: string; 
      }) => Promise<{ success: boolean; message: string }>;

      verificarCodigo: (data: { 
        userGmail: string; 
        codigo: string; 
      }) => Promise<{ success: boolean; message: string }>;

      iniciarSesion: (data: { 
        userGmail: string; 
        userPassword: string; 
      }) => Promise<{ success: boolean; message: string }>;

      // Métodos adicionales para la gestión de reactivos
      obtenerReactivos: () => Promise<{
        success: boolean;
        data: Reagents[]; 
        message?: string;
      }>;

      insertarReactivo: (data: Omit<Reagents, 'reagentId'>) => Promise<{
        success: boolean;
        message?: string;
      }>;

      actualizarReactivo: (data: Reagents) => Promise<{
        success: boolean;
        message?: string;
      }>;

      eliminarReactivo: (id: number) => Promise<{
        success: boolean;
        message?: string;
      }>;
    };
  }




}

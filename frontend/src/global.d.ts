
import { Reagents } from '../interface/IReagents';
import { IUser } from '../interface/IUser';
declare global {
  interface Window {
    electron: {
      //Usuario
      obtenerUsuarios(): Promise<{ success: boolean; data: IUser[]; message?: string }>;
      verificarCorreoExiste: (userGmail: string) => Promise<{ exists: boolean }>;
      actualizarContrasena: (userGmail: string, nuevaContraseña: string) => Promise<{ success: boolean; message: string }>;
      eliminarUsuario(userId: number): Promise<{ success: boolean; message?: string }>;
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

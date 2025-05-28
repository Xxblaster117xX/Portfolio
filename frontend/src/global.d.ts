import { Reagents } from '../interface/IReagents';
import { Movimiento } from '../interface/IMovimiento';
import { Historial } from '../interface/IHistorial';

declare global {
  interface Window {
    electron: {
//Usuario

      obtenerUsuarios(): Promise<{ success: boolean; data: Usuario[]; message?: string }>;
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

      marcarReactivoComoEscogido: (productId: number) => Promise<void>;
      introducirReactivo: (productId: number, cantidadGastada: number, userId: number) => Promise<void>;
      obtenerReactivosPorEstado: (estado: string) => Promise<Reagents[]>;

      // Movimientos
      obtenerMovimientos: () => Promise<{
        success: boolean;
        data: Movimiento[];
        message?: string;
      }>;

      obtenerMovimientosPorProducto: (productId: number) => Promise<{
        success: boolean;
        data: Movimiento[];
        message?: string;
      }>;

      registrarMovimiento: (data: {
        reagentId: number;
        movementType: string;
        movementQuantity: number;
        unit: string;
        quantityBefore: number;
        quantityAfter: number;
        movementDate: string;
        userId: number;
        description?: string;
      }) => Promise<{ success: boolean; message?: string }>;

      // Historial
      registrarHistorial: (data: {
        historicalUserId: number;
        historicalUserName: string;
        action: string;
        actionDate: string;
        details: string;
      }) => Promise<{ success: boolean; message?: string }>;

      obtenerHistorial: () => Promise<{
        success: boolean;
        data: Historial[];
        message?: string;
      }>;
    };
  }
}

export {};

import { rol } from "../enum/RolEnum";

// types/Usuario.ts
export interface User {
    id: number;
    nombre: string;
    correo: string;
    contraseña: string;
    rol: rol; 
  }
  
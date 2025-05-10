import { rol } from "../enum/RolEnum";

// types/Usuario.ts
export interface IUser {
    userId: number;
    userName: string;
    userGmail: string;
    userPassword: string;
    rol: rol; 
    isVerified: boolean;
  }
  
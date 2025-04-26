
import { rol } from '../enum/RolEnum';
import { IUser } from '../interface/IUser';

// Clase que implementa la interfaz User
export  class UserClass implements IUser {
     userId: number;
    userName: string;
    userGmail: string;
    userPassword: string;
    rol: rol ;

   public constructor(userId: number, userName: string, userGmail: string, userPassword: string, rol: rol) { 
        this.userId =   userId;
        this.userName = userName;
        this.userGmail = userGmail;
        this.userPassword = userPassword;
        this.rol = rol;
    }
   
//getters
    public getUserId(): number {
        return this.userId;
    }
    public getUserName(): string {
        return this.userName;
    }
    public getUserGmail(): string {
        return this.userGmail;
    }
    public getUserPassword(): string {
        return this.userPassword;
    }
    public getRol(): rol {
        return this.rol;
    }
//setters
    public setUserId(userId: number): void {
        this.userId = userId;
    }
    public setUserName(userName: string): void {
        this.userName = userName;
    }
    public setUserGmail(userGmail: string): void {
        this.userGmail = userGmail;
    }
    public setUserPassword(userPassword: string): void {
        this.userPassword = userPassword;
    }
    public setRol(rol: rol): void {
        this.rol = rol;
    }
    // Método para mostrar la información del usuario
    public showUser(): string {
        return `ID: ${this.userId}, Nombre: ${this.userName}, Gmail: ${this.userGmail}, Rol: ${this.rol}`;
    }
    // Método para verificar la contraseña
    public checkPasswprd(contrasena: string): boolean {
        return this.userPassword === contrasena;
    }
    // Método para cambiar la contraseña
    public changePassword(nuevaContrasena: string): void {
        this.userPassword = nuevaContrasena;
    }
    // Método para verificar el rol del usuario
    public verifyRol(rol: rol): boolean {
        return this.rol === rol;
    }
    // Método para cambiar el rol del usuario
    public changeRol(nuevoRol: rol): void {
        this.rol = nuevoRol;
    }
}
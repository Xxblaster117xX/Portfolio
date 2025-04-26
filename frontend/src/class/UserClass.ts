import { rol } from '../enum/RolEnum';
import { User } from '../Interface/IUser';

// Clase que implementa la interfaz User
export class UserClass implements User {
    id: number;
    nombre: string;
    correo: string;
    contraseña: string;
    rol: rol ;

    constructor(id: number, nombre: string, correo: string, contraseña: string, rol: rol) { 
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.contraseña = contraseña;
        this.rol = rol;
    }
//getters
public getId(): number {
    return this.id;}
public getNombre(): string {
    return this.nombre;}
public getCorreo(): string {
    return this.correo;}
public getContraseña(): string {
    return this.contraseña;}
public getRol(): rol {
    return this.rol;}
    //setters   
public setId(id: number): void {
    this.id = id;}
public setNombre(nombre: string): void {
    this.nombre = nombre;}
public setCorreo(correo: string): void {
    this.correo = correo;}
public setContraseña(contraseña: string): void {
    this.contraseña = contraseña;}
public setRol(rol: rol): void {
    this.rol = rol;}

}
import { Reagents } from '../Interface/IReagents';
import { Product } from './Product';
export class Reagent extends Product implements Reagents {
    nombre: string;
    cantidad: number;
    unidad: string;
    fechaCaducidad: Date;
    proveedor: string;
    tipo: string;

    constructor(id: number, nombre: string, cantidad: number, unidad: string, fechaCaducidad: Date, proveedor: string, tipo: string) {
        super(id);
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.unidad = unidad;
        this.fechaCaducidad = fechaCaducidad;
        this.proveedor = proveedor;
        this.tipo = tipo;
    }

    // Getters
    public getNombre(): string {
        return this.nombre;
    }
    public getCantidad(): number {
        return this.cantidad;
    }
    public getUnidad(): string {
        return this.unidad;
    }
    public getFechaCaducidad(): Date {
        return this.fechaCaducidad;
    }
    public getProveedor(): string {
        return this.proveedor;
    }   
    public getTipo(): string {
        return this.tipo;
    }
    // Setters
    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }
    public setCantidad(cantidad: number): void {
        this.cantidad = cantidad;
    }
    public setUnidad(unidad: string): void {
        this.unidad = unidad;
    }
    public setFechaCaducidad(fechaCaducidad: Date): void {
        this.fechaCaducidad = fechaCaducidad;
    }
    public setProveedor(proveedor: string): void {
        this.proveedor = proveedor;
    }
    public setTipo(tipo: string): void {
        this.tipo = tipo;
    }
}
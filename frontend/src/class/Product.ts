import { Products } from "../interface/IProducts";

export class Product implements Products {

  
    public  productId: number;
    // Constructor
     constructor(productId: number) {
        this.productId = productId;
    }
    // Getters
    public getProductId(): number {
        return this.productId;
    }
    // Setters
    public setProductId(productId: number): void {
        this.productId = productId;
    }
    // Método para mostrar la información del producto
    public mostrarInformacion(): string {
        return `ID: ${this.productId}`;
    }
}
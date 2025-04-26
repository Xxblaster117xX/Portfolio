import { Reagents } from '../interface/IReagents';
import { Product } from './Product';
export class Reagent extends Product implements Reagents {
    reagentName : string;
    reagentQuantity: number;
    reagentUnit: string;
    reagentExpirationDate: Date;
    reagentSupplier: string;
    reagentType: string;

   // Constructor
    constructor(productId: number, reagentName: string, reagentQuantity: number, reagentUnit: string, reagentExpirationDate: Date, reagentSupplier: string, reagentType: string) {
        super(productId); // Llamar al constructor de la clase padre (Product)
        this.reagentName = reagentName;
        this.reagentQuantity = reagentQuantity;
        this.reagentUnit = reagentUnit;
        this.reagentExpirationDate = reagentExpirationDate;
        this.reagentSupplier = reagentSupplier;
        this.reagentType = reagentType;
    }
    // Getters
    public getReagentName(): string {
        return this.reagentName;
    }
    public getReagentQuantity(): number {
        return this.reagentQuantity;
    }           
    public getReagentUnit(): string {
        return this.reagentUnit;
    }
    public getReagentExpirationDate(): Date {
        return this.reagentExpirationDate;
    }
    public getReagentSupplier(): string {
        return this.reagentSupplier;
    }
    public getReagentType(): string {
        return this.reagentType;
    }
    // Setters
    public setReagentName(reagentName: string): void {
        this.reagentName = reagentName;
    }
    public setReagentQuantity(reagentQuantity: number): void {
        this.reagentQuantity = reagentQuantity;
    }
    public setReagentUnit(reagentUnit: string): void {
        this.reagentUnit = reagentUnit;
    }
    public setReagentExpirationDate(reagentExpirationDate: Date): void {
        this.reagentExpirationDate = reagentExpirationDate;
    }
    public setReagentSupplier(reagentSupplier: string): void {
        this.reagentSupplier = reagentSupplier;
    }
    public setReagentType(reagentType: string): void {
        this.reagentType = reagentType;
    }
}
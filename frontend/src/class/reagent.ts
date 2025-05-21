import { Reagents } from '../interface/IReagents';

export class Reagent  implements Reagents {
  reagentId: number;
  reagentCas:string;
  reagentName : string;
  reagentQuantity: number;
  reagentUnit: string;
  reagentAddDate:Date;
  reagentExpirationDate: Date;
  reagentSupplier: string;
  reagentType: string;
  reagentFDS: string 
   // Constructor
  constructor(reagentId:number, reagentCas: string, reagentName: string, reagentQuantity: number, reagentUnit: string, reagentAddDate: Date, reagentExpirationDate: Date, reagentSupplier: string, reagentType: string, reagentFDS: string
  ) {
    this.reagentId=reagentId;
    this.reagentCas = reagentCas;
    this.reagentName = reagentName;
    this.reagentQuantity = reagentQuantity;
    this.reagentUnit = reagentUnit;
    this.reagentAddDate = reagentAddDate;
    this.reagentExpirationDate = reagentExpirationDate;
    this.reagentSupplier = reagentSupplier;
    this.reagentType = reagentType;
    this.reagentFDS = reagentFDS;
  }

  // Getters
  getReagentId():number{
  return this.reagentId;
  }
  getReagentCas(): string {
    return this.reagentCas;
  }

  getReagentName(): string {
    return this.reagentName;
  }

  getReagentQuantity(): number {
    return this.reagentQuantity;
  }

  getReagentUnit(): string {
    return this.reagentUnit;
  }

  getReagentAddDate(): Date {
    return this.reagentAddDate;
  }

  getReagentExpirationDate(): Date {
    return this.reagentExpirationDate;
  }

  getReagentSupplier(): string {
    return this.reagentSupplier;
  }

  getReagentType(): string {
    return this.reagentType;
  }

  getReagentFDS(): string {
    return this.reagentFDS;
  }

  // Setters
  setReagentId(reagentId:number):void{
  this.reagentId=reagentId;
  }
  setReagentCas(reagentCas: string): void {
    this.reagentCas = reagentCas;
  }

  setReagentName(reagentName: string): void {
    this.reagentName = reagentName;
  }

  setReagentQuantity(reagentQuantity: number): void {
    this.reagentQuantity = reagentQuantity;
  }

  setReagentUnit(reagentUnit: string): void {
    this.reagentUnit = reagentUnit;
  }

  setReagentAddDate(reagentAddDate: Date): void {
    this.reagentAddDate = reagentAddDate;
  }

  setReagentExpirationDate(reagentExpirationDate: Date): void {
    this.reagentExpirationDate = reagentExpirationDate;
  }

  setReagentSupplier(reagentSupplier: string): void {
    this.reagentSupplier = reagentSupplier;
  }

  setReagentType(reagentType: string): void {
    this.reagentType = reagentType;
  }

  setReagentFDS(reagentFDS: string): void {
    this.reagentFDS = reagentFDS;
  }
    
}
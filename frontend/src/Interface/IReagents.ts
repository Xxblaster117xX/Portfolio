
export type ReagentState = 'disponible' | 'escogido';
export interface Reagents {
  reagentId:number;
  reagentCas:string;
  reagentName : string;
  reagentQuantity: number;
  reagentUnit: string;
  reagentAddDate:Date;
  reagentExpirationDate: Date;
  reagentSupplier: string;
  reagentType: string;
  reagentFDS: string ;
  reagentState: ReagentState;
  }
  
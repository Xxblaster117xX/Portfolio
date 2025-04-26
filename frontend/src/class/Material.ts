import { Product } from "./Product";
import { IMaterial } from "../interface/IMaterial";
export class Material extends Product implements IMaterial{
    materialId:number;
    materialName:string;

    //Constructor
    constructor( productId: number,materialId:number, materialName:string ){
      super(productId); // Llama al constructor de la clase base Product
      this.materialId = materialId;
      this.materialName = materialName;
    }
}
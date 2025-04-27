
import { IMaterial } from "../interface/IMaterial";
export class Material  implements IMaterial{
    materialId:number;
    materialName:string;

    //Constructor
    constructor(materialId:number, materialName:string ){
      this.materialId = materialId;
      this.materialName = materialName;
    }
}
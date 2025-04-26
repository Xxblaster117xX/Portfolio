import { Products } from "../Interface/IProducts";

export class Product implements Products {
  id: number;


    public constructor(id: number) {
        this.id = id;
    }
}
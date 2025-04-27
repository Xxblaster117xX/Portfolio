import { IMovement } from "../interface/IMovement";

export class Movement implements IMovement {
  MovementId: number;
productIdMovement: number;
MovementType:string;
MovementQuantity:number;
MovementDate: Date;
UserIdMoverment:number;
constructor(MovementId: number, productIdMovement: number, MovementType: string, MovementQuantity: number, MovementDate: Date, UserIdMoverment: number) {
    this.MovementId = MovementId;
    this.productIdMovement = productIdMovement;
    this.MovementType = MovementType;
    this.MovementQuantity = MovementQuantity;
    this.MovementDate = MovementDate;
    this.UserIdMoverment = UserIdMoverment;
  }

    // Getters
    public getId(): number {
        return this.MovementId;
    }
    public getProductId(): number {
        return this.productIdMovement;
    }
    public getMovementType(): string {
        return this.MovementType;
    }
    public getMovementQuantity(): number {
        return this.MovementQuantity;
    }
    public getMovementDate(): Date {
        return this.MovementDate;
    }
    public getUserIdMoverment(): number {
        return this.UserIdMoverment;
    }
    // Setters
    public setId(MovementId: number): void {
        this.MovementId = MovementId;
    }
    public setProductId(productIdMovement: number): void {
        this.productIdMovement = productIdMovement;
    }
    public setMovementType(MovementType: string): void {
        this.MovementType = MovementType;
    }
    public setMovementQuantity(MovementQuantity: number): void {
        this.MovementQuantity = MovementQuantity;
    }   
    public setMovementDate(MovementDate: Date): void {
        this.MovementDate = MovementDate;
    }
    public setUserIdMoverment(UserIdMoverment: number): void {
        this.UserIdMoverment = UserIdMoverment;
    }
    
  
}
import { IHistorical } from "../interface/IHistorical";



//Clase del historial de acciones de los usuarios
export class Historical implements IHistorical {
    
    HistoricalId:number;
    HistoricalUserId:number;
    historicalUsername:string
    Action:string;
    ActionDate:Date;
    Details:string;
// Constructor
    constructor(HistoricalId:number, historicalUsername:string ,HistoricalUserId:number, Action:string, ActionDate:Date, Details:string) {
        this.HistoricalId = HistoricalId;
        this.historicalUsername = historicalUsername;
        this.HistoricalUserId = HistoricalUserId;
        this.Action = Action;
        this.ActionDate = ActionDate;
        this.Details = Details;
    }
    // Getters
    public getHistoricalId(): number {
        return this.HistoricalId;
    }
    public getHistoricalUserName(): string {
        return this.historicalUsername;
    }
    public getHistoricalUserId(): number {
        return this.HistoricalUserId;
    }
    public getAction(): string {
        return this.Action;
    }
    public getActionDate(): Date {
        return this.ActionDate;
    }
    public getDetails(): string {
        return this.Details;
    }
    // Setters
    public setHistoricalId(HistoricalId: number): void {
        this.HistoricalId = HistoricalId;
    }
    public setHistoricalUserName(historicalUsername: string): void {
        this.historicalUsername = historicalUsername;
    }
    public setHistoricalUserId(HistoricalUserId: number): void {
        this.HistoricalUserId = HistoricalUserId;
    }
    public setAction(Action: string): void {
        this.Action = Action;
    }
    public setActionDate(ActionDate: Date): void {
        this.ActionDate = ActionDate;
    }
    public setDetails(Details: string): void {
        this.Details = Details;
    }


}
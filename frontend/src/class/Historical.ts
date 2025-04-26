


//Clase del historial de acciones de los usuarios
export class Historical{

    HistoricalId:number;
    HistoricalUserId:number;
    Action:string;
    ActionDate:Date;
    Details:string;
// Constructor
    constructor(HistoricalId:number, HistoricalUserId:number, Action:string, ActionDate:Date, Details:string) {
        this.HistoricalId = HistoricalId;
        this.HistoricalUserId = HistoricalUserId;
        this.Action = Action;
        this.ActionDate = ActionDate;
        this.Details = Details;
    }
    // Getters
    public getHistoricalId(): number {
        return this.HistoricalId;
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
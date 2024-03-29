import { ticketModel } from "../models/tickets.model.js";

export class TicketMongo{
    constructor(){
        this.model = ticketModel;
    }

    async createTicket(ticket){
        try {
            const data = await this.model.create(ticket);
            return data
        } catch (error) {
            throw new Error(`Error al crear el ticket ${error.message}`);
        }
    };    

}
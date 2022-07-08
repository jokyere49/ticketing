import { Publisher, Subjects, TicketCreatedEvent } from "@jokytickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}
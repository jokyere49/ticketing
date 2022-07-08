import { Publisher, Subjects, TicketUpdatedEvent } from "@jokytickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}
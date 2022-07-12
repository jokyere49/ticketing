import { Publisher, OrderCreatedEvent, Subjects } from "@jokytickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
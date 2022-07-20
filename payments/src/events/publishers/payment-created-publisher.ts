import { Publisher, Subjects, PaymentCreatedEvent } from "@jokytickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}
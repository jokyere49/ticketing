import { Subjects, Publisher, ExpirationCompleteEvent } from "@jokytickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}
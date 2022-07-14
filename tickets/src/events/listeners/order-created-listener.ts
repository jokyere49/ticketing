import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from "@jokytickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
/// our approach to locking a ticket when it is been ordered
        // if a ticket is not reserved  orderid is null
        // if a ticket is reserved there is an orderid
// end 
    
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket, throw error
    if (!ticket){
        throw new Error('Ticket not found');
    }

    // MArk the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // ack the message
    msg.ack();

    }

}
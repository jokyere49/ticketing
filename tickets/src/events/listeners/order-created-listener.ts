import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from "@jokytickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';


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

    // since ticket version is updated bcos of the change in a both when need to publish an event
    await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
        orderId: ticket.orderId,
      });
    

    // ack the message
    msg.ack();

    }

}
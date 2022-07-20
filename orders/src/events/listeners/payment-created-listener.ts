import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent } from '@jokytickets/common';
import { queueGroupName } from './queue-group-name';
import { Order, OrderStatus } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
    // queueGroupName allows an event to be sent to only one of  the members in a queue group
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message ){
        const order = await Order.findById(data.orderId);

        if(!order){
            throw new Error('order not found');
        }

        // we normally need to publish an event when a db is updated so that all dependencies will have
        // the correct version but bcos OrderStatus.Complete is the final cycle of order
        // no further update will happen to it , we do not need to do that
        order.set({
            status: OrderStatus.Complete
        });

        await order.save();

        msg.ack();
    }
}
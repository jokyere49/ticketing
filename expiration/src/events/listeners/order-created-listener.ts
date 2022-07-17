import { Listener, OrderCreatedEvent, Subjects } from '@jokytickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject= Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const delay = new Date(data.expiresAt).getTime()-new Date().getTime();
        console.log('Waiting this number of milliseconds to process the job:',delay);
        // add the job to the queue and send it to redis
        // or u can think of it us adding the job to the queue in redis
        await expirationQueue.add(
            {
                orderId: data.id,
            },
            {
                delay: delay
            }
        );
        msg.ack();
    }
}
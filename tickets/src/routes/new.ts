import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@jokytickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// with the currentUser malware already applied in the app.ts which will set req.currentUser
//we can now apply the requireAuth malware
router.post('/api/tickets', requireAuth,[
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0}).withMessage('Price must be greater than zero')
], validateRequest, async (req:Request,res:Response)=>{
    const { title, price } = req.body;

    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
    });
    await ticket.save();
    // publish an event to nats streaming server that an event has been created
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.status(201).send(ticket);
});

export { router as createTicketRouter}
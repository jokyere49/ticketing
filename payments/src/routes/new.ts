import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { requireAuth, 
    validateRequest,
    BadRequestError,
    NotFoundError, 
    NotAuthorizedError,
    OrderStatus} from '@jokytickets/common';
import { Order } from '../models/order';   
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe'
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';


const router = express.Router();

router.post('/api/payments', requireAuth,[
    body('token').not().isEmpty().withMessage('token is required'),
    body('orderId').not().isEmpty().withMessage('orderId is required')
], validateRequest, async (req:Request,res:Response)=>{
    // pull token and orderId from the request body
    const { token, orderId } = req.body;
    // check the database to see if you will find the order with that id 
    const order = await Order. findById(orderId);

    // the order doesn't exist in the database throw an error
    if(!order){
        throw new NotFoundError();
    }

    // check to see if order belongs to the currentUser if not throw an error
    if (order.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    
    // check to see if order has expired . if it has throw an error
    if(order.status == OrderStatus.Cancelled){
        throw new BadRequestError('Cannot pay for a cancelled order')
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
    });
    
    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    });
     await payment.save();

     new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId

     });

    res.status(201).send({id: payment.id});    
});

export { router as createChargeRouter}
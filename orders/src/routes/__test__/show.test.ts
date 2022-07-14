import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';



const buildTicket = async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    return ticket;
}

it ('fetches the  order', async () =>{
    // create a ticket
      const ticket = await buildTicket();
      const user = global.getAuthCookie();
    // make a request to build an order with this ticket
    const{ body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id })
    .expect(201);

    //  make request to fetch the order
   const { body: fetchedOrder } =await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);

});

it ('returns an error if one user tries to fetch an order of another user', async () =>{
    // create a ticket
      const ticket = await buildTicket();
      const userOne = global.getAuthCookie();
      const userTwo = global.getAuthCookie();
    // make a request to build an order with this ticket with userOne
    const{ body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ticketId: ticket.id })
    .expect(201);

    //  make request to fetch the same order as usertwo
    await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);

});
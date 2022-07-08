import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if ticket is not found', async () =>{
    const id = new mongoose.Types.ObjectId().toHexString();
     await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
    // to see the error throw comment out the expectation and then console log the response body #275
    //console.log(response.body);

});

it('returns the ticket if ticket is not found', async () =>{
    const title='askldk';
    const price=20;

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({
        title,
        price,
    })
    .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    
        expect(ticketResponse.body.title).toEqual(title);
        expect(ticketResponse.body.price).toEqual(price);
});
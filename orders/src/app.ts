import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler } from '@jokytickets/common';
import { NotFoundError, currentUser } from '@jokytickets/common';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true); // it is added to make sure express is aware it is behind ingress proxy so
                              // it is shd trust it 
app.use(json());
app.use(
    cookieSession({
        signed: false, // no encryption for the cookie
        //secure: true // cookie shd be used only on http
        secure: process.env.NODE_ENV !== 'test' // set secure to false if we are in test
                                                //environment
    })
);
// we need to add middleware to set req.currentUser to payload if authenticated
app.use(currentUser);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.get('*', async () =>{
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };

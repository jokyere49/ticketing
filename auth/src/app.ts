import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from '@jokytickets/common';
import { NotFoundError } from '@jokytickets/common';

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get('*', async () =>{
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };

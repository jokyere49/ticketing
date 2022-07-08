import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// declare a  global function in typescript
declare global{
    var getAuthCookie: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;
// define a hook function
// this is run before all our test is executed 
beforeAll(async () =>{
    // the environment variable for the jWT is set in our cluster
    // so since our test is being done locally ,
    // we need to manually set the environment variable ourself
    process.env.JWT_KEY = 'asdfasdf';
    mongo = new MongoMemoryServer();
    await mongo.start();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

//this is also a hook function
// run this before the beginning of each test #196
// before each test reach into the databases and delete all collections
beforeEach(async ()=>{
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections){
        await collection.deleteMany({});
    }
});

// this hook function shd be run after all the test have been completed
// after all test have been completed , stop mongo  and disconnect the mongoose connections

afterAll( async () =>{
    await mongoose.connection.close(); // This first
    await mongo.stop(); //Then this
});

// writing a global function
global.getAuthCookie =  () =>{
    // Build  a JWT payload. {id, email}
     const payload ={
        // make id randomly generated so that everytime will call getAuthCookie we generate a different user
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
     };

    // Create the JWT !
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build a session object. {jwt: MY_jwt}
    const session = {jwt: token};

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string that is a cookie with the encoded data
    return [`session=${base64}`];
}
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

// declare a  global function in typescript
declare global{
    var getAuthCookie: () => Promise<string[]>;
}



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
global.getAuthCookie = async () =>{
    const email ='test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201)
    
    const cookie = response.get('Set-Cookie')

    return cookie;
}
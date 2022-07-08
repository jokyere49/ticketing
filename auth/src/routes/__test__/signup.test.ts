import request from 'supertest';
import { app } from '../../app';

// first test is to send a valid email and password and get a status 201
it('returns a 201 on successful signup', async ()=>{
    return request(app)
     .post('/api/users/signup')
     .send({
        email:'test@test.com',
        password:'password'
     })
     .expect(201);
});

 
it('returns a 400 with an invalid email', async () =>{
    return request(app)
    .post('/api/users/signup')
    .send({
       email:'asasaddlld',
       password:'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () =>{
    return request(app)
    .post('/api/users/signup')
    .send({
       email:'test@test.com',
       password:'p'
    })
    .expect(400);
});

it('returns a 400 with missing email and/or missing password', async () =>{
    await request(app)
        .post('/api/users/signup')
        .send({
        email:'',
        password:'password'
        })
        .expect(400);
    await request(app)
        .post('/api/users/signup')
        .send({
        email:'test@test.com',
        password:''
        })
        .expect(400);
});

it ('disallows duplicate emails', async()=>{
    await request(app)
        .post('/api/users/signup')
        .send({
        email:'test@test.com',
        password:'password'})
        .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send({
        email:'test@test.com',
        password:'password'})
        .expect(400) ;   
});

//check to make sure cookie is sent after successful sign #201
it('sets a cookie after successful signup', async()=>{
    const response = await request(app)
    .post('/api/users/signup')
    .send({
    email:'test@test.com',
    password:'password'})
    .expect(201);

    expect (response.get('Set-Cookie')).toBeDefined();
});
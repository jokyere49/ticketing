import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supplied', async ()=>{
    await request(app)
    .post('/api/users/signin')
    .send({
       email:'test@test.com',
       password:'password'
    })
    .expect(400)
});

it('fails when an incorrect password is supplied', async ()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
       email:'test@test.com',
       password:'password'
    })
    .expect(201)
    await request(app)
    .post('/api/users/signin')
    .send({
       email:'test@test.com',
       password:'jsjsd'
    })
    .expect(400)
});

it('responds with a cookie when given valid credentials', async ()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
       email:'test@test.com',
       password:'password'
    })
    .expect(201);

    const response = await request(app)
    .post('/api/users/signin')
    .send({
       email:'test@test.com',
       password:'password'
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});

// signup a user with an email and password and try to sign in 
// if sign in is successful it shd give a 200
it('returns a 200 on successful signup', async ()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
       email:'test@test.com',
       password:'password'
    })
    .expect(201);
    await request(app)
     .post('/api/users/signin')
     .send({
        email:'test@test.com',
        password:'password'
     })
     .expect(200);
});

it('returns a 400 with an invalid email', async () =>{
    return request(app)
    .post('/api/users/signin')
    .send({
       email:'asasaddlld',
       password:'password'
    })
    .expect(400);
});

it('returns a 400 with missing email and/or missing password', async () =>{
    await request(app)
        .post('/api/users/signin')
        .send({
        email:'',
        password:'password'
        })
        .expect(400);
    await request(app)
        .post('/api/users/signin')
        .send({
        email:'test@test.com',
        password:''
        })
        .expect(400);
});
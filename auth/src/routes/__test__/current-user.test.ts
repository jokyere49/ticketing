import request from 'supertest';
import { app } from '../../app';

// supertest doesn't manage cookies #204
it('responds with details about current user', async ()=>{
 
    const cookie = await global.getAuthCookie();

 const response = await request(app )
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

 //console.log(response.body)
 expect(response.body.currentUser.email).toEqual('test@test.com');

});

// this check if currentuser is not signed in it shd return null
it('responds with null if not authenticated', async ()=>{
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);
    
    expect(response.body.currentUser).toEqual(null);
});
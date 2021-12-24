import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-helper'

it('responds with details about the current user', async () => {

    // Extract auth cookie
  const cookie = await signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    // Attach the cookie with the request header
    .set('Cookie', cookie)
    .send()
    .expect(200);

    // console.log(response.body);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
      .get('/api/users/currentuser')
      .send()
      .expect(200);
  
    expect(response.body.currentUser).toEqual(null);
});
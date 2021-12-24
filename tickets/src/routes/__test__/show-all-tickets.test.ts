import request from 'supertest';
import { app } from '../../app';
import { createFakeSession } from '../../test/auth-helper';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', createFakeSession())
    .send({
      title: 'ticket',
      price: 20,
    });
};

it('can fetch a list of tickets', async () => {
  
  // create tickets

  await createTicket();
  await createTicket();
  await createTicket();

  // get them

  const ticketsResponse = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

  expect(ticketsResponse.body.length).toEqual(3);
});
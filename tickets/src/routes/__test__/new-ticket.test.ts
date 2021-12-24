import request from 'supertest';
import { app } from '../../app';
import { createFakeSession } from '../../test/auth-helper';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('returns a status other than 401 when user signed in', async () => {

  const cookie = createFakeSession();

  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({});
  
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {

  const cookie = createFakeSession();

  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: '',
    price: 5
  })
  .expect(400);

  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    price: 5
  })
  .expect(400);
});

it('returns an error if an invalid price is provided', async () => {

  const cookie = createFakeSession();

  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'ticket',
    price: -1
  })
  .expect(400);

  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'ticket'
  })
  .expect(400);

});

it('creates a ticket with valid inputs', async () => {

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const cookie = createFakeSession();

  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'ticket',
    price: 5
  })
  .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

});

it('publishes an event', async () => {

  const cookie = createFakeSession();

  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'ticket',
    price: 5
  })
  .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
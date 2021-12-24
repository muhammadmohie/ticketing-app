import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { createFakeSession } from './../../test/auth-helper';

it('fetches the order', async () => {

  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket title',
    price: 10,
    version: 0
  });
  await ticket.save();

  // Create fake user
  const user = createFakeSession();

  // Create an order on the current ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if the user has no order', async () => {
  
  // Create fake user
  const user = createFakeSession();

  // Create a fake orderId
  const orderId = new mongoose.Types.ObjectId();
  
  // Request to fetch the order
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', user)
    .send()
    .expect(404);
});

it('returns an error if one user tries to fetch another users order', async () => {
  
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket title',
    price: 10,
    version: 0
  });
  await ticket.save();

  // Create fake user
  const user = createFakeSession();

  // Create an order on the current ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Create another fake user
  const anotherUser = createFakeSession();

  // Request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', anotherUser)
    .send()
    .expect(401);
});
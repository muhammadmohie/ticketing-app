import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { createFakeSession } from './../../test/auth-helper';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket title',
    price: 10,
    version: 0
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for an particular user', async () => {
  // Create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  // Create fake users
  const user1 = createFakeSession();
  const user2 = createFakeSession();

  // Create one order as user1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // Create two orders as user2
  const { body: order1} = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
    
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // Fetch orders for user2
  const { body: allOrders} = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  // Expecations about orders of user2
  expect(allOrders.length).toEqual(2);
  expect(allOrders[0].id).toEqual(order1.id);
  expect(allOrders[1].id).toEqual(order2.id);
  expect(allOrders[0].ticket.id).toEqual(ticket2.id);
  expect(allOrders[1].ticket.id).toEqual(ticket3.id);
});
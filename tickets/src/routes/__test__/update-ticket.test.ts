import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { createFakeSession } from '../../test/auth-helper';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket'

it('returns a 404 if the provided id does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', createFakeSession())
    .send({
      title: 'ticket',
      price: 5,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({
      title: 'ticket',
      price: 5,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {

  // Create a user and assign a ticket to him
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', createFakeSession())
    .send({
      title: 'ticket1',
      price: 5,
    });
  
  // Create another user and try to update a ticket he doesn't own
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', createFakeSession())
    .send({
      title: 'ticket2',
      price: 10,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  
  // Create a user and assign a ticket to him
  const cookie = createFakeSession();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ticket',
      price: 5,
    });
  // Invalid title update by the same user
  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: '',
    price: 5,
  })
  .expect(400);

  // Invalid price update by the same user
  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: 'ticket',
    price: -5,
  })
  .expect(400);

});

it('updates the ticket provided valid inputs', async () => {
  
  // Create a user and assign a ticket to him

  const cookie = createFakeSession();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title1',
      price: 5,
    });

  //  Trying to update his ticket

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title2',
      price: 10,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('title2');
  expect(ticketResponse.body.price).toEqual(10);
});

it('publishes an event', async () => {

  // Create a user and assign a ticket to him

  const cookie = createFakeSession();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title1',
      price: 5,
    });

  //  Trying to update his ticket

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title2',
      price: 10,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {

  // Create a user and assign a ticket to him

  const cookie = createFakeSession();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title1',
      price: 5,
    });

  // console.log(response.body);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  
  await ticket!.save();

  // Trying to update his ticket

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title2',
      price: 10,
    })
    .expect(400);
});
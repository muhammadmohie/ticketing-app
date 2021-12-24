import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@mm-ticketing-app/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save a ticket
  const ticket = Ticket.build({
      title: 'ticket',
      price: 10,
      userId: new mongoose.Types.ObjectId().toHexString()
  });
  
  await ticket.save();

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'fakeDate',
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
  };

  // create a fake Message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // get the saved ticket from the database
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // make sure ack function is called
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // @ts-ignore 
  // console.log(natsWrapper.client.publish.mock.calls);

  // @ts-ignore not needed
  const ticketData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(data.id).toEqual(ticketData.orderId);
});
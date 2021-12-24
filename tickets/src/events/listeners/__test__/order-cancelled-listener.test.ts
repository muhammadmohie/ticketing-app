import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@mm-ticketing-app/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

    // create and save a ticket
  const ticket = Ticket.build({
      title: 'ticket',
      price: 10,
      userId: new mongoose.Types.ObjectId().toHexString()
  });

  const orderId = new mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  
  await ticket.save();

  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
        id: ticket.id,
    }
  };

  // create a fake Message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, orderId, msg };
};

it('updates the ticket', async () => {
  const { listener, ticket, data, orderId, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // get the saved ticket from the database
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});

it('acks the message', async () => {
  const { listener, ticket, data, orderId, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, orderId, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // make sure ack function is called
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // @ts-ignore 
  // console.log(natsWrapper.client.publish.mock.calls);

  // @ts-ignore not needed
  const ticketData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(data.id).not.toEqual(ticketData.orderId);
});
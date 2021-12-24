import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@mm-ticketing-app/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Fetch the ticket 
    const ticket = await Ticket.findById(data.ticket.id);

    // If ticket not found, throw an error
    if (!ticket) {
      throw new Error('Ticket not found!');
    }
    // Lock the ticket
    ticket.set({ orderId: data.id });

    // save the ticket 
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId
    })

    // Ack the message
    msg.ack();
  }
}
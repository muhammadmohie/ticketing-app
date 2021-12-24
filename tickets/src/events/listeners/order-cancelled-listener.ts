import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@mm-ticketing-app/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Fetch the ticket 
    const ticket = await Ticket.findById(data.ticket.id);

    // If ticket not found, throw an error
    if (!ticket) {
      throw new Error('Ticket not found!');
    }
    // Release the ticket lock
    ticket.set({ orderId: undefined });

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
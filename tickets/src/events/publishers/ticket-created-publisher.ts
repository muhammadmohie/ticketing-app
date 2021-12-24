import { Publisher, Subjects, TicketCreatedEvent } from '@mm-ticketing-app/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
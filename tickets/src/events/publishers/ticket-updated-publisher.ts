import { Publisher, Subjects, TicketUpdatedEvent } from '@mm-ticketing-app/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
import { Subjects, Publisher, PaymentCreatedEvent } from '@mm-ticketing-app/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
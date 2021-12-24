import { Publisher, OrderCreatedEvent, Subjects } from "@mm-ticketing-app/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
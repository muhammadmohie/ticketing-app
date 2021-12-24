import { Publisher, OrderCancelledEvent, Subjects } from "@mm-ticketing-app/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
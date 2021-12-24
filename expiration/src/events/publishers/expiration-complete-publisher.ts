import { Subjects, Publisher, ExpirationCompleteEvent } from "@mm-ticketing-app/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
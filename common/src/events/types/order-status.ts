export enum OrderStatus {
  // Order is created, but the ticket it is not reserved
  Created = 'created',

  // The ticket is already reserved,
  // or a user has cancelled the order,
  // or order had been expired
  Cancelled = 'cancelled',

  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // The user has provided payment successfully
  Complete = 'complete',
}
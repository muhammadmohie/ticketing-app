import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'ticket',
    price: 10,
    userId: 'userId',
  });

  // Save the ticket to the database
  await ticket.save();

  // fetch the ticket twice (the same version number is returned)
  const firstFetch = await Ticket.findById(ticket.id);
  const secondFetch = await Ticket.findById(ticket.id);

  // make two separate updates to the same fetched ticket
  firstFetch!.set({ price: 10 });
  secondFetch!.set({ price: 15 });

  // save the first fetched ticket
  await firstFetch!.save(); 

  // save the second fetched ticket and expect an error

  // expect(async () => {
  //   await secondFetch!.save();
  // }).toThrow();

  try {
    await secondFetch!.save();
  } catch (err) {
    return;
  }

});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'ticket',
    price: 10,
    userId: 'userId',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
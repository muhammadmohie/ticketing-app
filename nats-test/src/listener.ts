import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener'
console.clear();

// Create a client random id to interact with the nats servers

const stanId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', stanId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {

  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  })

  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());   // Interrupt signal
process.on('SIGTERM', () => stan.close());  // Termination signal


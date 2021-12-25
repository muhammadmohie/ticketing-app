import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock('../nats-wrapper.ts');

process.env.STRIPE_KEY = 'sk_test_51K9coBE0iPUH1rrhQQubGSkAcDCE2BJPMPFGPUuBSTDKVaBJi6jbOFN2YMwi3InLNE7R2sJnSEop1wLAySG5TmEQ00DvFd09Pq';

let mongo: any;
// run this before all tests
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

// run this before each tests
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
});
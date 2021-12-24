import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@mm-ticketing-app/common';
import { app } from '../../app';
import { Order } from '../../models/order';
import { createFakeSession } from '../../test/auth-helper';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment'

jest.mock('../../stripe.ts');

it('returns a 404 when paying for an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', createFakeSession())
    .send({
      token: 'token',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', createFakeSession())
    .send({
      token: 'token',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', createFakeSession(userId))
    .send({
      orderId: order.id,
      token: 'token',
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', createFakeSession(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(10 * 100);
    expect(chargeOptions.currency).toEqual('usd');

    // const payment = await Payment.findOne({
    //   orderId: order.id,
    //   stripeId: stripeCharge!.id,
    // });
    // expect(payment).not.toBeNull();

});
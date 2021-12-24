import mongoose from 'mongoose';
import { OrderStatus } from '@mm-ticketing-app/common'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
export { OrderStatus };

// An interface that describes the properties
// that are required to create a new Order

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the properties
// that a Order Document has. (for instantiation)

interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the properties
// that a Order Model has. (for collection)

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// Schema defines the different properties
// the order is going to have

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
},
{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
}
);

orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

// Add a method to order schema
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
  };


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
import mongoose from 'mongoose';
import { Order, OrderStatus } from './order'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// An interface that describes the properties
// that are required to create a new Ticket

interface TicketAttrs {
  id: string;
  version: number,
  title: string;
  price: number;
}

// An interface that describes the properties
// that a Ticket Document has. (for instantiation)

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// An interface that describes the properties
// that a Ticket Model has. (for collection)

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number}): Promise<TicketDoc | null>
}

// Schema defines the different properties
// the user is going to have

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
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

ticketSchema.set('versionKey','version')
ticketSchema.plugin(updateIfCurrentPlugin);

// Add the build function to ticket schema
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
      _id: attrs.id,
      title: attrs.title,
      price: attrs.price
    });
};

// Add the findByEvent function to ticket schema
ticketSchema.statics.findByEvent = (event: { id: string, version: number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
};

// Add the isReserved function to ticket schema

ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that called 'isReserved'
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
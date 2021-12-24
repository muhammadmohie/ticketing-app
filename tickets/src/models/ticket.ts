import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// An interface that describes the properties
// that are required to create a new Ticket

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// that a Ticket Document has. (for instantiation)

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

// An interface that describes the properties
// that a Ticket Model has. (for collection)

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
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

ticketSchema.set('versionKey','version')
ticketSchema.plugin(updateIfCurrentPlugin);

// Add a method to user schema
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
  };


const Ticket = mongoose.model<TicketDoc, TicketModel>('User', ticketSchema);

export { Ticket };
import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface TicketAttrs{
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document{
    title: string;
    price: number;
    version: number;
    // a method that determines if a ticket is reserved 
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number}): Promise<TicketDoc| null>;
}

const ticketSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },

} ,  
    {
      toJSON: {
          transform(doc, ret){
              ret.id = ret._id
              delete ret._id
          }
        }  
    } 
);
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent =  (event:{ id: string, version: number} ) =>{
    return Ticket.findOne({
        // in the database id is stored as _id : we convert it back to id 
        // when we send it as a json object
        _id: event.id,
        version: event.version - 1
    });
};
ticketSchema.statics.build = (attrs: TicketAttrs) =>{
    // this was done this way to assign the id to _id
    // otherwise mongoose will assign id to id and then add an _id #388
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });
};
// defining the function that checks if the ticket is reserved
ticketSchema.methods.isReserved = async function(){
    //this=== the ticket document that we just called 'isReserved' on
 
    //?? Explaining the get reserved method
    // run query to look at all orders. Find an order where the ticket
    //is the ticket we just found *and* the orders status is *not* cancelled.
    // if we find an order from that means the ticket *is* reserved
    const existingOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ],
        },
    });

    // exisitngorder has too !! to convert to bolean
    // !exisiting order = True if existing order is null and false if defined
    // the next ! will negate what is stated in the above line
    return !!existingOrder;
}

//Ticket is the model 
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};
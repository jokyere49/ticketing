import mongoose from 'mongoose';
import { updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface TicketAttrs{
    title: string;
    price: number;
    userId: string;
}

interface TicketDoc extends mongoose.Document{
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string; // we are adding orderId so we can lock down a ticket  orderId is optional
    // when a ticket is first created, the orderId is undefined

}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    orderId:{
        type: String,
    }
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
// tracking version
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) =>{
    return new Ticket(attrs)
};

//Ticket is the model 
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};
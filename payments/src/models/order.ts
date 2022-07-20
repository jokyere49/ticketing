import mongoose from 'mongoose';
import { OrderStatus } from '@jokytickets/common';
import { updateIfCurrentPlugin} from 'mongoose-update-if-current';


export { OrderStatus };

interface OrderAttrs{
    id: string;
    version: number;
    userId: string;
    price: number
    status: OrderStatus;
}

// it is the property need to create and order
// this interface already has the id so we don't have to list that
interface OrderDoc extends mongoose.Document{
    version: number;
    userId: string;
    price: number
    status: OrderStatus;

}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc;
}

// we don't have to define the version bcos it is being tracked automatically
const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
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
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs: OrderAttrs) =>{
    // return is written this one bcos id in mongoose is written as _id
    // so we need to pass the attrs.id to _id
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    });
};

//Ticket is the model 
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};
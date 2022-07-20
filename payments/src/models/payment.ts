import mongoose from 'mongoose';


// no need for version number since we are not emitting event and 
// also we not updating a payment once it is done


interface PaymentAttrs{
    orderId: string;
    stripeId: string;
}


interface PaymentDoc extends mongoose.Document{
    orderId: string;
    stripeId: string;

}

interface PaymentModel extends mongoose.Model<PaymentDoc>{
    build(attrs: PaymentAttrs): PaymentDoc;
}

// we don't have to define the version bcos it is being tracked automatically
const paymentSchema = new mongoose.Schema({
    orderId:{
        type: String,
        required: true
    },

    stripeId:{
        type: String,
        required: true
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

paymentSchema.statics.build = (attrs: PaymentAttrs) =>{
    return new Payment(attrs);
};

//Ticket is the model 
const Payment = mongoose.model<PaymentDoc, PaymentModel>('payment', paymentSchema);

export {Payment};
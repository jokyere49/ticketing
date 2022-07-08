import mongoose from "mongoose";
import { Password } from '../services/password'

// An interface that  describes the properties
// required to create a new user
interface UserAttrs {
    email: string;
    password: string;
}

//  An interface that describes the properties
// that a User Model has
// In this example we adding the method build to the Usermodel so
// we inherite from mongoose.Model and we add build method
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc; // this defines the input and return type of the build method
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;

}
// schema list out the various property a user is suppose to have
// type in the schema doesn't tell ts anything
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
} ,  
    {
      toJSON: {
          transform(doc, ret){
              ret.id = ret._id
              delete ret.password;
              delete ret.__v;
              delete ret._id

          }
        }  
    } 
);

// this allow the user properties to be checked when u are using ts
// this add a new method 'build' which is defined below to a userschema video 155
userSchema.pre('save',  async function(done){
    if (this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) =>{
    return new User(attrs)
};

//User is the model 
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

//how to create a new user
//  new user({ email: 'bdwjdibiwb@test.com', password;'uweuwbedb});

//what angle bracket for ? video 157. It is used to pass the type to the function or method or class
// Angle brackets are known as generics in typescript


export { User };
import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema =new  mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.models?.User || mongoose.model('User', userSchema);

const vaultSchema =new  mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true
    },
    encryptedPayload:{
      type:String,
      required:true
    }
})
export const Vault = mongoose.models?.Vault || mongoose.model('Vault', vaultSchema);


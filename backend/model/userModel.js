import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
})

const UserModel = mongoose.models.model || mongoose.model("User", userSchema);

export default UserModel;
import mongoose from "mongoose";

const NotificationUserSchema = new mongoose.Schema({
 user:{
    type: String,
    required: true,
 },

 socket:{
    type: String,
    required: true,
 }
});

// UserSchema.set("strictPopulate", false);

const  NotificationUser= mongoose.model("NotificationUser",  NotificationUserSchema);
export default  NotificationUser;

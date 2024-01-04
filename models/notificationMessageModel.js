import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  seen:{
    type:Boolean,
    default:"false"
  }
},
{
  timestamps:true
}
);

const notificationSchema = new mongoose.Schema({
  receiverid: {
    type: String, 
    required: true,
  },
  messages: [messageSchema],
});

const Notification= mongoose.model("NotificationMessage", notificationSchema);
export default Notification;

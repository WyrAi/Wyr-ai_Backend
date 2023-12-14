import mongoose from "mongoose";
// import ChatUser from "./userModel";


const messageSchmea = new mongoose.Schema(
  {
    // sednder:{type:mongoose.Schema.Types.ObjectId, ref:ChatUser},
    // recipient: {type:mongoose.Schema.Types.ObjectId, ref:ChatUser },
    sender:{type:String, trim: true},
    recipient:{type:String, trim:true},
    message: { type: String, trim: true },
    created_at:{type: Date, default: Date.now},
  }
);

const Message = mongoose.model("Message", messageSchmea);

export default Message;
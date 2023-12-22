import mongoose from "mongoose";

const senderSchema = new mongoose.Schema({
  senderid: { type: String, required: true, unique: true },
});

const textSchema = new mongoose.Schema({
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
},
{
  timestamps: true,
});

const messageSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, required: true },
  messages: [
    {
      receiverid: senderSchema,
      texts: [textSchema],
    }
  ],
});

const Message = mongoose.model('Message', messageSchema);

export default  Message ;

import Message from "../models/message.js";

const Getmessages = async (req, res) => {
  try {
    const recipient = req.params.recipient;
    console.log("getmessage", recipient );
    const messages = await Message.findOne({recipient});

    res.status(200).json(messages.message);
    // const response = await messages.json()
    console.log("message",messages.message)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new message
const Postmessage = async (req, res) => {
  console.log("req.body", req.body);
  const { recipient, sender, message } = req.body;

  try {
    const newMessage = new Message({
      recipient: recipient,
      message: message,
      sender: sender,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { Getmessages, Postmessage };

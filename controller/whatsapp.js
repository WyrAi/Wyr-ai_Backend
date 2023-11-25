import express from 'express';
import axios from 'axios';
import twilio from 'twilio';

const accountSid = "AC1e2866da7c6bf3de40deee85b267336c"; // Your Twilio Account SID
const authToken = "d753d8d7db8d4f937399b07c2a2cc9d0";   // Your Twilio Auth Token
const twilioNumber = "whatsapp:+919289544724"; // Your Twilio WhatsApp number

const client = twilio(accountSid, authToken); // Create a Twilio client

const message = async (req, res) => {
  const { toNumber, message } = req.body; // toNumber format should be 'whatsapp:+1234567890'

  client.messages.create({
    from: twilioNumber,
    to: toNumber,
    body: message,
  })
  .then(message => {
    console.log(message.sid);
    res.send({ success: true, sid: message.sid });
  })
  .catch(error => {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  });
};

export { message };

require("dotenv").config();
// const axios = require("axios");

// For webhook verificaion
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// For sending messages
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Verify webhook
exports.verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
};

// Webhook to receive messages
exports.receiveMessages = async (req, res) => {
  if (req.body.entry) {
    const messages = req.body.entry[0]?.changes[0]?.value?.messages;
    if (messages && messages.length > 0) {
      const from = messages[0].from; // Sender's phone number
      const text = messages[0]?.text?.body || ""; // Message text
      console.log(`Received message from ${from}: ${text}`);
    }
  }
  return res.sendStatus(200);
};
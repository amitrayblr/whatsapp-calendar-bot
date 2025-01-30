require('dotenv').config()
const axios = require('axios')
const { getWeeklySchedule } = require('../services/googleCalendarService')
const moment = require('moment')

// For webhook verificaion
const VERIFY_TOKEN = process.env.VERIFY_TOKEN

// For sending messages
const API_VERSION = process.env.API_VERSION
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID

// Verify webhook
exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode && token === VERIFY_TOKEN) {
    console.log('Webhook verified')
    return res.status(200).send(challenge)
  } else {
    return res.sendStatus(403)
  }
}

// Webhook to receive messages
exports.receiveMessages = async (req, res) => {
  if (req.body.entry) {
    const messages = req.body.entry[0]?.changes[0]?.value?.messages
    if (messages && messages.length > 0) {
      const from = messages[0].from // Sender's phone number
      const text = messages[0]?.text?.body || '' // Message text
      console.log(`Received message from ${from}: ${text}`)

      // Check if the user wants the schedule
      if (text.trim().toLowerCase() === 'schedule') {
        const scheduleMessage = await getWeeklySchedule()
        await sendWhatsAppMessage(from, scheduleMessage)
      }
    }
  }
  return res.sendStatus(200)
}

// Helper function to send a text message to the user 
async function sendWhatsAppMessage(recipientNumber, messageText) {
  const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`

  try {
    await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to: recipientNumber,
        text: { body: messageText },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log(`Message sent to ${recipientNumber}`)
  } catch (err) {
    console.error('Error sending WhatsApp message:', err.response?.data || err.message)
  }
}
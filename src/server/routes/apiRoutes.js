const express = require('express')
const router = express.Router()

// Importing controllers
const apiController = require('../controllers/apiController')
const calendarController = require('../controllers/calendarController')
const whatsappController = require('../controllers/whatsappController')

// Defining api routes 
router.get('/ping', apiController.pong)

// Defining calendar routes
router.get('/events', calendarController.getCalendarEvents)

// Defining whatsapp routes
router.get('/webhook', whatsappController.verifyWebhook)
router.post('/webhook', whatsappController.receiveMessages)

module.exports = router
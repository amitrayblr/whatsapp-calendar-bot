const express = require('express')
const router = express.Router()

// Importing controllers
const whatsappController = require('../controllers/whatsappController')

// Defining whatsapp routes
router.get('/webhook', whatsappController.verifyWebhook)
router.post('/webhook', whatsappController.receiveMessages)

module.exports = router
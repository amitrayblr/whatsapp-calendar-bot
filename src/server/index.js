const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

// Importing and using routes
const apiRoutes = require('./routes/apiRoutes')
app.use('/api', apiRoutes)

// Starting the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
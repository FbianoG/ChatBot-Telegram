require('dotenv').config()
const express = require('express')
const { startTelegramClient, messages } = require('./public/utils/telegram.js')

const app = express()
const port = process.env.PORT

startTelegramClient()

app.listen(port, () => { console.log(`Server is running: http://localhost:${port}`) })
require('dotenv').config()
const express = require('express')
const { startTelegramClient, messages } = require('./public/utils/telegram.js')

const app = express()
const port = process.env.PORT

startTelegramClient()

// app.get('/events', (req, res) => {
//     return res.send(events)
// })
app.get('/messages', (req, res) => {
    return res.send(messages)
})

app.listen(port, () => { console.log(`Server is running: http://localhost:${port}`) })
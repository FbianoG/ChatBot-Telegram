const fs = require('fs')

const pathMessages = './public/json/messages.json'

function registerMessage(msgObj) {
    let messages = fs.readFileSync(pathMessages, 'utf-8')

    let messagesArr = JSON.parse(messages)
    messagesArr.push(msgObj)

    messages = JSON.stringify(messagesArr)

    fs.writeFileSync(pathMessages, messages)
}

function getMessages() {
    let messages = fs.readFileSync(pathMessages, 'utf-8')
    return JSON.parse(messages)
}

module.exports = { registerMessage, getMessages }
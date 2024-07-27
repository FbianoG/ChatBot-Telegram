// All
const fs = require('fs')
require('dotenv').config()

// Libs Telegram
const { TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')
const Telegraf = require('telegraf')
const input = require('input')

// Exports
const { registerMessage, getMessages } = require('./registerMessages')
const { findChannel, channelActive } = require('./channels')
const { sendMessageBot } = require('./chatBot')

// Environment variables
const chatSendId = process.env.CHAT_SEND_ID
const apiId = Number(process.env.API_ID)
const apiHash = process.env.API_HASH
const bot = new Telegraf(process.env.BOT_TOKEN)

// Variables
let stringSession
// let events = [{ ServerStart: new Date() }]

// Function to start the Client of Telegram
async function startTelegramClient() {
    try {
        console.log('Loading Client...')
        if (fs.existsSync('./public/keys/session.txt')) {
            const savedSession = fs.readFileSync('./public/keys/session.txt', 'utf-8')
            stringSession = new StringSession(savedSession)
        } else {
            stringSession = new StringSession('')
        }
        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 9999,
            timeout: 1,
            autoReconnect: true,
        })
        await client.start({
            phoneNumber: async () => await input.text('Por favor, insira seu número de telefone: '),
            password: async () => await input.text('Por favor, insira sua senha: '),
            phoneCode: async () => await input.text('Por favor, insira o código que você recebeu: '),
            onError: (err) => console.log(err),
        })
        console.log('ChatBot is running!')
        fs.writeFileSync('./public/keys/session.txt', client.session.save())
        client.addEventHandler(async (event) => eventTelegram(client, event))
    } catch (error) {
        console.log(error)
    }

  //  bot.on('message', (msg) => {
  //      const chatId = msg.chat.id
  //      const message = msg.message.text
  //      if (!chatId && !message) return
  //      const text = sendMessageBot(chatId, message)
//      bot.telegram.sendMessage(chatId, `${text}`)
//      console.log('(FAQ) Enviado!')
//   })
 //   bot.launch()
}

// Listen to all events on Telegram
async function eventTelegram(client, event) {

    try {
         console.log(event)
        if (event.className != 'UpdateNewChannelMessage') return

        const msg = event.message

       // console.log("ChannelId: " + msg.peerId.channelId.value)

        if (!channelActive(msg.peerId.channelId.value)) return

        // Receive documents
        if (msg?.media?.className === 'MessageMediaDocument') {

            let response

            const mimeType = msg.media.document.mimeType.split('/')[1]
            const doc = event.message.media.document
            const buffer = await client.downloadMedia(doc)
            const tempDocPath = `./public/documents/temp-doc.${mimeType}`
            fs.writeFileSync(tempDocPath, buffer)

            if (!msg.message) response = await client.sendFile(chatSendId, { file: tempDocPath, caption: `✉️ **De:** __${findChannel(msg.peerId.channelId.value)}__` }) // messageless
            else response = await client.sendFile(chatSendId, { file: tempDocPath, caption: `✉️ **De:** __${findChannel(msg.peerId.channelId.value)}__\n\n${msg.message}` }) // with message

            const msgObj = { id: response.id, fromId: msg.id, chatId: msg.peerId.channelId.value.toString(), message: msg.message }
            registerMessage(msgObj)

            console.log(`Msg com '${mimeType}' enviada!`)
            return
        }

        // Receive photo
        if (msg?.media?.className === 'MessageMediaPhoto') {

            let response

            const photo = msg.media.photo
            const buffer = await client.downloadMedia(photo)
            const tempDocPath = `./public/documents/temp-photo.jpg`
            fs.writeFileSync(tempDocPath, buffer)

            if (!msg.message) response = await client.sendFile(chatSendId, { file: tempDocPath, caption: `✉️ **De:** __${findChannel(msg.peerId.channelId.value)}__` }) // messageless
            else response = await client.sendFile(chatSendId, { file: tempDocPath, caption: `✉️ **De:** __${findChannel(msg.peerId.channelId.value)}__\n\n${msg.message}` }) // with message

            const msgObj = { id: response.id, fromId: msg.id, chatId: msg.peerId.channelId.value.toString(), message: msg.message }
            registerMessage(msgObj)

            console.log('Msg com foto enviada!')
            return
        }

        // Receive common message
        if (msg?.message) {
            let response
            // Is reply
            if (msg.replyTo) {

                const messages = getMessages()

                const msgReply = messages.find(element => element.chatId == msg.peerId.channelId.value && element.fromId === msg.replyTo.replyToMsgId)

                if (msgReply) {
                    response = await client.sendMessage(chatSendId, { message: `✉️ **De:** __${findChannel(msg.peerId.channelId.value)}__\n\n${msg.message}`, replyTo: msgReply.id })
                    console.log('Msg comum c/ reply enviada!')
                }

            } else {
                response = await client.sendMessage(chatSendId, { message: `✉️ **De:** __${findChannel(msg.peerId.channelId.value)}__\n\n${msg.message}` })
                console.log('Msg comum enviada!')
            }

            const msgObj = { id: response.id, fromId: msg.id, chatId: msg.peerId.channelId.value.toString(), message: msg.message }
            registerMessage(msgObj)

            return
        }

        // Receive common message (Necessary?)
        if (typeof msg === 'string') {

            await client.sendMessage(chatSendId, { message: msg, quotedMessageId: 73 })
            console.log('Msg comum enviada!')

            const msgObj = { id: response.id, fromId: msg.id, chatId: msg.peerId.channelId.value.toString(), message: msg.message }
            registerMessage(msgObj)

            return
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = { startTelegramClient }

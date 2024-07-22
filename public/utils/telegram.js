require('dotenv').config()
const Telegraf = require('telegraf')
const fs = require('fs')
const { TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')
const input = require('input')

const chatSendId = process.env.CHAT_SEND_ID
const apiId = Number(process.env.API_ID)
const apiHash = process.env.API_HASH
const bot = new Telegraf(process.env.BOT_TOKEN)

let stringSession

let events = [{ ServerStart: new Date() }] // List of Client events
let messages = []


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
    // bot.launch()
}

// Listen to all events on Telegram
async function eventTelegram(client, event) {

    try {
        if (event.className === 'UpdateUserStatus' && !event.message) return

        const msg = event.message

        events.push(new Date(), msg)

        // Receive documents
        if (msg?.media?.className === 'MessageMediaDocument') {
            let response
            const mimeType = msg.media.document.mimeType.split('/')[1]
            const doc = event.message.media.document
            if (!msg.message) response = await client.sendFile(chatSendId, { file: doc }) // messageless
            if (msg.message) response = await client.sendFile(chatSendId, { file: doc, caption: msg.message }) // with message
            const msgObj = { id: response.id, fromId: msg.id, chatId: msg.peerId.channelId.value.toString(), message: msg.message }
            messages.push(msgObj)
            console.log(`Msg com '${mimeType}' enviada!`)
            return
        }

        // Receive photo
        if (msg?.media?.className === 'MessageMediaPhoto') {
            let response
            const photo = msg.media.photo
            if (!msg.message) response = await client.sendFile(chatSendId, { file: photo, caption: '' }) // messageless
            if (msg.message) response = await client.sendFile(chatSendId, { file: photo, caption: msg.message }) // with message
            const msgObj = { id: response.id, fromId: msg.id, chatId: msg.peerId.channelId.value.toString(), message: msg.message }
            messages.push(msgObj)
            console.log('Msg com foto enviada!')
            return
        }

        // Receive common message
        if (msg?.message) {
            let response
            // Is reply
            if (msg.replyTo) {
                const msgReply = messages.find(element => element.chatId == msg.peerId.channelId.value && element.fromId === msg.replyTo.replyToMsgId)
                if (msgReply) {
                    response = await client.sendMessage(chatSendId, { message: msg.message, replyTo: msgReply.id })
                    console.log('Msg comum c/ reply enviada!')
                } else { // reply not found in the Database, but is reply
                    response = await client.sendMessage(chatSendId, { message: msg.message })
                    console.log('Msg comum c/ reply enviada! (s/ dados)')
                }
            } else {
                response = await client.sendMessage(chatSendId, { message: msg.message })
                console.log('Msg comum enviada!')
            }
            const msgObj = { id: response.id, fromId: msg.id, chatId: msg.peerId.channelId.value.toString(), message: msg.message }
            messages.push(msgObj)
            return
        }

        // Receive common message (Necessary?)
        if (typeof msg === 'string') {
            await client.sendMessage(chatSendId, { message: msg, quotedMessageId: 73 })
            console.log('Msg comum enviada!')
            const msgObj = { id: response.id, fromId: msg.id, chatId: msg.peerId.channelId.value.toString(), message: msg.message }
            return
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = { startTelegramClient, events, messages }
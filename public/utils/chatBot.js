const fs = require('fs')

function sendMessageBot(chatId, message) {

    if (!['1', '2', '3', '4'].some(element => element === message)) return fs.readFileSync('./public/documents/assist.txt', 'utf-8')
        
    if (message == '1') return fs.readFileSync('./public/documents/faq.txt', 'utf-8')
    else if (message == '2') return fs.readFileSync('./public/documents/repasses.txt', 'utf-8')
    else if (message == '3') return fs.readFileSync('./public/documents/iptv.txt', 'utf-8')
    else if (message == '4') return fs.readFileSync('./public/documents/admin.txt', 'utf-8')
    else return fs.readFileSync('./public/documents/assist.txt', 'utf-8')
}

module.exports = { sendMessageBot }
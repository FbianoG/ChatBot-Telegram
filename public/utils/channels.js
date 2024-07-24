const fs = require('fs')
const channelsJson = fs.readFileSync('./public/json/channels.json', 'utf-8')
const channels = JSON.parse(channelsJson)

// Checks if the channel is active
function channelActive(id) {
    return channels.some(element => element.id == id && element.active)
}

// Function find the channel ID
function findChannel(id) {
    const channel = channels.find(element => element.id == id)
    if (!channel) return ''
    return channel.name
}

module.exports = { findChannel, channelActive }

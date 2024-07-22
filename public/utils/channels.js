const channels = [
    {
        name: 'ChatTeste',
        id: '2153116950',
        active: true
    },
    {
        name: 'ChatRecebe',
        id: '2134377722'
    }
]

// Function find the channel ID
function findChannel(id) {
    const channel = channels.find(element => element.id == id)
    console.log(id)
    if (!channel) return ''
    return channel.name
}

module.exports = {findChannel}
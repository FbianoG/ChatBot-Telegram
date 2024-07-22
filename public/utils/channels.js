const channels = [
    {
        name: 'ChatTeste',
        id: '2153116950',
        active: true
    },
    {
        name: 'ChatRecebe',
        id: '2134377722',
        active: false,
    },
    {
        name: 'Dupla Futebol ⚽',
        id: '1214308482',
        active: true,
    },
    {
        name: 'Dupla Basquete 🏀',
        id: '1216091692',
        active: true,
    },
    {
        name: 'Dupla FIFA 🎮',
        id: '1355848104',
        active: false,
    },
    {
        name: 'Dupla Galgos 🐕‍🦺',
        id: '1270361246',
        active: false,
    },
    {
        name: 'Dupla Cantos ⚽',
        id: '1221399350',
        active: true,
    },
    {
        name: 'Dupla E-Sports 🎮',
        id: '1480220495n',
        active: false,
    },
]

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
const channels = [
    {
        name: 'ChatTeste',
        id: '2153116950'
    },
    {
        name: 'ChatRecebe',
        id: '2134377722'
    },
    {
        name: 'Dupla Futebol',
        id: '1214308482'
    },
    {
        name: 'Dupla Basquete',
        id: '1216091692'
    },
    {
        name: 'Dupla FIFA',
        id: '1355848104'
    },
    {
        name: 'Dupla Galgos',
        id: '1270361246'
    },
]

// Function find the channel ID
function findChannel(id) {
    const channel = channels.find(element => element.id == id)
    console.log(id)
    if (!channel) return ''
    return channel.name
}

module.exports = {findChannel}

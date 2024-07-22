const channels = [
    {
        name: 'ChatTeste',
        id: '2153116950'
    },
    {
        name: 'ChatRecebe',
        id: '2134377722'
    }
]

// Function find the channel ID
function findChannel(id) {
    const channnel = channels.find(element => element.id == id)
    console.log(id)
    return channnel.name
}

module.exports = findChannel
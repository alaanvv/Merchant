const { getInventory, getItem, removeItem } = require('../../util')

module.exports = {
  name: 'inventory',
  aliases: ['inv'],

  run: async function (bot, message, args) {
    let itemsArr = await getInventory(message.author.id)
    itemsArr = itemsArr.map(data => {
      const item = getItem(data)
      if (!item) { removeItem(message.author.id, data); return }
      return item
    })

    itemsArr = itemsArr.filter(item => item !== undefined)
    
    itemsArr = Object.values(itemsArr.reduce((ac, item) => {
      if (!ac[item.name]) ac[item.name] = {...item, quantity: 1 }
      else ac[item.name].quantity += 1

      return ac
    }, {}))

    const pageSize = 5
    const totalPages = Math.ceil(itemsArr.length / pageSize)
    let currentPage = 1

    const generateEmbed = page => {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const data = itemsArr.slice(start, end)

      return {
        title: `${message.author.username}'s Inventory`,
        description: data.length ? data.map(item => `**${item.name}** ${item.quantity > 1 ? `_x${item.quantity}_` : ''} \n${item.description}`).join('\n\n') : 'Empty',
        footer: { text: `Page: ${currentPage} / ${totalPages}` }
      }
    }

    const messageEmbed = await message.channel.send({ embeds: [generateEmbed(currentPage)] })
    await messageEmbed.react('⬅️')
    await messageEmbed.react('➡️')

    // Collector
    const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id
    const collector = messageEmbed.createReactionCollector({ filter, time: 60000 })

    collector.on('collect', async (reaction, user) => {
      await reaction.users.remove(user.id)

      if (reaction.emoji.name === '⬅️') {
        if (currentPage === 1) return
        currentPage--
      } else if (reaction.emoji.name === '➡️') {
        if (currentPage === totalPages) return
        currentPage++
      }

      await messageEmbed.edit({ embeds: [generateEmbed(currentPage)] })
      await reaction.users.remove(user.id)
    })

    collector.on('end', messageEmbed.reactions.removeAll)
  }
}
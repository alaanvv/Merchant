const { items } = require('../../util')

module.exports = {
  name: 'shop',
  aliases: ['s'],

  run: async (bot, message, args) => {
    const itemsData = Object.values(items)

    const pageSize = 5
    const totalPages = Math.ceil(itemsData.length / pageSize)
    let currentPage = 1

    const generateEmbed = page => {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const data = itemsData.slice(start, end)

      return {
        title: `${message.guild.name} Shop`,
        description: data.map(data => `**${data.name}** \n${data.description} \n**${data.price}${bot._Ecoin}**`).join('\n\n'),
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

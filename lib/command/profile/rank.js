const { conn } = require('../../../db/conn')

module.exports = {
  name: 'rank',
  aliases: ['leaderboard', 'lb'],

  run: async (bot, message, args) => {
    const res = await conn.cmd('select * from wallet order by coins desc')

    const pageSize = 5
    const totalPages = Math.ceil(res.length / pageSize)
    let currentPage = 1

    const generateEmbed = page => {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const data = res.slice(start, end)

      return {
        title: `${message.guild.name} Ranking`,
        description: data.map(data => `<@${data.userid}> - **${data.coins}${bot._Ecoin}**`).join('\n'),
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

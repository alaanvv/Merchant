function delay(ms, resParam) {
  return new Promise(resolve => setTimeout(() => { resolve(resParam) }, ms))
}
async function page(message, dataArray, _generateEmbed, pageSize = 5) {
  const totalPages = Math.ceil(dataArray.length / pageSize)
  let currentPage = 1

  const generateEmbed = page => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = dataArray.slice(start, end)

    const embed = _generateEmbed(data)
    if (totalPages > 1) embed.footer = { text: `Page: ${currentPage} / ${totalPages}` }

    return embed
  }

  const messageEmbed = await message.channel.send({ embeds: [generateEmbed(currentPage)] })
  if (totalPages > 1) {
    await messageEmbed.react('⬅️')
    await messageEmbed.react('➡️')

    // Collector
    const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id
    const collector = messageEmbed.createReactionCollector({ filter, time: 60000 })

    collector.on('collect', async (reaction, user) => {
      await reaction.users.remove(user.id)

      if (reaction.emoji.name === '⬅️' && currentPage > 1)  currentPage--
      else if (reaction.emoji.name === '➡️' && currentPage < totalPages) currentPage++

      await messageEmbed.edit({ embeds: [generateEmbed(currentPage)] })
    })

    collector.on('end', messageEmbed.reactions.removeAll)
  }
}
function cooldown(bot, message, cmd) {
  if (!cmd.cooldown) return true

  const cooldownId = `${message.author.id} ${cmd.name}`

  if (bot.cooldown.has(cooldownId)) {
    const lastUsed = bot.cooldown.get(cooldownId)
    const remaining = lastUsed + cmd.cooldown - Date.now()
    
    if (remaining > 0) {
      message.reply(`${cmd.cooldownMessage} | ${parseInt(remaining / 1000)}s` || `This command is on cooldown | ${parseInt(remaining / 1000)}s`)
      return
    }
  }

  bot.cooldown.set(cooldownId, Date.now())
  return true
}
function getMentionedUser(message) {
  const mentionedUsers = message.mentions.users
  if (!mentionedUsers.size) return
  return mentionedUsers.first()
}

module.exports = { ...require('./util/bank'), ...require('./util/coin'), ...require('./util/inventory'), ...require('./util/items'), delay, page, cooldown, getMentionedUser  }
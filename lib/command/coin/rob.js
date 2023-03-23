const { getCoins, payFine, cooldown, getMentionedUser, addCoins, removeCoins } = require('../../util')

module.exports = {
  name: 'rob',
  aliases: ['r'],
  cooldown: 60e3*10,
  cooldownMessage: 'You need to wait before robbing again', 

  run: async function (bot, message, args) {
    if (!cooldown(bot, message, module.exports)) return

    const mentionedUser = getMentionedUser(message)
    if (!mentionedUser) return message.reply('Mention a user')
    const mentionedUserCoins = await getCoins(mentionedUser.id)

    if (Math.random() < bot.rules.ROB_FAIL_RATE) {
      const fine = await payFine(message.author.id, bot.rules.ROB_LOOSE_RATE)

      return message.reply(`You was caught. **-${fine}${bot._Ecoin}**`)
    }

    addCoins(message.author.id, mentionedUser)
    removeCoins(mentionedUser.id, mentionedUserCoins)

    message.reply(`Success! You robbed **${mentionedUserCoins}${bot._Ecoin}** from ${mentionedUser.username}`)
  }
}
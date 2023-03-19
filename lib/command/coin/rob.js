const { getCoins, updateCoins, payFine } = require('../../coin/init')
const cooldown = require('../../cooldown')

module.exports = {
  name: 'rob',
  aliases: ['r'],
  cooldown: 60e3*30,
  cooldownMessage: 'You need to wait before robbing other', 

  run: async function (bot, message, args) {
    if (!cooldown(bot, message, module.exports)) return

    const coins = await getCoins(message.author.id)

    // ---

    const mentionedUsers = message.mentions.users;
    if (!mentionedUsers.size) return message.reply('Mention a user')
    const mentionedUser = mentionedUsers.first()
    const mentionedUserCoins = await getCoins(mentionedUser.id)

    // ---

    if (Math.random() < bot.rules.ROB_FAIL_RATE) {
      const fine = await payFine(message.author.id, bot.rules.ROB_LOOSE_RATE)

      return message.reply(`You was caught. **-${fine}${bot._Ecoin}**`)
    }

    await updateCoins(message.author.id, coins + mentionedUserCoins)
    await updateCoins(mentionedUser.id, 0)

    message.reply(`Success! You robbed **${mentionedUserCoins}${bot._Ecoin}** from ${mentionedUser.username}`)
  }
}
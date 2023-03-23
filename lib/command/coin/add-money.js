const { addCoins, resolveCoins, getMentionedUser } = require('../../util')

module.exports = {
  name: 'add-money',
  aliases: ['addmoney'],
  requirements: ['admin'],

  run: async function (bot, message, args) {
    const amount = resolveCoins(args[0])
    if (!amount) return message.reply('Provide a amount of coins to add')

    const mentionedUser = getMentionedUser(message)
    if (!mentionedUser) return message.reply('Mention a user')
    
    addCoins(mentionedUser.id, amount)

    message.reply(`You added **${amount}${bot._Ecoin}** to ${mentionedUser.username}`)
  }
}
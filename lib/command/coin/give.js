const { getCoins, resolveCoins, getMentionedUser, removeCoins, addCoins } = require('../../util')

module.exports = {
  name: 'give',
  aliases: ['give-money', 'givemoney', 'gm'],

  run: async function (bot, message, args) {
    const coins = await getCoins(message.author.id)
    if (!coins) return message.channel.send('You dont have money')
    
    const amount = resolveCoins(args[0], coins)
    if (!amount) return message.reply('Provide a amount of coins to give') 

    const mentionedUser = getMentionedUser(message)
    if (!mentionedUser) return message.reply('Mention a user')

    removeCoins(message.author.id, amount)
    addCoins(mentionedUser.id, amount)

    message.reply(`You gave **${amount}${bot._Ecoin}** to ${mentionedUser.username}`)
  }
}
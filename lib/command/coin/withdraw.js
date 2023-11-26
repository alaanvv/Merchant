const { getCoins, addCoins, removeCoins, resolveCoins } = require('../../util')

module.exports = {
  name: 'withdraw',
  aliases: ['wd'],

  run: async function (bot, message, args) {
    const bankCoins = await getCoins(message.author.id, 'bank')
    if (!bankCoins) return message.channel.send('You dont have deposited money')
    
    const amount = resolveCoins(args[0], bankCoins)
    if (amount > bankCoins) return message.reply('You dont have money enough')

    await removeCoins(message.author.id, amount, 'bank')
    await addCoins(message.author.id, amount)

    message.reply(`You withdrew **${amount}${bot._Ecoin}**`)
  }
}
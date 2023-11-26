const { getCoins, addCoins, removeCoins, resolveCoins } = require('../../util')

module.exports = {
  name: 'deposit',
  aliases: ['dep'],

  run: async function (bot, message, args) {
    const coins = await getCoins(message.author.id)
    if (!coins) return message.channel.send('You dont have money')
    
    const amount = resolveCoins(args[0], coins)
    if (amount > coins) return message.reply('You dont have money enough')

    if (amount <= bot.rules.DEPOSIT_TAX_MIN) return message.reply(`You need to deposit at least ${bot.rules.DEPOSIT_TAX_MIN + 1}`)
    const tax = Math.max(bot.rules.USE_DEPOSIT_TAX ? Math.floor(Math.ceil(amount) * bot.rules.DEPOSIT_TAX) : 0, bot.rules.DEPOSIT_TAX_MIN)

    await removeCoins(message.author.id, amount)
    await addCoins(message.author.id, amount - tax, 'bank')

    if (bot.rules.USE_DEPOSIT_TAX) message.reply(`You deposited **${amount}${bot._Ecoin}** paying a tax of **${tax}${bot._Ecoin}** (**${amount-tax}${bot._Ecoin}**)`)
    else message.reply(`You deposited **${amount}${bot._Ecoin}**`)
  }
}
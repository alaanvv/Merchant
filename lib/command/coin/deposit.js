const { getCoins, updateCoins } = require('../../util')

module.exports = {
  name: 'deposit',
  aliases: ['dep'],

  run: async function (bot, message, args) {
    const coins = await getCoins(message.author.id)
    const bankCoins = await getCoins(message.author.id, 'bank')
    if (!coins) return message.channel.send('You dont have money')
    
    let amount = args[0]
    if (!Number(amount)) {
      if (amount === 'all') amount = coins
      else if (amount === 'half') amount = coins / 2
      else return message.reply('Provide a amount of coins to deposit')
    }
    amount = Number(amount)
    if (amount <= 0) return message.reply('Provide a amount of coins to deposit') 
    if (amount > coins) return message.reply('You dont have money enough')
    amount = Math.ceil(amount)
    if (amount <= bot.rules.DEPOSIT_TAX_MIN) return message.reply(`You need to deposit at least ${bot.rules.DEPOSIT_TAX_MIN + 1}`)
    const tax = Math.max(bot.rules.USE_DEPOSIT_TAX ? Math.floor(Math.ceil(amount) * bot.rules.DEPOSIT_TAX) : 0, bot.rules.DEPOSIT_TAX_MIN)

    // ---

    await updateCoins(message.author.id, coins - amount)
    await updateCoins(message.author.id, bankCoins + amount - tax, 'bank')

    if (bot.rules.USE_DEPOSIT_TAX) message.reply(`You deposited **${amount}${bot._Ecoin}** paying a tax of **${tax}${bot._Ecoin}** (**${amount-tax}${bot._Ecoin}**)`)
    else message.reply(`You deposited **${amount}${bot._Ecoin}**`)
  }
}
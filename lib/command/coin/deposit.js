const { getCoins, updateCoins } = require('../../coin/init')

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
      else return message.reply('Provide a amount of coins to give')
    }
    amount = Number(amount)
    if (amount <= 0) return message.reply('Provide a amount of coins to give') 
    if (amount > coins) return message.reply('You dont have money enough')
    amount = Math.ceil(amount)
    const tax = bot.rules.USE_DEPOSIT_TAX ? Math.floor(Math.ceil(amount) * bot.rules.DEPOSIT_TAX) : 0

    // ---

    await updateCoins(message.author.id, coins - amount)
    await updateCoins(message.author.id, bankCoins + amount - tax, 'bank')

    if (bot.rules.USE_DEPOSIT_TAX) message.reply(`You deposited **${amount}${bot._Ecoin}** paying a tax of **${tax}${bot._Ecoin}** (**${amount-tax}${bot._Ecoin}**)`)
    else message.reply(`You deposited **${amount}${bot._Ecoin}**`)
  }
}
const { getCoins, updateCoins } = require('../../coin/init')

module.exports = {
  name: 'withdraw',
  aliases: ['wd'],

  run: async function (bot, message, args) {
    const coins = await getCoins(message.author.id)
    const bankCoins = await getCoins(message.author.id, 'bank')
    if (!bankCoins) return message.channel.send('You dont have deposited money')
    
    let amount = args[0]
    if (!Number(amount)) {
      if (amount === 'all') amount = bankCoins
      else if (amount === 'half') amount = cobankCoinsins / 2
      else return message.reply('Provide a amount of coins to give')
    }
    amount = Number(amount)
    if (amount <= 0) return message.reply('Provide a amount of coins to give') 
    if (amount > bankCoins) return message.reply('You dont have money enough')
    amount = Math.ceil(amount)

    // ---

    await updateCoins(message.author.id, bankCoins - amount, 'bank')
    await updateCoins(message.author.id, coins + amount)

    message.reply(`You withdrawed **${amount}${bot._Ecoin}**`)
  }
}
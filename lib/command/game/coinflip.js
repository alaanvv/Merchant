const { resolveCoins, getCoins, addCoins, removeCoins } = require('../../util')

module.exports = {
  name: 'coinflip',
  aliases: ['coin-flip'],

  run: async (bot, message, args) => {
    const coins = await getCoins(message.author.id)
    
    let wager = resolveCoins(args[0])
    if (!wager) return message.reply('Provide a amount of coins to bet') 
    if (wager > coins) return message.reply('You dont have money enough')

    const coin = Math.random()

    if (coin > bot.rules.COINFLIP_WIN_RATE) {
      addCoins(message.author.id, wager)
      message.reply(`You win! **+${wager}${bot._Ecoin}**`)
    }
    else {
      removeCoins(message.author.id, wager)
      message.reply(`You loose... **-${wager}${bot._Ecoin}**`)
    }
  }
}
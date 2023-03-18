const { getCoins, updateCoins } = require('../../wallet/init')

module.exports = {
  name: 'coinflip',
  aliases: ['coin-flip', 'cf'],

  run: async (bot, message, args) => {
    const coins = await getCoins(message.author.id)
    if (!coins) return message.channel.send('You dont have money')
    
    let wager = args[0]
    if (!wager) return message.reply('Provide a amount of coins to bet') 
    if (wager === 'all') wager = coins
    else if (wager === 'half') wager = coins / 2
    if (wager <= 0) return message.reply('Provide a amount of coins to bet') 
    if (wager > coins) return message.reply('You have no money enough')
    wager = Math.ceil(wager)

    const coin = Math.random()


    if (coin > bot.rules.COINFLIP_WIN_RATE) {
      await updateCoins(message.author.id, coins + wager)
      message.reply(`You win! **+${wager}${bot._Ecoin}**`)
    }
    else {
      await updateCoins(message.author.id, coins - wager)
      message.reply(`You loose... **-${wager}${bot._Ecoin}**`)
    }
  }
}
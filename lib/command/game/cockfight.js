const { getCoins, updateCoins, hasItem, removeItem } = require('../../util')

module.exports = {
  name: 'cockfight',
  aliases: ['cock-fight', 'cock-f', 'cockf', 'c-fight', 'cfight'],

  run: async (bot, message, args) => {
    const coins = await getCoins(message.author.id)
    if (!coins) return message.channel.send('You dont have money')
    
    let wager = args[0]
    if (!wager) return message.reply('Provide a amount of coins to bet') 
    if (wager === 'all') wager = coins
    else if (wager === 'half') wager = coins / 2
    if (wager <= 0) return message.reply('Provide a amount of coins to bet') 
    if (wager > coins) return message.reply('You dont have money enough')
    wager = Math.floor(wager) > 0 ? Math.floor(wager) : Math.ceil(wager)

    // ---

    const hasCock = await hasItem(message.author.id, 'cock')
    if (!hasCock) return message.reply('You need to buy a cock to bet')

    // ---

    const winRate = bot.cocks[String(message.author.id)] || bot.rules.COCKFIGHT_START_WIN_RATE

    const userCockWins = Math.random()

    const embed = {
      title: ':chicken: Cock-Fight',
      footer: { text: `${winRate * 100}%` }
    }

    if (userCockWins < winRate) {
      bot.cocks[String(message.author.id)] = Math.min(winRate + bot.rules.COCKFIGHT_INCREASE, bot.rules.COCKFIGHT_END_WIN_RATE)

      await updateCoins(message.author.id, coins + wager)
      embed.description = `${message.author.username}'s cock wins! **+${wager}${bot._Ecoin}**`
      message.reply({ embeds: [embed] })
    }
    else {
      bot.cocks[String(message.author.id)] = bot.rules.COCKFIGHT_START_WIN_RATE
      removeItem(message.author.id, 'cock')

      await updateCoins(message.author.id, coins - wager)
      embed.description = `:headstone: ${message.author.username}'s cock loose... **-${wager}${bot._Ecoin}**`
      message.reply({ embeds: [embed] })
    }
  }
}
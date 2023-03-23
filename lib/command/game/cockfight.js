const { getCoins, countItem, removeItem, addCoins, removeCoins } = require('../../util')

module.exports = {
  name: 'cockfight',
  aliases: ['cock-fight', 'cock-f', 'cockf', 'c-fight', 'cfight', 'cf'],

  run: async (bot, message, args) => {
    const coins = await getCoins(message.author.id)
    
    let wager = resolveCoins(args[0])
    if (!wager) return message.reply('Provide a amount of coins to bet') 
    if (wager > coins) return message.reply('You dont have money enough')

    const hasCock = await countItem(message.author.id, 'cock')
    if (!hasCock) return message.reply('You need to buy a cock to bet')

    const armor = await countItem(message.author.id, 'cockArmor')
    const winRate = Math.floor(bot.cocks[String(message.author.id)] || (bot.rules.COCKFIGHT_START_WIN_RATE + armor / 100))

    const embed = {
      title: ':chicken: Cock-Fight',
      footer: { text: `${winRate * 100}%` }
    }

    if (Math.random() < winRate) {
      bot.cocks[String(message.author.id)] = Math.min(winRate + bot.rules.COCKFIGHT_INCREASE, bot.rules.COCKFIGHT_END_WIN_RATE)

      addCoins(message.author.id, wager)
      embed.description = `${message.author.username}'s cock wins! **+${wager}${bot._Ecoin}**`
      message.reply({ embeds: [embed] })
    }
    else {
      bot.cocks[String(message.author.id)] = bot.rules.COCKFIGHT_START_WIN_RATE
      removeItem(message.author.id, 'cock')

      removeCoins(message.author.id, wager)
      embed.description = `:headstone: ${message.author.username}'s cock loose... **-${wager}${bot._Ecoin}**`
      message.reply({ embeds: [embed] })
    }
  }
}
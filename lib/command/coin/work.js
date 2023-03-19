const { getCoins, updateCoins } = require('../../coin/init')
const cooldown = require('../../cooldown')

module.exports = {
  name: 'work',
  aliases: ['w'],
  cooldown: 10e3,
  cooldownMessage: 'You need to wait before working again', 

  run: async function (bot, message, args) {
    if (!cooldown(bot, message, module.exports)) return

    const increase = Math.floor(Math.random() * (bot.rules.WORK_MAX_AMOUNT - bot.rules.WORK_MIN_AMOUNT + 1)) + bot.rules.WORK_MIN_AMOUNT
    const coins = await getCoins(message.author.id)
    
    await updateCoins(message.author.id, coins + increase)

    message.reply(`**+${increase}${bot._Ecoin}**`)
  }
}
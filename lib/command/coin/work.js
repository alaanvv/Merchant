const { addCoins, countItem, cooldown } = require('../../util')

module.exports = {
  name: 'work',
  aliases: ['w'],
  cooldown: 30e3,
  cooldownMessage: 'You need to wait before working again', 

  run: async function (bot, message, args) {
    const fullTimeEmpoylee = await countItem(message.author.id, 'fullTimeEmployee')
    if (fullTimeEmpoylee) { 
      const thisCommand = { ...module.exports }
      thisCommand.cooldown /= 2
      if (!cooldown(bot, message, thisCommand)) return
    }
    else if (!cooldown(bot, message, module.exports)) return

    const increase = Math.floor(Math.random() * (bot.rules.WORK_MAX_AMOUNT - bot.rules.WORK_MIN_AMOUNT + 1)) + bot.rules.WORK_MIN_AMOUNT
    await addCoins(message.author.id, increase)

    message.reply(`**+${increase}${bot._Ecoin}**`)
  }
}
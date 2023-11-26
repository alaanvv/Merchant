const { addCoins, payFine, cooldown } = require('../../util')

module.exports = {
  name: 'crime',
  aliases: ['c'],
  cooldown: 60e3,
  cooldownMessage: 'You need to wait before commiting other crime', 

  run: async function (bot, message, args) {
    if (!cooldown(bot, message, module.exports)) return

    if (Math.random() < bot.rules.CRIME_FAIL_RATE) {
      const fine = await payFine(message.author.id, bot.rules.CRIME_LOOSE_RATE)

      return message.reply(`You failed. **-${fine}${bot._Ecoin}**`)
    }

    const increase = Math.floor(Math.random() * (bot.rules.CRIME_MAX_AMOUNT - bot.rules.CRIME_MIN_AMOUNT + 1)) + bot.rules.CRIME_MIN_AMOUNT
    await addCoins(message.author.id, increase)

    message.reply(`Success! **+${increase}${bot._Ecoin}**`)
  }
}
const { getCoins, updateCoins } = require('../../wallet/init')
const cooldown = require('../../cooldown')

module.exports = {
  name: 'crime',
  cooldown: 0,
  cooldownMessage: 'You need to wait before commiting other crime', 

  run: async function (bot, message, args) {
    if (!cooldown(bot, message, module.exports)) return

    const coins = await getCoins(message.author.id)

    if (Math.random() < bot.rules.CRIME_FAIL_RATE) {
      const decrease = Math.ceil(coins * bot.rules.CRIME_LOOSE_RATE)
      await updateCoins(message.author.id, coins - decrease)

      return message.reply(`You failed. **-${decrease}${bot._Ecoin}**`)
    }

    const increase = Math.floor(Math.random() * (bot.rules.CRIME_MAX_AMOUNT - bot.rules.CRIME_MIN_AMOUNT + 1)) + bot.rules.CRIME_MIN_AMOUNT
    await updateCoins(message.author.id, coins + increase)

    message.reply(`Success! **+${increase}${bot._Ecoin}**`)
  }
}
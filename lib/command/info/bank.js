const { getCoins } = require('../../util')

module.exports = {
  name: 'bank',

  run: async (bot, message, args) => {
    const coins = await getCoins(message.author.id, 'bank')

    message.reply(`${message.author.username}'s Coins \BBank: **${coins}**${bot._Ecoin}`)
  }
}
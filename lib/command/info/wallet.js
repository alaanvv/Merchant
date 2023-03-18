const { getCoins } = require('../../wallet/init')

module.exports = {
  name: 'wallet',
  aliases: ['money', 'coin', 'coins'],

  run: async (bot, message, args) => {
    const coins = await getCoins(message.author.id)

    message.reply(`${message.author.username}'s Coins \nWallet: **${coins}**${bot._Ecoin}`)
  }
}
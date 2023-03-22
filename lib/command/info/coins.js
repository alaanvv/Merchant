const { getCoins, getMentionedUser } = require('../../util')

module.exports = {
  name: 'coins',
  aliases: ['money', 'coin', 'wallet'],

  run: async (bot, message, args) => {
    const user = getMentionedUser(message) || message.author

    const coins = await getCoins(user.id)
    const bankCoins = await getCoins(user.id, 'bank')

    message.reply(`${user.username}'s Coins \nWallet: **${coins}**${bot._Ecoin} \nBank: **${bankCoins}**${bot._Ecoin}`)
  }
}
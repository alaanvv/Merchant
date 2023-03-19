const { getCoins } = require('../../coin/init')

module.exports = {
  name: 'coins',
  aliases: ['money', 'coin', 'wallet'],

  run: async (bot, message, args) => {
    let user

    const mentionedUsers = message.mentions.users;
    if (!mentionedUsers.size) user = message.author
    else user = mentionedUsers.first()

    const coins = await getCoins(user.id)
    const bankCoins = await getCoins(user.id, 'bank')

    message.reply(`${user.username}'s Coins \nWallet: **${coins}**${bot._Ecoin} \nBank: **${bankCoins}**${bot._Ecoin}`)
  }
}
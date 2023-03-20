const { getCoins, updateCoins } = require('../../util')

module.exports = {
  name: 'add-money',
  aliases: ['addmoney'],
  requirements: ['admin'],

  run: async function (bot, message, args) {
    let amount = Number(args[0])
    if (!amount || amount && amount <= 0) return message.reply('Provide a amount of coins to add')
    amount = Math.ceil(amount)

    // ---

    const mentionedUsers = message.mentions.users;
    if (!mentionedUsers.size) return message.reply('Mention a user')
    const mentionedUser = mentionedUsers.first()
    const mentionedUserCoins = await getCoins(mentionedUser.id)

    // ---

    await updateCoins(mentionedUser.id, mentionedUserCoins + amount)

    message.reply(`You added **${amount}${bot._Ecoin}** to ${mentionedUser.username}`)
  }
}
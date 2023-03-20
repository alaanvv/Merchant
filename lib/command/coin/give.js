const { getCoins, updateCoins } = require('../../util')

module.exports = {
  name: 'give',
  aliases: ['give-money', 'givemoney', 'gm'],

  run: async function (bot, message, args) {
    const coins = await getCoins(message.author.id)
    if (!coins) return message.channel.send('You dont have money')
    
    let amount = args[0]
    if (!Number(amount)) {
      if (amount === 'all') amount = coins
      else if (amount === 'half') amount = coins / 2
      else return message.reply('Provide a amount of coins to give')
    }
    amount = Number(amount)
    if (amount <= 0) return message.reply('Provide a amount of coins to give') 
    if (amount > coins) return message.reply('You dont have money enough')
    amount = Math.ceil(amount)

    // ---

    const mentionedUsers = message.mentions.users;
    if (!mentionedUsers.size) return message.reply('Mention a user')
    const mentionedUser = mentionedUsers.first()
    const mentionedUserCoins = await getCoins(mentionedUser.id)

    // ---

    await updateCoins(message.author.id, coins - amount)
    await updateCoins(mentionedUser.id, mentionedUserCoins + amount)

    message.reply(`You gave **${amount}${bot._Ecoin}** to ${mentionedUser.username}`)
  }
}
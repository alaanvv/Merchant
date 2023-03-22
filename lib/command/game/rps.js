const { getCoins, updateCoins, delay } = require('../../util')

module.exports = {
  name: 'rps',
  aliases: ['rockpaperscissors'],
  cooldown: 30e3,
  cooldownMessage: 'You need to wait before challenging someone again', 

  run: async (bot, message, args) => {
    if (!cooldown(bot, message, module.exports)) return
    
    const user = message.author
    const coins = await getCoins(user.id)
    user.coins = coins
    if (!coins) return message.channel.send('You dont have money')

    const mentionedUsers = message.mentions.users
    if (!mentionedUsers.size) return message.reply('Mention someone to challenge')
    const challengedUser = mentionedUsers.first()
    const challengedUserCoins = await getCoins(challengedUser.id)
    challengedUser.coins = challengedUserCoins
    if (!challengedUserCoins) return message.channel.send(`${challengedUser.username} dont have money`)

    let wager = args[0]
    if (!wager) return message.reply('Provide a amount of coins to bet')
    if (wager === 'all') wager = coins
    else if (wager === 'half') wager = coins / 2
    if (isNaN(Number(wager))) return message.reply('Invalid number')
    if (wager <= 0) return message.reply('Provide a amount of coins to bet')
    if (wager > coins) return message.reply('You dont have money enough')
    if (wager > challengedUserCoins) return message.reply(`${challengedUser.username} dont have money enough`)
    wager = Math.floor(wager) > 0 ? Math.floor(wager) : Math.ceil(wager)

    // ---
    bot.blackjackers.push(message.author.id)
    bot.blackjackers.push(challengedUser.id)

    const waitTime = 30e3
    let _userChoice = Promise.race([getUserChoice(user), delay(waitTime)])
    let _challengedUserChoice = Promise.race([getUserChoice(challengedUser), delay(waitTime), 'r'])
    const [userChoice, challengedUserChoice] = await Promise.all([_userChoice, _challengedUserChoice])

    if (!userChoice && !challengedUserChoice) return message.reply('No one chose')
    if (!userChoice) return message.reply('You didnt chose')
    if (!challengedUserChoice) return message.reply(`${challengedUser.username} didnt chose/accept`)

    const userChoiceName = userChoice === 'r' ? 'Rock' : userChoice === 'p' ? 'Paper' : 'Scissors'
    const challengedUserChoiceName = challengedUserChoice === 'r' ? 'Rock' : challengedUserChoice === 'p' ? 'Paper' : 'Scissors'
    const battleMessage = `${user} **${userChoiceName}** X **${challengedUserChoiceName}** ${challengedUser}`

    if (userChoice === challengedUserChoice) return message.reply(`Tie! Both choosed **${userChoiceName}**`)

    let winner
    if (userChoice === 'r') {
      if (challengedUserChoice === 'p') winner = challengedUser
      else if (challengedUserChoice === 's') winner = user
    }
    else if (userChoice === 'p') {
      if (challengedUserChoice === 'r') winner = user
      else if (challengedUserChoice === 's') winner = challengedUser
    }
    else if (userChoice === 's') {
      if (challengedUserChoice === 'r') winner = challengedUser
      else if (challengedUserChoice === 'p') winner = user
    }
    const loser = [user, challengedUser].filter(_user => _user !== winner)[0]

    message.reply(`${battleMessage} \n**${winner.username}** Wins! **+${wager}${bot._Ecoin}** \n**${loser.username}** loses... **-${wager}${bot._Ecoin}**`)

    updateCoins(winner.id, winner.coins + wager)
    updateCoins(loser.id, loser.coins - wager)

    bot.rpsPlayers = bot.rpsPlayers.filter(id => ![message.author.id, challengedUser.id].includes(id))
  }
}

async function getUserChoice(user, challenging) {
  return new Promise(async resolve => {
    const dmChannel = await user.createDM()
    const dmMsg = await dmChannel.send(challenging 
      ? `${challenging.username} is challenging you to a rps game... \n\n[r] -  **Rock** \n[p] - **Paper** \n[s] - **Scissors** \n[cancel] Decline` 
      : '[r] -  **Rock** \n[p] - **Paper** \n[s] - **Scissors**'
      )
    
    const opt = ['r', 'p', 's']
    if (challenging) opt.push('cancel')
    const filter = m => m.author === user && opt.includes(m.content.toLowerCase())
    const collector = dmChannel.createMessageCollector(filter, { max: 1, time: 2000 })

    collector.on('collect', async message => {
      dmMsg.delete()
      resolve(message.content !== 'cancel' ? message.content : false)
    })
  })
}
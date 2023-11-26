const { getCoins, delay, addCoins, removeCoins, getMentionedUser, resolveCoins, cooldown } = require('../../util')

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

    const challengedUser = getMentionedUser(message)
    if (!challengedUser) return message.reply('Mention someone to challenge')
    const challengedUserCoins = await getCoins(challengedUser.id)
    challengedUser.coins = challengedUserCoins

    let wager = resolveCoins(args[0], coins)
    if (wager > challengedUserCoins) return message.reply(`${challengedUser.username} dont have money enough`)
    bot.rpsPlayers.push(message.author.id, challengedUser.id)


    // This block makes the code only continues when both user respond
    const waitTime = 30e3
    let _userChoice = Promise.race([getUserChoice(user), delay(waitTime)])
    let _challengedUserChoice = Promise.race([getUserChoice(challengedUser), delay(waitTime)])
    const [userChoice, challengedUserChoice] = await Promise.all([_userChoice, _challengedUserChoice])

    if (!userChoice || !challengedUserChoice) return message.reply('Someone didnt chose')

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

    addCoins(winner.id, wager)
    removeCoins(loser.id, wager)
    bot.rpsPlayers = bot.rpsPlayers.filter(id => ![message.author.id, challengedUser.id].includes(id))
    
    message.reply(`${battleMessage} \n**${winner.username}** Wins! **+${wager}${bot._Ecoin}** \n**${loser.username}** loses... **-${wager}${bot._Ecoin}**`)
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
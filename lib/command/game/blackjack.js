const { getCoins, updateCoins } = require('../../util')

class Blackjack {
  constructor(bot, _endCallback, canDoubleDown) {
    this.bot = bot
    this.end = false
    this.canDoubleDown = canDoubleDown

    this.deck = []
    this.playerHand = []
    this.dealerHand = []
    this.dealerHandReveal = false

    this.createDeck()
    this.shuffleDeck()
    this.dealCards()

    this.endCallback = (...args) => { this.end = true; this.dealerHandReveal = true; _endCallback(...args) } // (playerWin, message)
  }

  createDeck() {
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const suits = ['H', 'D', 'C', 'S']

    for (let suit of suits) for (let rank of ranks) this.deck.push(rank + suit)
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = this.deck[i]
      this.deck[i] = this.deck[j]
      this.deck[j] = temp
    }
  }

  dealCards() {
    this.playerHand.push(this.deck.pop(), this.deck.pop())
    this.dealerHand.push(this.deck.pop(), this.deck.pop())
  }

  calculateHand(hand) {
    let handValue = 0
    let aces = 0

    for (let card of hand) {
      if (card.startsWith('A')) { aces++; handValue += 11 }
      else handValue += cards[card].value
    }

    while (aces > 0 && handValue > 21) { aces--; handValue -= 10 }

    return handValue
  }

  playerTurn(action) {
    if (!['hit', 'stand', 'double-down'].includes(action)) throw 'Invalid blackjack action'

    if (action === 'hit') {
      this.playerHand.push(this.deck.pop())

      let handValue = this.calculateHand(this.playerHand)
      
      if (this.calculateHand(this.dealerHand) === 21 && this.calculateHand(this.dealerHand) === playerHandValue) this.endCallback(false, 'Tie. No one wins!', true)
      else if (handValue === 21) return this.endCallback(true, 'Blackjack! You win')
      else if (handValue > 21) return this.endCallback = this.endCallback(false, 'Bust! You lose...')
    }
    else if (action === 'stand') this.dealerTurn()
    else if (action === 'double-down' && this.canDoubleDown) {
      this.playerHand.push(this.deck.pop())

      let handValue = this.calculateHand(this.playerHand)
      
      if (this.calculateHand(this.dealerHand) === 21 && this.calculateHand(this.dealerHand) === playerHandValue) this.endCallback(false, 'Tie. No one wins!', true)
      else if (handValue === 21) return this.endCallback(true, 'Blackjack! You win')
      else if (handValue > 21) return this.endCallback = this.endCallback(false, 'Bust! You lose...')
      
      this.dealerTurn()
    }
  }

  dealerTurn() {
    this.dealerHandReveal = true

    let dealerHandValue = this.calculateHand(this.dealerHand)
    let playerHandValue = this.calculateHand(this.playerHand)

    const hitStop = Math.ceil(Math.random() * (this.bot.rules.BLACKJACK_HIT_MAX_STOP - this.bot.rules.BLACKJACK_HIT_MIN_STOP) + this.bot.rules.BLACKJACK_HIT_MIN_STOP)
    while (dealerHandValue < hitStop) {
      this.dealerHand.push(this.deck.pop())
      dealerHandValue = this.calculateHand(this.dealerHand)
    }

    if (dealerHandValue > 21) this.endCallback(true, 'Dealer\'s bust. Player wins!')
    else if (dealerHandValue === 21 && dealerHandValue !== playerHandValue) this.endCallback(false, 'Dealer\'s blackjack. Player lose!')
    else if (dealerHandValue > playerHandValue) this.endCallback(false, 'Dealer is near to 21. Player lose!')
    else if (dealerHandValue === playerHandValue) this.endCallback(false, 'Tie. No one wins!', true)
    else this.endCallback(true, 'Player is most near to 21. Player wins!')
  }
}

const cards = {
  'AC': { value: 11, emoji: '<:AC:1087156336439070830>' },
  'AD': { value: 11, emoji: '<:AD:1087156338515255306>' },
  'AH': { value: 11, emoji: '<:AH:1087156339861635102>' },
  'AS': { value: 11, emoji: '<:AS:1087156341262524556>' },

  '2C': { value: 2, emoji: '<:2C:1087153796255326218>' },
  '2D': { value: 2, emoji: '<:2D:1087153798457335849>' },
  '2H': { value: 2, emoji: '<:2H:1087153800437039134>' },
  '2S': { value: 2, emoji: '<:2S:1087153802785849405>' },

  '3C': { value: 3, emoji: '<:3C:1087153804119646218>' },
  '3D': { value: 3, emoji: '<:3D:1087153805281460265>' },
  '3H': { value: 3, emoji: '<:3H:1087153807303127040>' },
  '3S': { value: 3, emoji: '<:3S:1087153808888565830>' },

  '4C': { value: 4, emoji: '<:4C:1087154093547593739>' },
  '4D': { value: 4, emoji: '<:4D:1087154095778967643>' },
  '4H': { value: 4, emoji: '<:4H:1087154097557352569>' },
  '4S': { value: 4, emoji: '<:4S:1087154098463309925>' },

  '5C': { value: 5, emoji: '<:5C:1087154101130903603>' },
  '5D': { value: 5, emoji: '<:5D:1087154102590517429>' },
  '5H': { value: 5, emoji: '<:5H:1087154103785889874>' },
  '5S': { value: 5, emoji: '<:5S:1087154106034028605>' },

  '6C': { value: 6, emoji: '<:6C:1087155828731170936>' },
  '6D': { value: 6, emoji: '<:6D:1087155830874460181>' },
  '6H': { value: 6, emoji: '<:6H:1087155832778666035>' },
  '6S': { value: 6, emoji: '<:6S:1087155834716430508>' },

  '7C': { value: 7, emoji: '<:7C:1087155836373172265>' },
  '7D': { value: 7, emoji: '<:7D:1087155837719543828>' },
  '7H': { value: 7, emoji: '<:7H:1087155839908978758>' },
  '7S': { value: 7, emoji: '<:7S:1087155841158877314>' },

  '8C': { value: 8, emoji: '<:8C:1087156183518937209>' },
  '8D': { value: 8, emoji: '<:8D:1087156186085863554>' },
  '8H': { value: 8, emoji: '<:8H:1087156187314798722>' },
  '8S': { value: 8, emoji: '<:8S:1087156188975738951>' },

  '9C': { value: 9, emoji: '<:9C:1087156229270421556>' },
  '9D': { value: 9, emoji: '<:9D:1087156231933808650>' },
  '9H': { value: 9, emoji: '<:9H:1087156233431175248>' },
  '9S': { value: 9, emoji: '<:9S:1087156235087904888>' },

  '10C': { value: 10, emoji: '<:10C:1087156286795292802>' },
  '10D': { value: 10, emoji: '<:10D:1087156289022459944>' },
  '10H': { value: 10, emoji: '<:10H:1087156290431758376>' },
  '10S': { value: 10, emoji: '<:10S:1087156291530674207>' },

  'JC': { value: 10, emoji: '<:JC:1087156392009400391>' },
  'JD': { value: 10, emoji: '<:JD:1087156393410297856>' },
  'JH': { value: 10, emoji: '<:JH:1087156394777645086>' },
  'JS': { value: 10, emoji: '<:JS:1087156396853837944>' },

  'QC': { value: 10, emoji: '<:QC:1087156406123237476>' },
  'QD': { value: 10, emoji: '<:QD:1087156407641575484>' },
  'QH': { value: 10, emoji: '<:QH:1087156410246238348>' },
  'QS': { value: 10, emoji: '<:QS:1087156513111543899>' },

  'KC': { value: 10, emoji: '<:KC:1087156398208589845>' },
  'KD': { value: 10, emoji: '<:KD:1087156399454306406>' },
  'KH': { value: 10, emoji: '<:KH:1087156402662936726>' },
  'KS': { value: 10, emoji: '<:KS:1087156404755910717>' }
}

module.exports = {
  name: 'blackjack',
  aliases: ['black-jack', 'b-j', 'bj'],

  run: async (bot, message, args) => {
    const coins = await getCoins(message.author.id)
    if (!coins) return message.channel.send('You dont have money')

    let wager = args[0]
    if (!wager) return message.reply('Provide a amount of coins to bet')
    if (wager === 'all') wager = coins
    else if (wager === 'half') wager = coins / 2
    if (isNaN(Number(wager))) return message.reply('Invalid number')
    if (wager <= 0) return message.reply('Provide a amount of coins to bet')
    if (wager > coins) return message.reply('You dont have money enough')
    wager = Math.floor(wager) > 0 ? Math.floor(wager) : Math.ceil(wager)

    // ---

    bot.blackjackers.push(message.author.id)
    
    const canDoubleDown = wager <= coins / 2
    async function onEnd(playerWin, finalMessage, tie = false) {
      bot.blackjackers = bot.blackjackers.filter(id => id !== message.author.id)
      if (tie) return message.reply(finalMessage)

      if (playerWin) await updateCoins(message.author.id, coins + wager)
      else await updateCoins(message.author.id, coins - wager)

      message.reply(`${finalMessage} **${playerWin ? '+' : '-'}${wager}${bot._Ecoin}**`)
    }

    const blackjack = new Blackjack(bot, onEnd, canDoubleDown)

    function generateEmbed() {
      let dealerHandInfo = `${cards[blackjack.dealerHand[0]].emoji}<:cback:1087156389199228948> \nValue: **${cards[blackjack.dealerHand[0]].value}** \n\n`
      if (blackjack.dealerHandReveal)
        dealerHandInfo = `${blackjack.dealerHand.map(card => cards[card.replace(' ', '')].emoji).join('')} \nValue: **${blackjack.calculateHand(blackjack.dealerHand)}** \n\n`

      return {
        title: 'Blackjack',
        fields: [
          { name: 'Your hand', value: `${blackjack.playerHand.map(card => cards[card.replace(' ', '')].emoji).join('')} \nValue: **${blackjack.calculateHand(blackjack.playerHand)}** \n\n` },
          { name: 'Dealer\'s hand', value: dealerHandInfo }
        ],
        footer: { text: `1: Hit \n2: Stand \n${canDoubleDown ? '3: Double-Down' : ''}` }
      }
    }

    const messageEmbed = await message.channel.send({ embeds: [generateEmbed()] })

    await messageEmbed.react('1️⃣')
    await messageEmbed.react('2️⃣')
    if (canDoubleDown) await messageEmbed.react('3️⃣')

    const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name) && user.id === message.author.id
    const collector = messageEmbed.createReactionCollector({ filter, time: 60e3 })

    collector.on('collect', async (reaction, user) => {
      await reaction.users.remove(user.id)

      if (reaction.emoji.name === '1️⃣') blackjack.playerTurn('hit')
      else if (reaction.emoji.name === '2️⃣') blackjack.playerTurn('stand')
      else if (reaction.emoji.name === '3️⃣' && canDoubleDown) {
        wager *= 2
        blackjack.playerTurn('double-down')
      }

      await messageEmbed.edit({ embeds: [generateEmbed()] })
    })

    collector.on('end', () => {
      messageEmbed.reactions.removeAll()
      if (!blackjack.end) blackjack.endCallback(false, 'You lose because of timeout')
    })
  }
}

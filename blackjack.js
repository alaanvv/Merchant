const readline = require('readline')

class Blackjack {
  constructor() {
    this.deck = []
    this.playerHand = []
    this.dealerHand = []

    this.createDeck()
    this.shuffleDeck()
    this.dealCards()
  }

  createDeck() {
    const suits = ['coração', 'diamante', 'paus', 'espada']
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Valete', 'Rainha', 'Rei']

    for (let suit of suits)
      for (let rank of ranks) this.deck.push(`${rank} de ${suit}`)
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
      let rank = card.split(' ')[0]
      if (rank === 'A') {
        aces++
        handValue += 11
      } else if (['Valete', 'Rainha', 'Rei'].includes(rank)) {
        handValue += 10
      } else {
        handValue += Number(rank)
      }
    }

    while (aces > 0 && handValue > 21) {
      handValue -= 10
      aces--
    }

    return handValue
  }

  async playerTurn() {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout})
    
    while (true) {
      console.log(`Your hand: ${this.playerHand.join(', ')} | Total: ${this.calculateHand(this.playerHand)}`)
      console.log(`Dealer's hand: ${this.dealerHand[0]}`)

      let handValue = this.calculateHand(this.playerHand)
      if (handValue === 21) {
        this.gameEnd = true
        console.log('Blackjack! You win!')
        return rl.close()
      } else if (handValue > 21) {
        this.gameEnd = true
        console.log('Bust! You lose.')
        return rl.close()
      }

      let hitOrStand = await new Promise(resolve => rl.question('Do you want to hit or stand?', resolve))

      if (hitOrStand.toLowerCase() === 'hit') {
        this.playerHand.push(this.deck.pop())
      } else if (hitOrStand.toLowerCase() === 'stand') {
        rl.close()
        return
      }
    }
  }

  dealerTurn() {
    let handValue = this.calculateHand(this.dealerHand)
    while (handValue < 17) {
      this.dealerHand.push(this.dealCards())
      handValue = this.calculateHand(this.dealerHand)
    }
    console.log(`Dealer's hand: ${this.dealerHand.join(', ')}`)
    if (handValue > 21) {
      this.gameEnd = true
      console.log('Dealer busts! You win!')
    } else if (handValue === 21) {
      this.gameEnd = true
      console.log('Dealer has blackjack! You lose.')
    } else {
      console.log(`Dealer has ${handValue}.`)
    }
  }
  async playGame() {
    while (!this.gameEnd) {
      await this.playerTurn()
      if (!this.gameEnd) this.dealerTurn()
    }
  }
}

new Blackjack().playGame()
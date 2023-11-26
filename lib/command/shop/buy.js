const { getCoins, updateCoins, addItem, countItem, getItemByQuery } = require('../../util')

module.exports = {
  name: 'buy',
  aliases: ['b'],

  run: async function (bot, message, args) {
    let amount = 1
    if (Number(args[0]) && args.length > 1) amount = Number(args.shift())

    if (!args[0]) message.reply('Provide a item name')
    const item = getItemByQuery(args[0])
    if (!item) return message.reply('Invalid item name')

    if (item.maxStack) {
      const itemOccur = await countItem(message.author.id, item.id)
      if (itemOccur >= item.maxStack) return message.reply('You cant buy more of this item')
      if (itemOccur + amount > item.maxStack) return message.reply('You cant buy this amount of this item')
    }

    const coins = await getCoins(message.author.id)
    if (coins < item.price * amount) return message.channel.send('You dont have money enough')

    await updateCoins(message.author.id, coins - item.price * amount)
    addItem(message.author.id, item.id, amount)

    if (item.onBuy) item.onBuy(bot, message, [amount, ...args])

    message.reply(`You bought ${amount > 1 ? amount : ''} **${item.name}**`)
  }
}
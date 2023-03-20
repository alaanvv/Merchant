const { getCoins, updateCoins, addItem, getInventory, items } = require('../../util')

module.exports = {
  name: 'buy',
  aliases: ['b'],

  run: async function (bot, message, args) {
    const itemsArr = Object.values(items)

    let amount = 1
    if (Number(args[0]) && args.length > 1) amount = Number(args.shift())

    const query = args.join('').toLowerCase().replaceAll(' ', '')
    if (!query) message.reply('Provide a item name')
    const item = itemsArr.filter(i => i.name.toLowerCase().replaceAll(' ', '') === query)[0]
    if (!item) return message.reply('Invalid item name')

    if (item.maxStack) {
      const inventory = await getInventory(message.author.id)
      const itemOccur = inventory.reduce((count, invItemId) => { if (invItemId === item.id) count += 1; return count }, 0)
      if (itemOccur >= item.maxStack) return message.reply('You cant buy more of this item')
      if (itemOccur + amount > item.maxStack) return message.reply('You cant buy this amount of this item')
    }

    const coins = await getCoins(message.author.id)
    if (coins < item.price * amount) return message.channel.send('You dont have money enough')
    
    await updateCoins(message.author.id, coins - item.price * amount)
    addItem(message.author.id, item.id, amount)

    message.reply(`You bought ${amount > 1 ? amount : ''} **${item.name}**`)
  }
}
const { items, removeItem } = require('../../util')

module.exports = {
  name: 'destroy',
  aliases: ['remove'],

  run: async function (bot, message, args) {
    const itemsArr = Object.values(items)

    let amount = 1
    if (Number(args[0]) || args.length > 1) amount = Number(args.shift())


    const query = args[0].toLowerCase().replace(' ', '')
    if (!query) message.reply('Provide a item name')

    const item = itemsArr.filter(i => i.name.toLowerCase().replace(' ', '') === query)[0]
    if (!item) return message.reply('Invalid item name')

    message.reply(item.destroyMessage || `You destroyed ${amount > 1 ? amount : ''} ${item.name}`)

    removeItem(message.author.id, item.id, amount)
  }
}
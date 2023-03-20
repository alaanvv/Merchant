const { items, removeItem } = require('../../util')

module.exports = {
  name: 'use',
  aliases: ['u'],

  run: async function (bot, message, args) {
    const itemsArr = Object.values(items)

    const query = args[0].toLowerCase().replace(' ', '')
    if (!query) message.reply('Provide a item name')

    const item = itemsArr.filter(i => i.name.toLowerCase().replace(' ', '') === query)[0]
    if (!item) return message.reply('Invalid item name')

    if (!item.usable) return message.reply('You cant use this item')
    message.reply(item.useMessage || `You used ${item.name}`)

    if (item.useFunction) item.useFunction(bot, message)

    removeItem(message.author.id, item.id)
  }
}
const { removeItem, getItemByQuery } = require('../../util')

module.exports = {
  name: 'destroy',
  aliases: ['remove'],

  run: async function (bot, message, args) {
    let amount = 1
    if (Number(args[0]) && args.length > 1) amount = Number(args.shift())

    if (!args[0]) message.reply('Provide a item name')
    const item = getItemByQuery(args[0])
    if (!item) return message.reply('Invalid item name')

    removeItem(message.author.id, item.id, amount)
    if (item.onDestroy) item.onDestroy(bot, message, [amount, ...args])

    message.reply(item.destroyMessage || `You destroyed ${amount > 1 ? amount : ''} ${item.name}`)
  }
}
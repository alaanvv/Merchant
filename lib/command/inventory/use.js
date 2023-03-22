const { removeItem, countItem, getItemByQuery } = require('../../util')

module.exports = {
  name: 'use',
  aliases: ['u'],

  run: async function (bot, message, args) {
    if (!args[0]) message.reply('Provide a item name')
    const item = getItemByQuery(args[0])
    if (!item) return message.reply('Invalid item name')
    if (!countItem(message.author.id, item.id)) return message.reply('You dont have this item')
    if (!item.usable) return message.reply('You cant use this item')
    
    if (item.onUse) item.onUse(bot, message, args)
    
    removeItem(message.author.id, item.id)
    if (item.useMessage !== '') message.reply(item.useMessage || `You used ${item.name}`)
  }
}
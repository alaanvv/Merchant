const { getInventory, getItemById, removeItem, page } = require('../../util')

module.exports = {
  name: 'inventory',
  aliases: ['inv'],

  run: async function (bot, message, args) {
    let itemsData = await getInventory(message.author.id)
    
    itemsData = itemsData.map(data => {
      const item = getItemById(data)
      if (!item) { removeItem(message.author.id, data); return }
      return item
    })
    itemsData = itemsData.filter(item => item !== undefined)
    
    itemsData = Object.values(itemsData.reduce((ac, item) => {
      if (!ac[item.name]) ac[item.name] = {...item, quantity: 1 }
      else ac[item.name].quantity += 1

      return ac
    }, {}))

    const generateEmbed = data => {
      return {
        title: `${message.author.username}'s Inventory`,
        description: data.length ? data.map(item => `**${item.name}** ${item.quantity > 1 ? `_x${item.quantity}_` : ''} \n${item.description}`).join('\n\n') : 'Empty'
      }
    }
    page(message, itemsData, generateEmbed)
  }
}
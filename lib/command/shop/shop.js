const { items, page } = require('../../util')

module.exports = {
  name: 'shop',
  aliases: ['s'],

  run: async (bot, message, args) => {
    const itemsData = Object.values(items)

    const generateEmbed = data => {
      return {
        title: `${message.guild.name} Shop`,
        description: data.map(data => `**${data.name}** \n${data.description} \n**${data.price}${bot._Ecoin}**`).join('\n\n')
      }
    }
    page(message, itemsData, generateEmbed)
  }
}

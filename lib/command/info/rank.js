const { conn } = require('../../db/conn')
const { page } = require('../../util')

module.exports = {
  name: 'rank',
  aliases: ['leaderboard', 'lb'],

  run: async (bot, message, args) => {
    const res = await conn.cmd('select * from wallet order by coins desc')

    const generateEmbed = data => {
      return {
        title: `${message.guild.name} Ranking`,
        description: data.map(data => `<@${data.userid}> - **${data.coins}${bot._Ecoin}**`).join('\n'),
      }
    }
    page(message, res, generateEmbed)
  }
}

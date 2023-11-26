const { conn } = require('../../db/conn')

module.exports = {
  name: 'prefix',
  requirements: ['admin'],

  run: async (bot, message, args) => {
    const newPrefix = args[0]
    if (!newPrefix) message.reply('Provide a prefix')
    const guildId = message.channel.guildId 

    const oldPrefix = await conn.cmd(`select * from prefix where guildid = ${guildId}`)
    if (oldPrefix.length) await conn.cmd(`update prefix set prefix = '${newPrefix}' where guildid = ${guildId}`)
    else await conn.cmd(`insert into prefix values (${guildId}, '${newPrefix}')`)

    message.reply(`Prefix set to **${newPrefix}**`)
  }
}
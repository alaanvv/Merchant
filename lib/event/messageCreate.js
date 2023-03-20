const { conn } = require('../db/conn')

module.exports = bot => {
  bot.on('messageCreate', async message => {
    const prefixDB = await conn.cmd(`select prefix from prefix where guildid = ${message.channel.guildId}`)
    const prefix = prefixDB[0].prefix || bot.defaultPrefix

    if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).trim().split(' ')
    const cmdName = args.shift().toLowerCase()

    const cmd = bot.commands.get(cmdName) || bot.commands.get(bot.aliases.get(cmdName))

    // Validate
    if (!cmd) return message.reply('Unknown command') 
    if (cmd.requirements) {
      if (cmd.requirements.includes('admin') && !message.member.permissions.has('ADMINISTRATOR'))
        return message.reply('You dont have permissions')
    }

    cmd.run(bot, message, args)
  })
}
const { Collection } = require('discord.js')
const { get } = require('./db/conn')
const { readdirSync } = require('fs')
const rules = require('./rules')
require('dotenv').config()
require('./error')

module.exports = bot => {
  // Events
  readdirSync(`${process.cwd()}/lib/event`).forEach( file => require(`${process.cwd()}/lib/event/${file}`)(bot) )

  // Bot Variables
  bot.token = process.env.TOKEN
  bot.defaultPrefix = process.env.PREFIX

  bot.cooldown = new Map()
  bot.commands = new Collection()
  bot.aliases = new Collection()
  bot.cocks = {}
  bot.blackjackers = []
  bot.rpsPlayers = []
  // I will use _E as prefix for all emojis cuz its fast to type
  bot._Ecoin = '<:coin:1086646605266030612>'

  // Command System
  readdirSync(`${process.cwd()}/lib/command`).forEach(category => {
    readdirSync(`${process.cwd()}/lib/command/${category}`).forEach(file => {
      const command = require(`${process.cwd()}/lib/command/${category}/${file}`)
      bot.commands.set(command.name, command)
      if (command.aliases) command.aliases.forEach(alias => bot.aliases.set(alias, command.name))
    })
  })

  // Set rules
  rules(bot)

  // Events
  bot.on('ready', () => console.log('Bot running as ' + bot.user.tag))
  bot.on('messageCreate', async message => {
    if (!message.guild || message.author.bot) return

    const prefixDB = await get('prefix', `guildid = ${message.channel.guildId}`)
    const prefix = prefixDB[0].prefix || bot.defaultPrefix
    if (!message.content.startsWith(prefix)) return

    if (bot.blackjackers.includes(message.author.id)) return message.reply('You can\'t use commands while playing blackjack')
    if (bot.rpsPlayers.includes(message.author.id)) return message.reply('You can\'t use commands while playing or being challenged to a rps match')

    const args = message.content.slice(prefix.length).trim().split(' ')
    const cmdName = args.shift().toLowerCase()

    const cmd = bot.commands.get(cmdName) || bot.commands.get(bot.aliases.get(cmdName))

    // Validate
    if (!cmd) return message.reply('Unknown command') 
    if (cmd.requirements)
      if (cmd.requirements.includes('admin') && !message.member.permissions.has('ADMINISTRATOR')) 
        return message.reply('You dont have permissions')

    cmd.run(bot, message, args)
  })
}
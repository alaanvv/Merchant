const { Collection } = require('discord.js')
const { readdirSync } = require('fs')
require('dotenv').config()

// Error Handling
require('./error')

module.exports = bot => {
  // Events
  readdirSync(`${process.cwd()}/lib/event`).forEach(file => require(`${process.cwd()}/lib/event/${file}`)(bot) )

  // Bot Variables
  bot.token = process.env.TOKEN
  bot.defaultPrefix = process.env.PREFIX // Default prefix

  bot.commands = new Collection()
  bot.aliases = new Collection()

  // Command System
  readdirSync(`${process.cwd()}/lib/command`).forEach(file => {
    const command = require(`${process.cwd()}/lib/command/${file}`)
    bot.commands.set(command.name, command)
    if (command.aliases) command.aliases.forEach(alias => bot.aliases.set(alias, command.name))
  })
}
const { Collection } = require('discord.js')
const { readdirSync } = require('fs')
require('dotenv').config()

module.exports = bot => {
  // Errors
  require('./error')

  // Events
  readdirSync(`${process.cwd()}/lib/event`).forEach(file => {
    const event = require(`${process.cwd()}/lib/event/${file}`)
    bot.on(file, event)
  })

  // Bot Variables
  bot.token = process.env.TOKEN
  bot.prefix = process.env.PREFIX // Default prefix

  bot.commands = new Collection()
  bot.aliases = new Collection()

  // Command System
  readdirSync(`${process.cwd()}/lib/command`).forEach(file => {
    const command = require(`${process.cwd()}/lib/command${file}`)
    bot.commands.set(command.name, command)
    if (command.aliases) command.aliases.forEach(alias => bot.aliases.set(alias, command.name))
  })
}
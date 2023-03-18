const { Collection } = require('discord.js')
const { readdirSync } = require('fs')
const rules = require('./rules')
require('dotenv').config()

// Error Handling
require('./error')

module.exports = bot => {
  // Events
  readdirSync(`${process.cwd()}/lib/event`).forEach( file => require(`${process.cwd()}/lib/event/${file}`)(bot) )

  // Bot Variables
  bot.token = process.env.TOKEN
  bot.defaultPrefix = process.env.PREFIX

  bot.commands = new Collection()
  bot.aliases = new Collection()

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

  // Emojis
  // I will use _E as prefix for all emojis cuz its fast to type
  bot._Ecoin = '<:coin:1086646605266030612>'

  // Cooldown
  bot.cooldown = new Map()
}
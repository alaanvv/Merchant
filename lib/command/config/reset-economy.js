const { conn } = require('../../db/conn')

module.exports = {
  name: 'reset-economy',
  aliases: ['reseteconomy'],
  requirements: ['admin'],

  run: async function (bot, message, args) {
    conn.cmd('update wallet set coins = 0')
    conn.cmd('update bank set coins = 0')

    message.reply(`Economy reseted`)
  }
}
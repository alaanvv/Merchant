module.exports = bot => {
  bot.on('ready', () => {
    console.log('Bot running as ' + bot.user.tag)
  })
}
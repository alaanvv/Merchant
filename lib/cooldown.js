// Cooldowns will be stored like this:
// { '579377392 work': 19329499 } '579377392 work' <- Cooldown ID
//    ^ID   Command^   ^Date

/** 
 * Check if a command is on cooldown  
 * If it is, return false, if else, return  
 * true and set a cooldown for it.  
 * */
function check(bot, message, cmd) {
  if (!cmd.cooldown) return true

  const cooldownId = `${message.author.id} ${cmd.name}`

  if (bot.cooldown.has(cooldownId)) {
    const lastUsed = bot.cooldown.get(cooldownId)
    const remaining = lastUsed + cmd.cooldown - Date.now()
    
    if (remaining > 0) {
      message.reply(cmd.cooldownMessage || 'This command is on cooldown')
      return
    }
  }

  bot.cooldown.set(cooldownId, Date.now())
  return true
}

module.exports = check
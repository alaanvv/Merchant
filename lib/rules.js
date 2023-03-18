require('dotenv').config()

module.exports = bot => {
  bot.rules = {}

  bot.rules.WORK_MIN_AMOUNT = Number(process.env.WORK_MIN_AMOUNT)
  bot.rules.WORK_MAX_AMOUNT = Number(process.env.WORK_MAX_AMOUNT)
  
  bot.rules.CRIME_MAX_AMOUNT = Number(process.env.CRIME_MAX_AMOUNT)
  bot.rules.CRIME_MIN_AMOUNT = Number(process.env.CRIME_MIN_AMOUNT)
  bot.rules.CRIME_FAIL_RATE = Number(process.env.CRIME_FAIL_RATE)
  bot.rules.CRIME_LOOSE_RATE = Number(process.env.CRIME_LOOSE_RATE)
}
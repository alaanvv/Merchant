require('dotenv').config()

module.exports = bot => {
  bot.rules = {}

  bot.rules.WORK_MIN_AMOUNT = Number(process.env.WORK_MIN_AMOUNT)
  bot.rules.WORK_MAX_AMOUNT = Number(process.env.WORK_MAX_AMOUNT)
  
  bot.rules.CRIME_MAX_AMOUNT = Number(process.env.CRIME_MAX_AMOUNT)
  bot.rules.CRIME_MIN_AMOUNT = Number(process.env.CRIME_MIN_AMOUNT)
  bot.rules.CRIME_FAIL_RATE = Number(process.env.CRIME_FAIL_RATE)
  bot.rules.CRIME_LOOSE_RATE = Number(process.env.CRIME_LOOSE_RATE)
  
  bot.rules.ROB_FAIL_RATE = Number(process.env.ROB_FAIL_RATE)
  bot.rules.ROB_LOOSE_RATE = Number(process.env.ROB_LOOSE_RATE)

  bot.rules.USE_DEPOSIT_TAX = Number(process.env.USE_DEPOSIT_TAX)
  bot.rules.DEPOSIT_TAX_MIN = Number(process.env.DEPOSIT_TAX_MIN)
  bot.rules.DEPOSIT_TAX = Number(process.env.DEPOSIT_TAX)

  bot.rules.COINFLIP_WIN_RATE = Number(process.env.COINFLIP_WIN_RATE)
  
  bot.rules.COCKFIGHT_START_WIN_RATE = Number(process.env.COCKFIGHT_START_WIN_RATE)
  bot.rules.COCKFIGHT_END_WIN_RATE = Number(process.env.COCKFIGHT_END_WIN_RATE)
  bot.rules.COCKFIGHT_INCREASE = Number(process.env.COCKFIGHT_INCREASE)

  bot.rules.BLACKJACK_HIT_MIN_STOP = Number(process.env.BLACKJACK_HIT_MIN_STOP)
  bot.rules.BLACKJACK_HIT_MAX_STOP = Number(process.env.BLACKJACK_HIT_MAX_STOP)

  bot.rules.FARM_GROW_SECONDS = Number(process.env.FARM_GROW_SECONDS)
}
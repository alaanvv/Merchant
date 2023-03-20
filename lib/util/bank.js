const { get, set, update } = require('../db/conn')

async function getBankCoins(userId) {
  let coins = 0

  let bank = await get('bank', `userid = ${userId}`)

  if (bank) coins = bank.coins
  else await set('bank', `${userId}, 0`)

  return coins
}

async function updateCoins(userId, value) {
  await update('wallet', 'coins', value, `userid = ${userId}`)
}

module.exports = { getBankCoins, updateCoins }
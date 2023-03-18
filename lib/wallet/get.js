const { get } = require('../../db/conn')

async function getCoins(userId) {
  let coins = 0

  let wallet = await get('wallet', `userid = ${userId}`)

  if (wallet) coins = wallet.coins
  else await set('wallet', `${userId}, 0`)

  return coins
}

module.exports = { getCoins }
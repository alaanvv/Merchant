const { get, set } = require('../../db/conn')

async function getCoins(userId, from = 'wallet') {
  if (from !== 'wallet') from = 'bank'

  let coins = 0

  let data = await get(from, `userid = ${userId}`)

  if (data) coins = data.coins
  else await set(from, `${userId}, 0`)

  return coins
}

module.exports = { getCoins }
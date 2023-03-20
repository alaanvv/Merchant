const { get, set, update } = require('../db/conn')

async function getCoins(userId, from = 'wallet') {
  if (from !== 'wallet') from = 'bank'

  let coins = 0

  let data = await get(from, `userid = ${userId}`)

  if (data) coins = data.coins
  else await set(from, `${userId}, 0`)

  return coins
}

async function updateCoins(userId, value, from = 'wallet') {
  await getCoins(userId)
  
  if (from !== 'wallet') from = 'bank'
  await update(from, 'coins', value, `userid = ${userId}`)
}

async function payFine(userId, percentage) {
  const coins = await getCoins(userId)
  const bankCoins = await getCoins(userId, 'bank')
  const total = coins + bankCoins
  let fine = Math.floor(total * percentage)

  if (total <= coins) await updateCoins(userId, coins - fine)
  else {
    await updateCoins(userId, 0)
    await updateCoins(userId, bankCoins - fine + coins, 'bank')
  }

  return fine
}

module.exports = { getCoins, updateCoins, payFine }
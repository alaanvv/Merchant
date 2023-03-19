const { getCoins } = require('./get')
const { updateCoins } = require('./update')

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

module.exports = { payFine }
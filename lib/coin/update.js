const { update } = require('../../db/conn')

async function updateCoins(userId, value, from = 'wallet') {
  if (from !== 'wallet') from = 'bank'
  await update(from, 'coins', value, `userid = ${userId}`)
}

module.exports = { updateCoins }
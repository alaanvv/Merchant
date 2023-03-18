const { get } = require('./get')
const { update } = require('../../db/conn')

async function updateCoins(userId, value) {
  await update('wallet', 'coins', value, `userid = ${userId}`)
}

module.exports = { updateCoins }
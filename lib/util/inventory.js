const { get, set, update } = require('../db/conn')

async function getInventory(userId) {
  let inventory = []

  let data = await get('inventory', `userid = ${userId}`)

  if (data) inventory = JSON.parse(data.itemarray)
  else await set('inventory', `${userId}, '[]'`)

  return inventory
}

async function countItem(userId, itemId) {
  let count = 0

  const inventory = await getInventory(userId)
  inventory.forEach(invItemId => { if (invItemId === itemId) count++ })
  
  return count
}

async function updateInventory(userId, value) {
  await getInventory(userId)

  if (typeof value !== 'string') value = JSON.stringify(value)
  await update('inventory', 'itemarray', value, `userid = ${userId}`)
}

async function addItem(userId, itemId, amount = 1) {
  const inventory = await getInventory(userId)
  for (let i = 0; i < amount; i++) inventory.push(itemId)

  updateInventory(userId, inventory)
}

async function removeItem(userId, itemId, amount = 1) {
  const inventory = await getInventory(userId)
  for (let i = 0; i < amount; i++) 
    if (inventory.includes(itemId)) inventory.splice(inventory.indexOf(itemId), 1)

  updateInventory(userId, inventory)
}

module.exports = { getInventory, updateInventory, addItem, removeItem, countItem }
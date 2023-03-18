const { conn } = require('./conn')

async function getAll(table, where) {
  const res = await conn.cmd(`select * from ${table} where ${where}`)
  return res
}
async function get(table, where) { 
  const res = await getAll(table, where)
  return res[0]
}

async function set(table, values) {
  await conn.cmd(`insert into ${table} values (${values})`)
}
async function update(table, column, value, where) {
  if (typeof value === String) value = `'${value}'`
  await conn.cmd(`update ${table} set ${column} = ${value} where ${where}`)
}

async function getUserInfo(userId) {
  let wallet = await get('wallet', `userid = ${userId}`)
  if (!wallet) {
    await set('wallet', `${userId}, 0`)
    wallet = { userid: userId, coins: 0 }
  }
  
  let inventory = await get('inventory', `userid = ${userId}`)
  if (!inventory) {
    await set('inventory', `${userId}, '[]'`)
    inventory = { userid: userId, itemarray: '[]' }
  }

  return { coins: wallet.coins, inventory: JSON.parse(inventory.itemarray) }
}

module.exports = { get, getAll, set, getUserInfo, update }
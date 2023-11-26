const mysql = require('mysql')
require('dotenv').config()

const conn = mysql.createConnection({ host: 'localhost', user: 'root', port: process.env.DATABASE_PORT, password: process.env.DATABASE_PASSWORD })
conn.connect(err => { if (err) throw err })
conn.query(`use ${process.env.DATABASE_NAME}`, (err, result) => { if (err) throw err })

// Utils
conn.cmd = async query => {
  return new Promise(resolve => {
    conn.query(query, (err, result) => {
      if (err) throw err
      resolve(result)
    })
  })
}

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
  if (typeof value === 'string') value = `'${value}'`
  await conn.cmd(`update ${table} set ${column} = ${value} where ${where}`)
}

module.exports = { conn, get, getAll, set, update }
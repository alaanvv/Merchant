const mysql = require('mysql')
require('dotenv').config()

const conn = mysql.createConnection({ host: 'localhost', user: 'root', port: 666, password: process.env.DATABASEPASSWORD })
conn.connect(function (err) { if (err) throw err })

conn.query('use merchant', (err, result) => { if (err) throw err })
conn.cmd = async query => {
  return new Promise(resolve => {
    conn.query(query, (err, result) => {
      if (err) throw err
      resolve(result)
    })
  })
}

module.exports = conn
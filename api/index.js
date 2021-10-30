const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.status(200).json({ message: 'It\'s work!' })
})

module.exports = {
  path: '/api',
  handler: app
}

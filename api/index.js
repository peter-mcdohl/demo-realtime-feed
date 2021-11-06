const express = require('express')
const app = express()
app.use(express.json())

const redis = require('redis')
const subscriber = redis.createClient()
const publisher = redis.createClient()

const feedList = []
const channelName = 'demo_feed'

subscriber.on('message', (channel, message) => {
  console.log('Received data from ' + channel + ': ' + message)
  feedList.push(JSON.parse(message))
})

subscriber.on('error', (message) => {
  console.log('SUBSCRIBER ERR:' + message)
})

subscriber.on('close', () => {
  subscriber.end()
})

subscriber.subscribe(channelName)

publisher.on('error', (message) => {
  console.log('PUBLISHER ERR:' + message)
})

publisher.on('close', () => {
  publisher.end()
})

app.get('/', (req, res) => {
  res.status(200).json({ message: 'It\'s work!' })
})

app.post('/feed', (req, res) => {
  publisher.publish(channelName, JSON.stringify(req.body))
  res.status(200).json({ message: 'OK' })
})

module.exports = {
  path: '/api',
  handler: app
}

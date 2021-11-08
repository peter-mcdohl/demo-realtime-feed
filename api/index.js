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
  const data = req.body
  data.createdAt = Date.now()
  publisher.publish(channelName, JSON.stringify(data))
  res.status(200).json({ message: 'OK' })
})

app.delete('/feed', (req, res) => {
  feedList.splice(0, feedList.length)
  res.status(200).json({ message: 'OK' })
})

const pageSize = 5

app.get('/feed/short/:lastIndex', (req, res) => {
  let lastIndex = parseFloat(req.params.lastIndex)
  if (isNaN(lastIndex)) {
    lastIndex = -1
  }

  let result = []
  if (lastIndex < 0) {
    // if there is no last index then get the last 5 (page size) items
    result = feedList.slice(-pageSize, feedList.length)
    lastIndex = feedList.length - 1
  } else {
    // get next 5 items (page size)
    result = feedList.slice(lastIndex + 1, lastIndex + pageSize)
    if (lastIndex + pageSize < feedList.length) {
      lastIndex += pageSize
    } else {
      lastIndex = feedList.length - 1
    }
  }

  res.status(200).json({
    data: result,
    last_index: lastIndex
  })
})

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const longPolling = async (req, res) => {
  let isClosed = false
  req.on('close', () => {
    isClosed = true
  })

  let lastIndex = parseFloat(req.params.lastIndex)
  if (isNaN(lastIndex)) {
    lastIndex = -1
  }

  let result = []
  let startIndex = -pageSize
  let count = 0
  while (result.length === 0) {
    if (isClosed) {
      break
    }
    console.log('Attempt:', count)
    if (count > 0) {
      await sleep(1000)
    }
    if (lastIndex >= 0) {
      startIndex = lastIndex + 1
    }
    result = feedList.slice(startIndex, feedList.length)
    count++
  }

  lastIndex = feedList.length - 1

  res.status(200).json({
    data: result,
    last_index: lastIndex
  })
}

app.get('/feed/long/:lastIndex', longPolling)

module.exports = {
  path: '/api',
  handler: app
}

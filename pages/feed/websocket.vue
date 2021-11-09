<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h1>Feed with WebSocket</h1>

      <FeedList :feeds="feeds" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      connection: null,
      feeds: []
    }
  },
  mounted () {
    this.$axios.$get('/api/feed/short/-1')
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          this.feeds.unshift(res.data[i])
        }

        this.connection = new WebSocket('ws://localhost:3001')

        this.connection.onmessage = (event) => {
          if (event && event.data) {
            const msg = JSON.parse(event.data)
            this.feeds.unshift(msg)
          }
        }

        this.connection.onerror = (event) => {
          console.log(event)
        }
      })
      .catch((err) => {
        if (err.message && err.message.includes('timeout')) {
          this.fetchFeeds()
        } else {
          console.log(err)
        }
      })
  },
  beforeDestroy () {
    this.connection.close()
  }
}
</script>

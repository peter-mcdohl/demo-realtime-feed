<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h1>Feed with SSE</h1>

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

        this.connection = new EventSource('/api/feed/sse')

        this.connection.onmessage = (message) => {
          if (message && message.data) {
            const msg = JSON.parse(message.data)
            this.feeds.unshift(msg)
          }
        }

        this.connection.onerror = (err) => {
          console.log(err)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
  beforeDestroy () {
    this.connection.close()
  }
}
</script>

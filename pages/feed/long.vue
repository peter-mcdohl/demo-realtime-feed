<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h1>Feed with Long Polling</h1>

      <FeedList :feeds="feeds" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      feeds: [],
      lastIndex: -1,
      theRequest: this.$axios.CancelToken.source()
    }
  },
  mounted () {
    this.fetchFeeds()
  },
  beforeDestroy () {
    this.theRequest.cancel()
  },
  methods: {
    fetchFeeds () {
      this.$axios.$get('/api/feed/long/' + this.lastIndex, {
        timeout: 10000,
        cancelToken: this.theRequest.token
      })
        .then((res) => {
          this.lastIndex = res.last_index
          for (let i = 0; i < res.data.length; i++) {
            this.feeds.unshift(res.data[i])
          }
          setTimeout(this.fetchFeeds, 500)
        })
        .catch((err) => {
          if (err.message && err.message.includes('timeout')) {
            this.fetchFeeds()
          } else {
            console.log(err)
          }
        })
    }
  }
}
</script>

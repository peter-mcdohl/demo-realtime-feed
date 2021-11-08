<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h1>Feed with Short Polling</h1>

      <FeedList :feeds="feeds" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      pollingId: null,
      feeds: [],
      lastIndex: -1,
      theRequest: this.$axios.CancelToken.source()
    }
  },
  mounted () {
    this.pollingId = setInterval(this.fetchFeeds, 1500)
  },
  beforeDestroy () {
    clearInterval(this.pollingId)
    this.theRequest.cancel()
  },
  methods: {
    fetchFeeds () {
      this.$axios.$get('/api/feed/short/' + this.lastIndex, {
        cancelToken: this.theRequest.token
      })
        .then((res) => {
          this.lastIndex = res.last_index
          for (let i = 0; i < res.data.length; i++) {
            this.feeds.unshift(res.data[i])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

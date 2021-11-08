<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h1>Feed with Short Polling</h1>

      <v-card
        class="mx-auto"
        tile
      >
        <v-list-item
          v-for="(item, idx) in feeds"
          :key="idx"
          three-line
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.username }} - {{ item.createdAt }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ item.message }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
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

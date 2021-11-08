<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h1>Feed with Long Polling</h1>

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

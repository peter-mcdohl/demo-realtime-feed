<template>
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
        <v-list-item-title>{{ item.username }} - {{ datetimeString(item.createdAt) }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ item.message }}
        </v-list-item-subtitle>
        <v-divider
          :key="idx"
        />
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  props: {
    feeds: {
      type: Array,
      default: null
    }
  },
  methods: {
    datetimeString: (ts) => {
      const dt = new Date(ts)
      return dt.toUTCString()
    }
  }
}
</script>

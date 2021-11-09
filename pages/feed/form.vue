<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <h1>Form</h1>

      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="postMessage"
      >
        <v-text-field
          v-model="username"
          :counter="15"
          :rules="usernameRules"
          label="UserName"
          required
        />

        <v-textarea
          v-model="message"
          :rules="messageRules"
          name="message"
          label="Message"
          no-resize
          rows="2"
          required
        />

        <v-btn
          type="submit"
          class="mr-4"
          :disabled="!valid"
        >
          submit
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    username: '',
    usernameRules: [
      v => !!v || 'UserName is required',
      v => (v && v.length <= 15) || 'UserName must be less than 15 characters'
    ],
    message: '',
    messageRules: [
      v => !!v || 'Message is required'
    ]
  }),
  methods: {
    postMessage () {
      this.$axios.post('/api/feed', {
        username: this.username,
        message: this.message
      })
        .then((res) => {
          this.message = ''
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

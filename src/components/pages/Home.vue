<template>
  <div class="app">
    <div class="app__img" />
    <HelloWorld msg="Welcome to Your Vue.js App"/>

    <v-layout align-center>

      <v-flex xs12 sm4 text-xs-center>
        <div>
          <v-btn depressed>Normal</v-btn>
        </div>
        <div>
          <v-btn depressed color="primary" @click="test" disabled>Primary</v-btn>
        </div>
        <div>
          <v-btn color="error">Error</v-btn>
        </div>
        <div>
          <v-btn depressed disabled>Disabled</v-btn>
        </div>
      </v-flex>

      <form>
        <v-flex xs12 sm6 md3>
          <v-text-field
            placeholder="Placeholder"
            solo
          ></v-text-field>
        </v-flex>

        <v-btn>submit</v-btn>
        <v-btn>clear</v-btn>
      </form>
    </v-layout>
  </div>
</template>

<script>
import HelloWorld from '../particles/cards/HelloWorld';

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    test() {
      console.log('disabled');
    }
  }
};
</script>

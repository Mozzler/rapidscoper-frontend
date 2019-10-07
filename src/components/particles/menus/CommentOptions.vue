<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" class="dropdown-action" :style="{ top: '2px' }">
        <v-icon>more_vert</v-icon>
      </v-btn>
    </template>
    <div class="dropdown-list">
      <v-list>
        <v-list-tile v-for="(action, key) in list"
                     :key="key"
                     @click="() => handleAction(action)">
          <v-list-tile-content>
            <v-list-tile-title>
              <span>{{ action }}</span>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: 'CommentOptions',
  data () {
    return {
      list: ['Edit', 'Delete']
    };
  },
  methods: {
    handleAction (action) {
      const method = action.toLowerCase();
      this.$emit(`${method}-mode`);
    }
  }
};
</script>

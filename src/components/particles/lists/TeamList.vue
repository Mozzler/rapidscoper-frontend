<template>
  <v-list>
    <v-list-tile
      v-for="(number, key) in teams"
      :key="key" class="sidebar__item"
      :class="{'sidebar__item--active': $route.params.name === itemToParam(key)}"
      @click="() => goTo(key, 'team')">
      <v-list-tile-content>
        <v-list-tile-title>
          <v-layout align-center justify-space-between row fill-height>
            <span>
              {{ key }} <div class="red-circle" />
            </span>
            <span class="text-greyed">{{ number }}</span>
          </v-layout>
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
import Navigation from '@/mixins/navigation';

export default {
  name: 'TeamList',
  mixins: [
    Navigation
  ],
  data() {
    return {
      teams: {
        'The Bumpy Hamsters': 16,
        'West World': 3,
        'The Ramblers': 1
      }
    }
  }
}
</script>

<style scoped>

</style>

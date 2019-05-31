<template>
  <div class="story-section pt-4">
    <div class="navigation__title">
      user story sections
    </div>
    <v-list>
      <v-list-tile v-for="(item, key) in items" :key="key" class="sidebar__item">
        <v-list-tile-content>
          <v-list-tile-title>
            <v-layout align-center justify-space-between row fill-height>
              <span>{{ item }}</span>
            </v-layout>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "StorySection",
  data() {
    return {
      items: [
        'Mobile Sign Up', 'Login', 'Send Message'
      ]
    }
  }
}
</script>

<style scoped>

</style>

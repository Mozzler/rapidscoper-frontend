<template>
  <v-layout align-center justify-center class="filter__search">
    <v-icon class="mr-2">search</v-icon>
    <input
      v-model="search"
      @focus="() => searchFocused = true"
      @blur="() => searchFocused = false"
      class="user-story__input-field"
      placeholder="Search" />

    <v-flex shrink>
      <v-layout align-center row fill-height v-if="true" class="icon-group">
        <div class="text-greyed white-space-nowrap">0 of 0 | </div>
        <v-icon>keyboard_arrow_down</v-icon>
        <v-icon>keyboard_arrow_up</v-icon>
        <v-icon>cancel</v-icon>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "FilterInput",
  data () {
    return {
      searchFocused: null
    };
  },
  computed: {
    ...mapGetters({
      filters: 'story/filters'
    }),
    search: {
      get () {
        return this.filters.search;
      },
      set (value) {
        this.$store.commit('story/updateFilters', {
          type: 'search',
          set: value
        });
      }
    }
  }
};
</script>
